# Face Detection Video Processing

A Python application that performs real-time face detection on video files using OpenCV's DNN module with a pre-trained Caffe model. The application processes video files frame by frame, detects faces, draws bounding boxes around detected faces, and outputs the processed video.

## Features

- **Face Detection**: Uses a pre-trained Caffe model for accurate face detection
- **Video Processing**: Processes entire video files frame by frame
- **Confidence Filtering**: Filters out weak detections based on configurable confidence threshold
- **Bounding Box Visualization**: Draws red bounding boxes around detected faces with confidence percentages
- **Video Output**: Saves processed video with face detections as MP4 file
- **Optional Face Obfuscation**: Code includes commented sections for face blurring or blocking

## Requirements

### Dependencies
```
opencv-python (cv2)
numpy
imutils
argparse
```

### Model Files
You'll need the following Caffe model files:
- **Prototxt file**: Model architecture definition (deploy.prototxt)
- **Model file**: Pre-trained weights (.caffemodel)

You can download these from OpenCV's face detection models or use the DNN face detection model from OpenCV's repository.

## Installation

1. Clone or download this repository
2. Install required dependencies:
```bash
pip install opencv-python numpy imutils
```
3. Download the required Caffe model files (prototxt and caffemodel)

## Usage

### Command Line Arguments

```bash
python facialrec.py -p <prototxt_path> -m <model_path> -v <video_path> [-c <confidence>]
```

### Required Arguments:
- `-p, --prototxt`: Path to Caffe 'deploy' prototxt file
- `-m, --model`: Path to Caffe pre-trained model file
- `-v, --video`: Path to input video file

### Optional Arguments:
- `-c, --confidence`: Minimum probability threshold to filter weak detections (default: 0.5)

### Example Usage:
```bash
python facialrec.py -p deploy.prototxt -m res10_300x300_ssd_iter_140000.caffemodel -v input_video.mp4 -c 0.7
```

## Output

The application generates:
- **Console Output**: 
  - Video dimensions (height, width)
  - Total number of frames
  - Current frame being processed
- **Video File**: `facialdetection_video.mp4` containing the processed video with face detection overlays

## How It Works

1. **Video Analysis**: First pass through the video to determine total frames and dimensions
2. **Model Loading**: Loads the Caffe DNN model for face detection
3. **Frame Processing**: 
   - Reads each frame from the input video
   - Preprocesses the frame (resize to 300x300, normalize)
   - Runs face detection using the DNN model
   - Filters detections based on confidence threshold
   - Draws bounding boxes and confidence percentages on detected faces
4. **Video Writing**: Saves the processed frame to the output video file

## Project Structure

```
Face detection/
├── facialrec.py              # Main application script
├── video/                    # Directory containing sample videos
│   ├── facialdetection_BBox_02.mp4
│   ├── facialdetection_BBox_01.mp4
│   ├── facialdetection_blockedvideo_01.mp4
│   ├── facialdetection_blurvideo_01.mp4
│   └── facialdetection_video_01.mp4
│   └── test_video_01.mp4
└── README.md                 # This file
```

## Additional Features (Commented Code)

The script includes commented code for additional face processing options:

### Face Blocking
```python
# Creates a black box in our bbox
image[startY:endY, startX:endX] = (0,0,0)
```

### Face Blurring
```python
# Blur the detected face area
face_area = image[startY:endY, startX:endX]
face_area = cv2.blur(face_area, (21,21), 0)
# Replace original face with blurred version
```

## Configuration

### Video Output Settings
- **Codec**: MP4V (0x7634706d)
- **Frame Rate**: 30 FPS
- **Resolution**: Maintains original video dimensions

### Detection Parameters
- **Input Size**: 300x300 pixels (for DNN processing)
- **Mean Subtraction**: (104.0, 177.0, 123.0) - typical for face detection models
- **Scale Factor**: 1.0

## Troubleshooting

### Common Issues:
1. **Model files not found**: Ensure prototxt and caffemodel files are in the correct path
2. **Video not loading**: Check video file format and path
3. **Low detection accuracy**: Adjust confidence threshold or try different model
4. **Performance issues**: Consider reducing video resolution or processing every nth frame

### Supported Video Formats:
- MP4, AVI, MOV, and other OpenCV-supported formats

## Credits

- Video sample credited to "PNW Production from Pexels"
- Uses OpenCV's DNN module for face detection
- Built with Python and OpenCV

## License

This project is provided as-is for educational and research purposes.
