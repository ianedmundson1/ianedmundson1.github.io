export interface PersonalProject {
  title: string;
  summary: string;
  tech: string[];
  href: string;
  youtube?: string;
}

export const PROJECTS: PersonalProject[] = [
  {
    title: 'Facial Detection System',
    summary:
      'Real-time face detection and emotion recognition using deep-learning models and OpenCV for live video processing.',
    tech: ['OpenCV', 'Python', 'Deep Learning', 'Real-time Processing'],
    href: 'https://github.com/ianedmundson1/Facial-detection',
    youtube: 'https://www.youtube.com/watch?v=0VEvEf_r25U',
  },
  {
    title: 'Lane Detection Algorithm',
    summary:
      'Lane detection for autonomous-driving applications using computer vision and image-processing techniques, robust across varying lighting and road conditions.',
    tech: ['Computer Vision', 'Image Processing', 'OpenCV', 'Autonomous Vehicles'],
    href: 'https://github.com/ianedmundson1/Lane-detection',
    youtube: 'https://www.youtube.com/watch?v=0klrGBsJtYY',
  },
  {
    title: 'IoT Security Camera System',
    summary:
      'Raspberry Pi-based security camera with motion detection, cloud storage, and automated notifications for end-to-end home surveillance.',
    tech: ['Raspberry Pi', 'IoT', 'Motion Detection', 'Cloud Storage'],
    href: 'https://github.com/ianedmundson1/Security-camera',
  },
];
