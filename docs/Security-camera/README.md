# Ring Doorbell Security Camera System

A Raspberry Pi-based security camera system that mimics Ring doorbell functionality. The system continuously monitors for motion at your front door, records video when movement is detected, and sends email notifications with attached images.

## 🎯 Features

- **Motion Detection**: Intelligent pixel-based motion detection with customizable sensitivity
- **Video Recording**: Automatic H.264 video recording when motion is detected
- **Email Notifications**: Sends email alerts with timestamp and attached images
- **Cloud Storage**: Uploads videos to Dropbox automatically
- **Custom Masking**: Configurable detection zones to focus on specific areas
- **Logging**: Maintains detailed logs of detection events with timestamps
- **YAML Configuration**: Easy-to-modify settings without code changes

## 🛠️ Hardware Requirements

- Raspberry Pi (3B+ or newer recommended)
- Raspberry Pi Camera Module
- MicroSD Card (16GB or larger)
- Stable internet connection
- Power supply for Raspberry Pi

## 📋 Software Dependencies

### Python Packages
```bash
pip install opencv-python
pip install imutils
pip install numpy
pip install pyyaml
```

### System Tools
- `raspistill` - Raspberry Pi camera capture tool
- `raspivid` - Raspberry Pi video recording tool
- `MP4Box` - Video format conversion (install via `sudo apt install gpac`)

### External Services
- Gmail account (for email notifications)
- Dropbox account with [Dropbox-Uploader](https://github.com/andreafabrizi/Dropbox-Uploader) configured

## ⚙️ Configuration

The system uses a YAML configuration file (`config.yaml`) for easy customization:

```yaml
camera:
  width: 640              # Camera resolution width
  height: 480             # Camera resolution height
  fps: 30                 # Video frame rate
  video_duration: 30000   # Recording duration in milliseconds

detection:
  pixel_threshold: 50     # Pixel change threshold for motion detection
  detector_threshold: 30000 # Total change threshold to trigger recording

email:
  smtp_server: "smtp.gmail.com"
  smtp_port: 587
  user: "your-email@gmail.com"     # Your Gmail address
  pass: "your-app-password"        # Gmail app password (not regular password)
  to_email: "recipient@gmail.com"  # Where to send notifications

paths:
  dropbox_uploader: "/home/pi/Dropbox-Uploader/dropbox_uploader.sh"
  upload_path: "/Apps/GPIO"        # Dropbox upload directory
  log_file: "ringlog.txt"          # Log file location
```

## 🚀 Installation & Setup

### 1. Raspberry Pi Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required system packages
sudo apt install python3-pip gpac -y

# Enable camera interface
sudo raspi-config
# Navigate to: Interface Options > Camera > Enable
```

### 2. Python Dependencies
```bash
pip3 install opencv-python imutils numpy pyyaml
```

### 3. Dropbox Integration
```bash
# Download and setup Dropbox-Uploader
cd /home/pi
git clone https://github.com/andreafabrizi/Dropbox-Uploader.git
cd Dropbox-Uploader
chmod +x dropbox_uploader.sh
./dropbox_uploader.sh
# Follow the setup wizard to authenticate with Dropbox
```

### 4. Gmail App Password
1. Enable 2-factor authentication on your Gmail account
2. Generate an [App Password](https://support.google.com/accounts/answer/185833)
3. Use this app password in your `config.yaml` file

### 5. Configuration
1. Copy the project files to your Raspberry Pi
2. Update `config.yaml` with your specific settings:
   - Email credentials
   - Dropbox uploader path
   - Camera settings
   - Detection thresholds

## 🏃‍♂️ Usage

### Running the System
```bash
cd /path/to/security-camera
python3 security_camera.py
```

### Running as a Service (Optional)
Create a systemd service for automatic startup:

```bash
sudo nano /etc/systemd/system/ring-camera.service
```

Add the following content:
```ini
[Unit]
Description=Ring Camera Security System
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/security-camera/security_camera.py
WorkingDirectory=/home/pi/security-camera
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable ring-camera.service
sudo systemctl start ring-camera.service
```

## 🔧 How It Works

1. **Initialization**: Captures a reference image for motion comparison
2. **Continuous Monitoring**: Takes new images every 10ms and compares with reference
3. **Motion Detection**: Uses pixel-difference analysis with configurable thresholds
4. **Masking**: Applies custom polygon masks to focus detection on door area
5. **Trigger Response**: When motion exceeds threshold:
   - Records H.264 video for specified duration
   - Converts to MP4 format
   - Uploads to Dropbox
   - Sends email notification with images
   - Logs event with timestamp

## 📊 Detection Algorithm

The motion detection uses a sophisticated approach:

- **Image Masking**: Custom polygon masks focus detection on the door area
- **Gaussian Blur**: Reduces noise for more reliable detection
- **Pixel Threshold**: Configurable sensitivity for pixel-level changes
- **Total Change Threshold**: Prevents false triggers from minor movements
- **Grayscale Conversion**: Improves processing speed and accuracy

## 📁 File Structure

```
security-camera/
├── security_camera.py    # Main application code
├── config.yaml          # Configuration file
├── README.md            # This file
├── images/              # Directory for captured images
├── ringlog.txt          # Detection log file
├── test1.jpg            # Reference image
└── test2.jpg            # Comparison image
```

## 🔍 Troubleshooting

### Common Issues

**Camera not working:**
```bash
# Check if camera is enabled
vcgencmd get_camera

# Test camera manually
raspistill -o test.jpg
```

**Email not sending:**
- Verify Gmail app password (not regular password)
- Check 2-factor authentication is enabled
- Ensure less secure app access is enabled

**Dropbox upload failing:**
- Re-run Dropbox-Uploader setup: `./dropbox_uploader.sh`
- Check internet connectivity
- Verify upload path exists in Dropbox

**High false positive rate:**
- Increase `detector_threshold` in config.yaml
- Adjust `pixel_threshold` for sensitivity
- Modify mask coordinates for your specific door area

### Log Analysis
Monitor the detection log:
```bash
tail -f ringlog.txt
```

## 🛡️ Security Considerations

- Store email credentials securely (use app passwords, not main passwords)
- Consider using environment variables for sensitive data
- Regularly update system packages
- Monitor Dropbox storage usage
- Review detection logs for unusual activity

## 📝 Customization

### Adjusting Detection Zone
Modify the `mask_image()` function to change the detection area:
```python
# Example: Adjust polygon points for your door area
pts = np.array([[x1, y1], [x2, y2], [x3, y3], ...], dtype=np.int32)
```

### Changing Video Quality
Update camera settings in `config.yaml`:
```yaml
camera:
  width: 1280    # Higher resolution
  height: 720
  fps: 60        # Smoother video
```

## 📄 License

This project was developed for ENME489Y Spring 2019. Feel free to modify and distribute according to your institution's policies.

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Raspberry Pi hardware
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review Raspberry Pi camera documentation
- Verify all dependencies are properly installed
- Test individual components (camera, email, Dropbox) separately

---

**Note**: This system is designed for educational purposes and basic home security. For critical security applications, consider commercial solutions with professional monitoring.
