import os
import cvzone
import cv2
from cvzone.PoseModule import PoseDetector

# Initialize the webcam and pose detector
cap = cv2.VideoCapture(0)
detector = PoseDetector()

# Define shirt resources and variables
shirtFolderPath = "Resources/Shirts"
listShirts = os.listdir(shirtFolderPath)
fixedRatio = 262 / 190  # widthOfShirt/widthOfPoint11to12
shirtRatioHeightWidth = 581 / 440
imageNumberShirt = 0
scalingFactorShirt = 1.15  # Scaling factor to make the shirt slightly larger

# Define pants resources and variables
pantsFolderPath = "Resources/Pants"
listPants = os.listdir(pantsFolderPath)
pantsRatioHeightWidth = 1.2  # Adjust based on your pants images aspect ratio
imageNumberPants = 0
scalingFactorPants = 1.3  # Scaling factor for pants

# Define button resources and counters
imgButtonRight = cv2.imread("Resources/button.png", cv2.IMREAD_UNCHANGED)
imgButtonLeft = cv2.flip(imgButtonRight, 1)
counterRightShirt = 0
counterLeftShirt = 0
counterRightPants = 0
counterLeftPants = 0
selectionSpeed = 10
selectionMode = "shirt"  # Start with shirt selection mode

while True:
    success, img = cap.read()
    # Detect pose but don't draw landmarks
    img = detector.findPose(img, draw=False)
    lmList, bboxInfo = detector.findPosition(img, bboxWithHands=False, draw=False)

    if lmList and len(lmList) >= 26:  # Ensure we have enough landmarks
        # Get landmarks for upper body (shirt)
        lm11 = lmList[11][1:3]  # Left shoulder
        lm12 = lmList[12][1:3]  # Right shoulder

        # Get landmarks for lower body (pants)
        lm23 = lmList[23][1:3]  # Left hip
        lm24 = lmList[24][1:3]  # Right hip
        lm25 = lmList[25][1:3]  # Left knee
        lm26 = lmList[26][1:3]  # Right knee

        # Optional: Draw landmarks for debugging
        landmarksToShow = [11, 12, 23, 24, 25, 26]
        for idx in landmarksToShow:
            if idx < len(lmList):
                cv2.circle(img, (lmList[idx][1], lmList[idx][2]), 5, (0, 255, 0), cv2.FILLED)

        # Process pants overlay first
        if listPants:
            try:
                imgPants = cv2.imread(os.path.join(pantsFolderPath, listPants[imageNumberPants]), cv2.IMREAD_UNCHANGED)
                if imgPants is not None:
                    # Calculate hip width and apply scaling factor explicitly
                    hipsWidth = abs(lm23[0] - lm24[0])
                    pantsWidth = int(hipsWidth * 1.2 * scalingFactorPants)  # Apply scaling factor

                    # Calculate height based on distance from hip to knee and apply scaling
                    hipToKneeDistance = ((lm25[1] + lm26[1]) / 2) - ((lm23[1] + lm24[1]) / 2)
                    pantsHeight = int(hipToKneeDistance * 2.2 * scalingFactorPants)  # Apply scaling factor

                    # Ensure we have valid dimensions
                    if pantsWidth > 0 and pantsHeight > 0:
                        # Resize pants with calculated dimensions
                        imgPants = cv2.resize(imgPants, (pantsWidth, pantsHeight))

                        # Calculate position (center of hips)
                        # Horizontally: Center pants based on hip width
                        pantsX = int((lm23[0] + lm24[0]) / 2 - pantsWidth / 2)

                        # Vertically: Position pants at hip level, but higher than before
                        # MODIFIED: Position pants higher by adjusting the vertical positioning
                        hipsY = int((lm23[1] + lm24[1]) / 2)
                        # Change from -0.05 to -0.25 to move pants higher (25% of height instead of 5%)
                        pantsY = hipsY - int(0.25 * pantsHeight)

                        # Overlay the pants image
                        img = cvzone.overlayPNG(img, imgPants, (pantsX, pantsY))
                else:
                    print(f"Error loading pants image: {listPants[imageNumberPants]}")
            except Exception as e:
                print(f"Error processing pants: {e}")

        # Process shirt overlay AFTER pants
        if listShirts:
            try:
                imgShirt = cv2.imread(os.path.join(shirtFolderPath, listShirts[imageNumberShirt]), cv2.IMREAD_UNCHANGED)
                if imgShirt is not None:
                    # Calculate shoulder width and apply scaling
                    shoulderWidth = abs(lm11[0] - lm12[0])
                    widthOfShirt = int(shoulderWidth * fixedRatio * scalingFactorShirt)

                    # Extend shirt length to cover waist
                    extendedRatio = shirtRatioHeightWidth * 1.15  # Increase height by 15%
                    imgShirt = cv2.resize(imgShirt, (widthOfShirt, int(widthOfShirt * extendedRatio)))

                    # Calculate offset
                    currentScaleShirt = shoulderWidth / 190
                    offsetShirt = (
                        int(44 * currentScaleShirt * scalingFactorShirt),
                        int(48 * currentScaleShirt * scalingFactorShirt)
                    )

                    # Calculate position to ensure shirt covers waist
                    hipLevel = int((lm23[1] + lm24[1]) / 2)
                    shirtY = lm12[1] - offsetShirt[1]
                    shirtHeight = int(widthOfShirt * extendedRatio)
                    shirtBottom = shirtY + shirtHeight

                    # Ensure shirt extends to cover waist
                    if shirtBottom < hipLevel + 20:  # +20 pixels for overlap
                        # Extend shirt further if needed
                        additionalExtension = ((hipLevel + 20) - shirtBottom) / shirtHeight
                        newRatio = extendedRatio * (1 + additionalExtension)
                        imgShirt = cv2.resize(imgShirt, (widthOfShirt, int(widthOfShirt * newRatio)))

                    # Overlay the shirt on top of pants
                    img = cvzone.overlayPNG(img, imgShirt, (lm12[0] - offsetShirt[0], shirtY))
                else:
                    print(f"Error loading shirt image: {listShirts[imageNumberShirt]}")
            except Exception as e:
                print(f"Error processing shirt: {e}")

        # Control logic for switching between shirt and pants selection
        key = cv2.waitKey(1)
        if key == ord('m') or key == ord('M'):  # 'M' key to switch modes
            selectionMode = "pants" if selectionMode == "shirt" else "shirt"
            print(f"Switched to {selectionMode} selection mode")

        # Hand position detection for item selection
        if selectionMode == "shirt":
            # Check right hand position (for next shirt)
            if lmList[16][1] < 300:  # Right wrist x-position
                counterRightShirt += 1
                # cv2.ellipse(img, (100, 360), (66, 66), 0, 0,
                #             counterRightShirt * selectionSpeed, (0, 255, 0), 20)
                if counterRightShirt * selectionSpeed > 360:
                    counterRightShirt = 0
                    if imageNumberShirt < len(listShirts) - 1:
                        imageNumberShirt += 1
            # Check left hand position (for previous shirt)
            elif lmList[15][1] > img.shape[1] - 300:  # Left wrist x-position
                counterLeftShirt += 1
                # cv2.ellipse(img, (img.shape[1] - 100, 360), (66, 66), 0, 0,
                #             counterLeftShirt * selectionSpeed, (0, 255, 0), 20)
                if counterLeftShirt * selectionSpeed > 360:
                    counterLeftShirt = 0
                    if imageNumberShirt > 0:
                        imageNumberShirt -= 1
            else:
                counterRightShirt = 0
                counterLeftShirt = 0
        else:  # pants selection mode
            # Check right hand position (for next pants)
            if lmList[16][1] < 300:
                counterRightPants += 1
                # cv2.ellipse(img, (100, 460), (66, 66), 0, 0,
                #             counterRightPants * selectionSpeed, (0, 0, 255), 20)
                if counterRightPants * selectionSpeed > 360:
                    counterRightPants = 0
                    if imageNumberPants < len(listPants) - 1:
                        imageNumberPants += 1
            # Check left hand position (for previous pants)
            elif lmList[15][1] > img.shape[1] - 300:
                counterLeftPants += 1
                # cv2.ellipse(img, (img.shape[1] - 100, 460), (66, 66), 0, 0,
                #             counterLeftPants * selectionSpeed, (0, 0, 255), 20)
                if counterLeftPants * selectionSpeed > 360:
                    counterLeftPants = 0
                    if imageNumberPants > 0:
                        imageNumberPants -= 1
            else:
                counterRightPants = 0
                counterLeftPants = 0

        # Display current selection mode
        cv2.putText(img, f"Mode: {selectionMode.upper()}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1,
                    (0, 255, 0) if selectionMode == "shirt" else (0, 0, 255), 2)
        cv2.putText(img, "Press 'M' to switch modes", (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # Display scaling factor values
        cv2.putText(img, f"Pants Scale: {scalingFactorPants:.1f}", (10, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                    (0, 0, 255), 2)
        cv2.putText(img, f"Shirt Scale: {scalingFactorShirt:.1f}", (10, 170), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                    (0, 255, 0), 2)
        cv2.putText(img, "Press '+'/'-' to adjust", (10, 210), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        # Add keyboard controls for scaling factors
        if key == ord('+'):
            if selectionMode == "pants":
                scalingFactorPants += 0.1
            else:
                scalingFactorShirt += 0.1
        elif key == ord('-'):
            if selectionMode == "pants":
                scalingFactorPants = max(0.5, scalingFactorPants - 0.1)
            else:
                scalingFactorShirt = max(0.5, scalingFactorShirt - 0.1)

    # Display the resulting frame
    cv2.imshow("Virtual Try-On", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to quit
        break

# Release the webcam and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
