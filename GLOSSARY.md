# ianedmundson.github.io

Portfolio site with live data-science demos backed by a FastAPI tier.

## Language

### Emotion classification

**Emotion classification**:
Assigning one emotion label, with a confidence, to the face in a submitted image.
_Avoid_: emotion detection, emotion identification, emotion scoring

**Emotion label**:
The single emotion the classifier assigns to a face, for example "happy".
_Avoid_: prediction, emotion (when meaning the output)

**Emotion model**:
The trained network that assigns an emotion label and confidence to a prepared face image. One step inside emotion classification, not the whole of it.
_Avoid_: scorer, endpoint, classifier

**Confidence**:
How sure the classifier is of the emotion label, expressed as a whole percent.
_Avoid_: score, probability
