import os
import logging
import io
import numpy as np
import pandas as pd
from PIL import Image
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.serving import DataframeSplitInput

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Simple FastAPI + React App")

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

# --- Databricks Model Helpers ---
def score_model(dataset):
    endpoint_name = 'emotional-identifier'
    client = WorkspaceClient(host=os.environ["DATABRICKS_HOST"],
                             token=os.environ["DATABRICKS_TOKEN"])

    if isinstance(dataset, pd.DataFrame):
        split = dataset.to_dict(orient='split')
        dataframe_split = DataframeSplitInput(
            columns=split.get('columns'),
            data=split.get('data'),
            index=split.get('index'),
        )
        result = client.serving_endpoints.query(name=endpoint_name, dataframe_split=dataframe_split)
    else:
        # Numpy array — pass as raw inputs
        inputs = dataset.tolist()
        result = client.serving_endpoints.query(name=endpoint_name, inputs=inputs)

    return result.as_dict()

# --- API Routes ---
@app.get("/api/hello")
async def hello():
    logger.info("Accessed /api/hello")
    return {"message": "Hello from FastAPI!"}

@app.get("/api/health")
async def health_check():
    logger.info("Health check at /api/health")
    return {"status": "healthy"}

@app.get("/api/data")
async def get_data():
    logger.info("Data requested at /api/data")
    data = [{"x": x, "y": 2 ** x} for x in range(30)]
    return {
        "data": data,
        "title": "Hello world!",
        "x_title": "Apps",
        "y_title": "Fun with data"
    }

@app.post("/api/emotion_classification")
async def post_emotion_classification(file: UploadFile = File(...)):
    logger.info("Processing emotion classification request")
    try:
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=415, detail=f"Unsupported file type '{file.content_type}'. Allowed: JPEG, PNG, WebP")

        contents = await file.read()

        if len(contents) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="File exceeds 10 MB limit")
        # 1. Read the uploaded image file
        image = Image.open(io.BytesIO(contents))

        # 2. Preprocess the image
        # Resize to 48x48 (standard for many emotion models like FER2013)
        # Adjust dimensions if your model expects something else (e.g., 224x224)
        target_size = (48, 48)
        image = image.resize(target_size)
        
        # Convert to RGB (3 channels)
        image = image.convert('RGB')
        
        # Convert to numpy array as float32.
        # NOTE: The Databricks emotion model expects raw 0–255 float pixel values and performs any needed scaling internally,
        # so we intentionally do NOT normalize here (the previous `/ 255.0` was disabled on purpose).
        img_array = np.array(image).astype(np.float32)  # / 255.0
        
        # Add batch dimension: shape becomes (1, 48, 48, 3)
        input_data = np.expand_dims(img_array, axis=0)

        # 3. Call the Databricks model
        logger.info(f"Calling Databricks model with shape: {input_data.shape}")
        result = score_model(input_data)
        
        return result

    except Exception as e:
        logger.error(f"Error in emotion classification: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Static Files Setup ---
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)

# Using a custom catch-all route below instead of StaticFiles mount for SPA routing.
#app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

# --- Catch-all for React Routes ---
@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    # 1. First, try to serve the actual file (css, js, images, favicon)
    file_path = os.path.join(static_dir, full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)

    # 2. If file doesn't exist, serve index.html (SPA fallback for /projects, etc.)
    index_html = os.path.join(static_dir, "index.html")
    if os.path.exists(index_html):
        logger.info(f"Serving React frontend for path: /{full_path}")
        return FileResponse(index_html)
    
    logger.error("Frontend not built. index.html missing.")
    raise HTTPException(
        status_code=404,
        detail="Frontend not built. Please run 'npm run build' first."
    )