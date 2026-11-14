from dotenv import load_dotenv
import os
import logging
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request 
from fastapi.responses import FileResponse
from pydantic import EmailStr, NameEmail, SecretStr, BaseModel
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
import sentry_sdk
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from backend.analytics.router import router as analytics_router


# Each tier has independent dev/test/prod envs. APP_ENV selects which
# backend/.env.<env> file to layer on top of the process environment. Values
# already in os.environ win (so Docker/CI overrides are not clobbered).
APP_ENV = os.environ.get("APP_ENV", "development")
_env_file = Path(__file__).parent / f".env.{APP_ENV}"
if _env_file.is_file():
    load_dotenv(_env_file, override=False)
    
# Imported after load_dotenv: ratelimit reads TRUSTED_CLIENT_IP_HEADER at import time.
from backend.ratelimit import limiter
from backend.emotion.router import router as emotion_router


sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN", ""),
    traces_sample_rate=float(os.environ.get("SENTRY_TRACES_SAMPLE_RATE", "0")),
    profiles_sample_rate=float(os.environ.get("SENTRY_PROFILES_SAMPLE_RATE", "0")),
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Simple FastAPI + React App")



app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.include_router(analytics_router)

app.include_router(emotion_router)

@app.exception_handler(RateLimitExceeded)
async def _rate_limit_handler(_request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": f"Rate limit exceeded: {exc.detail}"})

@app.get("/api/hello")
async def hello():
    logger.info("Accessed /api/hello")
    return {"message": "Hello from FastAPI!"}


@app.get("/api/health")
@limiter.exempt
async def health_check():
    return {"status": "healthy"}


@app.get("/api/ready")
async def readiness_check():
    # Liveness vs. readiness: this confirms the Databricks credentials are
    # configured so traffic-routing systems can hold back from the pod until
    # an actual call to the model would have a chance of succeeding. We do
    # NOT call the model here, that would burn paid quota on every probe.
    host = os.environ.get("DATABRICKS_HOST")
    token = os.environ.get("DATABRICKS_TOKEN")
    if not host or not token:
        raise HTTPException(status_code=503, detail="Databricks credentials not configured")
    return {"status": "ready"}



class ContactPayload(BaseModel):
    name: str
    email: EmailStr
    message: str

@app.post("/api/contact")
@limiter.limit("5/minute")
async def contact(request: Request, payload: ContactPayload) -> dict[str, str]:
    
    try: 
        mail_config = ConnectionConfig(
            MAIL_USERNAME=os.environ["MAIL_USERNAME"],
            MAIL_PASSWORD=SecretStr(os.environ["MAIL_PASSWORD"]),
            MAIL_FROM=os.environ["MAIL_FROM"],
            MAIL_PORT=int(os.environ.get("MAIL_PORT", "587")),
            MAIL_SERVER=os.environ.get("MAIL_SERVER", "smtp.office365.com"),
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
        )
        
        message = MessageSchema(
            subject=f"Portfolio contact from {payload.name}",
            recipients=[NameEmail(name=payload.name, email=os.environ["MAIL_TO"])],
            reply_to=[NameEmail(name=payload.name, email=payload.email)],
            body=f"From: {payload.name} <{payload.email}>\n\n{payload.message}",
            subtype=MessageType.plain,
        )
        await FastMail(mail_config).send_message(message)
    except Exception:
        logger.exception("Error sending contact email")
        raise HTTPException(status_code=500, detail="Failed to send message")
    return {"status": "success"}

static_dir = os.path.realpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "static"))
os.makedirs(static_dir, exist_ok=True)

assets_dir = os.path.realpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets"))

@app.get("/api/resume")
async def get_resume():
    file_path = os.path.join(assets_dir, "resume_ian_edmundson.pdf")
    if os.path.isfile(file_path):
        return FileResponse(file_path, media_type="application/pdf", filename="resume_ian_edmundson.pdf")
    raise HTTPException(status_code=404, detail="Resume not found.")

@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    # Try to serve the actual file (css, js, images, favicon), with a path
    # check to prevent traversal out of static_dir via "../" segments.
    if full_path:
        candidate = os.path.realpath(os.path.join(static_dir, full_path))
        if (candidate == static_dir or candidate.startswith(static_dir + os.sep)) \
                and os.path.isfile(candidate):
            return FileResponse(candidate)

    # SPA fallback: serve index.html for unknown paths so /projects, etc. work.
    index_html = os.path.join(static_dir, "index.html")
    if os.path.isfile(index_html):
        logger.info(f"Serving React frontend for path: /{full_path}")
        return FileResponse(index_html)

    logger.error("Frontend not built. index.html missing.")
    raise HTTPException(
        status_code=404,
        detail="Frontend not built. Please run 'npm run build' first."
    )