import cv2
import numpy as np
import os

# 1. Load the pre-trained face detection model (Haar Cascade)
# This model is built into OpenCV and is great for detecting faces.
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 2. Open the default webcam (0 is usually the built-in webcam)
cap = cv2.VideoCapture(0)

# 3. Try to load the wooden frame image
# Make sure you have a 'wooden_frame.png' in the same folder as this script.
# The image should ideally have a transparent center (an alpha channel).
# cv2.IMREAD_UNCHANGED ensures the alpha channel (transparency) is loaded.
frame_image_path = 'wooden_frame.png'
if os.path.exists(frame_image_path):
    wooden_frame = cv2.imread(frame_image_path, cv2.IMREAD_UNCHANGED)
else:
    wooden_frame = None
    print("Warning: 'wooden_frame.png' not found. We will draw a simple colored frame instead.")
    print("To see the wooden frame, please add a 'wooden_frame.png' (with a transparent center) to the same directory.")

# A helper function to overlay an image with transparency (alpha channel)
def overlay_transparent(background, overlay, x, y):
    bg_h, bg_w, bg_channels = background.shape
    ol_h, ol_w, ol_channels = overlay.shape

    # Check if the overlay has an alpha channel (4 channels: B, G, R, Alpha)
    if ol_channels == 4:
        # Extract the alpha mask (values between 0 and 1)
        alpha = overlay[:, :, 3] / 255.0
        # The inverse of the alpha mask for the background
        inv_alpha = 1.0 - alpha

        # Iterate over the 3 color channels (Blue, Green, Red)
        for c in range(3):
            background[y:y+ol_h, x:x+ol_w, c] = (alpha * overlay[:, :, c] +
                                                 inv_alpha * background[y:y+ol_h, x:x+ol_w, c])
    else:
        # If no alpha channel, just paste the image normally
        background[y:y+ol_h, x:x+ol_w] = overlay

    return background

print("Press 'q' on your keyboard to quit the application.")

# 4. Start an infinite loop to process the video frame by frame
while True:
    # Read a single frame from the webcam
    # 'ret' is a boolean indicating if the read was successful
    # 'img' is the actual image array
    ret, img = cap.read()

    # If reading failed, stop the loop
    if not ret:
        print("Failed to grab frame from webcam. Exiting...")
        break

    # Flip the image horizontally like a mirror (optional, but feels more natural)
    img = cv2.flip(img, 1)

    # Convert the image to grayscale (face detection works better on grayscale images)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 5. Detect faces in the grayscale image
    # scaleFactor: Parameter specifying how much the image size is reduced at each image scale.
    # minNeighbors: Parameter specifying how many neighbors each candidate rectangle should have to retain it.
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(100, 100))

    # 6. Loop through every face detected
    for (x, y, w, h) in faces:
        
        # Calculate padding so the frame is a bit larger than the actual face
        padding_w = int(w * 0.3)
        padding_h = int(h * 0.3)
        
        # Calculate the new coordinates and dimensions for the frame
        frame_x = max(0, x - padding_w)
        frame_y = max(0, y - padding_h)
        frame_w = w + (padding_w * 2)
        frame_h = h + (padding_h * 2)
        
        # Ensure the frame doesn't go outside the boundaries of the webcam image
        if frame_x + frame_w > img.shape[1]:
            frame_w = img.shape[1] - frame_x
        if frame_y + frame_h > img.shape[0]:
            frame_h = img.shape[0] - frame_y

        # Draw a blue border directly around the detected face
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 3)

        # If we successfully loaded a wooden frame image
        if wooden_frame is not None:
            try:
                # Resize the wooden frame to fit the new dimensions
                resized_frame = cv2.resize(wooden_frame, (frame_w, frame_h))
                
                # Overlay the resized frame onto our webcam image
                img = overlay_transparent(img, resized_frame, frame_x, frame_y)
            except Exception as e:
                # In case of dimension errors at the edges, fallback to a drawn rectangle
                cv2.rectangle(img, (frame_x, frame_y), (frame_x + frame_w, frame_y + frame_h), (0, 100, 200), 5)
        else:
            # Fallback: Draw a simple brown rectangle if no image is found
            # Color is in BGR format, so (0, 100, 200) is a nice brown
            thickness = 10
            cv2.rectangle(img, (frame_x, frame_y), (frame_x + frame_w, frame_y + frame_h), (0, 100, 200), thickness)
            
            # Put some text to indicate the fallback
            cv2.putText(img, "Frame Image Missing", (frame_x, frame_y - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 100, 200), 2)

    # 7. Display the resulting image in a window
    cv2.imshow('Face with Wooden Frame', img)

    # 8. Wait for 1 millisecond, and check if the 'q' key is pressed to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 9. Clean up when everything is done
cap.release()          # Release the webcam
cv2.destroyAllWindows() # Close the video window
