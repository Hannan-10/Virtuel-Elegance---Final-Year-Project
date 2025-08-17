# import os
# import cv2
# import cvzone
# import base64
# import numpy as np
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from cvzone.PoseModule import PoseDetector
#
# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes
#
# # Initialize the pose detector
# detector = PoseDetector()
#
# # Define shirt resources and variables
# shirtFolderPath = "Resources/Shirts"
# listShirts = os.listdir(shirtFolderPath)
# fixedRatio = 262 / 190  # widthOfShirt/widthOfPoint11to12
# shirtRatioHeightWidth = 581 / 440
# scalingFactorShirt = 1.15  # Scaling factor to make the shirt slightly larger
#
# # Define pants resources and variables
# pantsFolderPath = "Resources/Pants"
# listPants = os.listdir(pantsFolderPath)
# pantsRatioHeightWidth = 1.2  # Adjust based on your pants images aspect ratio
# scalingFactorPants = 1.3  # Scaling factor for pants
#
#
# @app.route('/process_frame', methods=['POST'])
# def process_frame():
#     # Get data from request
#     data = request.get_json()
#
#     if not data or 'image' not in data:
#         return jsonify({'error': 'No image data provided'}), 400
#
#     # Get selection parameters
#     selection_mode = data.get('selectionMode', 'shirt')
#     image_number_shirt = int(data.get('imageNumberShirt', 0))
#     image_number_pants = int(data.get('imageNumberPants', 0))
#     scaling_factor_shirt = float(data.get('scalingFactorShirt', scalingFactorShirt))
#     scaling_factor_pants = float(data.get('scalingFactorPants', scalingFactorPants))
#
#     # Ensure index is within range
#     if image_number_shirt >= len(listShirts):
#         image_number_shirt = len(listShirts) - 1
#     if image_number_pants >= len(listPants):
#         image_number_pants = len(listPants) - 1
#
#     # Decode image from base64
#     try:
#         img_data = base64.b64decode(data['image'])
#         nparr = np.frombuffer(img_data, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         if img is None:
#             return jsonify({'error': 'Failed to decode image'}), 400
#     except Exception as e:
#         return jsonify({'error': f'Image decoding error: {str(e)}'}), 400
#
#     # Detect pose
#     img = detector.findPose(img, draw=False)
#     lmList, bboxInfo = detector.findPosition(img, bboxWithHands=False, draw=False)
#
#     if lmList and len(lmList) >= 26:  # Ensure we have enough landmarks
#         # Get landmarks for upper body (shirt)
#         lm11 = lmList[11][1:3]  # Left shoulder
#         lm12 = lmList[12][1:3]  # Right shoulder
#
#         # Get landmarks for lower body (pants)
#         lm23 = lmList[23][1:3]  # Left hip
#         lm24 = lmList[24][1:3]  # Right hip
#         lm25 = lmList[25][1:3]  # Left knee
#         lm26 = lmList[26][1:3]  # Right knee
#
#         # Process pants overlay first
#         if listPants:
#             try:
#                 imgPants = cv2.imread(os.path.join(pantsFolderPath, listPants[image_number_pants]),
#                                       cv2.IMREAD_UNCHANGED)
#                 if imgPants is not None:
#                     # Calculate hip width and apply scaling factor explicitly
#                     hipsWidth = abs(lm23[0] - lm24[0])
#                     pantsWidth = int(hipsWidth * 1.2 * scaling_factor_pants)  # Apply scaling factor
#
#                     # Calculate height based on distance from hip to knee and apply scaling
#                     hipToKneeDistance = ((lm25[1] + lm26[1]) / 2) - ((lm23[1] + lm24[1]) / 2)
#                     pantsHeight = int(hipToKneeDistance * 2.2 * scaling_factor_pants)  # Apply scaling factor
#
#                     # Ensure we have valid dimensions
#                     if pantsWidth > 0 and pantsHeight > 0:
#                         # Resize pants with calculated dimensions
#                         imgPants = cv2.resize(imgPants, (pantsWidth, pantsHeight))
#
#                         # Calculate position (center of hips)
#                         # Horizontally: Center pants based on hip width
#                         pantsX = int((lm23[0] + lm24[0]) / 2 - pantsWidth / 2)
#
#                         # Vertically: Position pants at hip level, but higher than before
#                         hipsY = int((lm23[1] + lm24[1]) / 2)
#                         pantsY = hipsY - int(0.25 * pantsHeight)
#
#                         # Overlay the pants image
#                         img = cvzone.overlayPNG(img, imgPants, (pantsX, pantsY))
#             except Exception as e:
#                 print(f"Error processing pants: {e}")
#
#         # Process shirt overlay AFTER pants
#         if listShirts:
#             try:
#                 imgShirt = cv2.imread(os.path.join(shirtFolderPath, listShirts[image_number_shirt]),
#                                       cv2.IMREAD_UNCHANGED)
#                 if imgShirt is not None:
#                     # Calculate shoulder width and apply scaling
#                     shoulderWidth = abs(lm11[0] - lm12[0])
#                     widthOfShirt = int(shoulderWidth * fixedRatio * scaling_factor_shirt)
#
#                     # Extend shirt length to cover waist
#                     extendedRatio = shirtRatioHeightWidth * 1.15  # Increase height by 15%
#                     imgShirt = cv2.resize(imgShirt, (widthOfShirt, int(widthOfShirt * extendedRatio)))
#
#                     # Calculate offset
#                     currentScaleShirt = shoulderWidth / 190
#                     offsetShirt = (
#                         int(44 * currentScaleShirt * scaling_factor_shirt),
#                         int(48 * currentScaleShirt * scaling_factor_shirt)
#                     )
#
#                     # Calculate position to ensure shirt covers waist
#                     hipLevel = int((lm23[1] + lm24[1]) / 2)
#                     shirtY = lm12[1] - offsetShirt[1]
#                     shirtHeight = int(widthOfShirt * extendedRatio)
#                     shirtBottom = shirtY + shirtHeight
#
#                     # Ensure shirt extends to cover waist
#                     if shirtBottom < hipLevel + 20:  # +20 pixels for overlap
#                         # Extend shirt further if needed
#                         additionalExtension = ((hipLevel + 20) - shirtBottom) / shirtHeight
#                         newRatio = extendedRatio * (1 + additionalExtension)
#                         imgShirt = cv2.resize(imgShirt, (widthOfShirt, int(widthOfShirt * newRatio)))
#
#                     # Overlay the shirt on top of pants
#                     img = cvzone.overlayPNG(img, imgShirt, (lm12[0] - offsetShirt[0], shirtY))
#             except Exception as e:
#                 print(f"Error processing shirt: {e}")
#
#     # Get available items
#     available_shirts = listShirts
#     available_pants = listPants
#
#     # Convert processed image back to base64
#     _, buffer = cv2.imencode('.jpg', img)
#     img_str = base64.b64encode(buffer).decode('utf-8')
#
#     # Return the processed image and available items
#     return jsonify({
#         'processedImage': img_str,
#         'availableShirts': available_shirts,
#         'availablePants': available_pants,
#         'poseDetected': len(lmList) >= 26 if lmList else False
#     })
#
#
# @app.route('/available_items', methods=['GET'])
# def available_items():
#     return jsonify({
#         'shirts': listShirts,
#         'pants': listPants
#     })
#
#
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)
#
#


import os
import cv2
import cvzone
import base64
import numpy as np
from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
from cvzone.PoseModule import PoseDetector

# Flask app for REST API
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the pose detector
detector = PoseDetector()

# Define shirt resources and variables
shirtFolderPath = "Resources/Shirts"
listShirts = os.listdir(shirtFolderPath)
fixedRatio = 262 / 190  # widthOfShirt/widthOfPoint11to12
shirtRatioHeightWidth = 581 / 440
scalingFactorShirt = 1  # Default scaling factor for shirts

# Define pants resources and variables
pantsFolderPath = "Resources/Pants"
listPants = os.listdir(pantsFolderPath)
pantsRatioHeightWidth = 1.2
scalingFactorPants = 1.3  # Default scaling factor for pants


# Route to serve clothing images directly with CORS headers
@app.route('/Resources/<path:path>', methods=['GET'])
def serve_resources(path):
    # Construct the full path to the resource
    full_path = os.path.join(os.getcwd(), 'Resources', path)

    # Check if the file exists
    if os.path.exists(full_path) and os.path.isfile(full_path):
        return send_file(full_path)
    else:
        return jsonify({'error': 'Resource not found'}), 404


@app.route('/available_items', methods=['GET'])
def available_items():
    return jsonify({
        'shirts': listShirts,
        'pants': listPants
    })


# Process frame endpoint for taking photos with clothing overlay
@app.route('/process_frame', methods=['POST'])
def process_frame():
    # Get data from request
    data = request.get_json()

    if not data or 'image' not in data:
        return jsonify({'error': 'No image data provided'}), 400

    # Get selection parameters
    image_number_shirt = int(data.get('imageNumberShirt', -1))  # -1 means disabled
    image_number_pants = int(data.get('imageNumberPants', -1))  # -1 means disabled
    scaling_factor_shirt = float(data.get('scalingFactorShirt', scalingFactorShirt))
    scaling_factor_pants = float(data.get('scalingFactorPants', scalingFactorPants))

    # Get enabled flags with backward compatibility
    enabled_shirt = data.get('enabledShirt', image_number_shirt >= 0)
    enabled_pants = data.get('enabledPants', image_number_pants >= 0)

    # Check for at least one enabled item
    if not enabled_shirt and not enabled_pants:
        return jsonify({'error': 'At least one item must be enabled'}), 400

    # Ensure index is within range if enabled
    if enabled_shirt:
        if image_number_shirt < 0 or image_number_shirt >= len(listShirts):
            image_number_shirt = 0  # Default to first shirt

    if enabled_pants:
        if image_number_pants < 0 or image_number_pants >= len(listPants):
            image_number_pants = 0  # Default to first pants

    # Decode image from base64
    try:
        img_data = base64.b64decode(data['image'])
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({'error': 'Failed to decode image'}), 400
    except Exception as e:
        return jsonify({'error': f'Image decoding error: {str(e)}'}), 400

    # Process the image - detect pose and overlay clothes
    try:
        processed_img, pose_detected = process_image(
            img,
            image_number_shirt if enabled_shirt else -1,
            image_number_pants if enabled_pants else -1,
            scaling_factor_shirt,
            scaling_factor_pants
        )

        # Convert processed image back to base64
        _, buffer = cv2.imencode('.jpg', processed_img)
        img_str = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            'processedImage': img_str,
            'poseDetected': pose_detected
        })
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': f'Processing error: {str(e)}'}), 500


# Function to process an image - detect pose and overlay clothing
def process_image(img, image_number_shirt, image_number_pants, scaling_factor_shirt, scaling_factor_pants):
    # Detect pose
    img = detector.findPose(img, draw=False)
    lmList, bboxInfo = detector.findPosition(img, bboxWithHands=False, draw=False)

    pose_detected = lmList and len(lmList) >= 26  # Need at least 26 landmarks for full body

    if pose_detected:
        # Process pants overlay first (if enabled)
        if image_number_pants >= 0 and listPants:
            try:
                # Get landmarks for lower body (pants)
                lm23 = lmList[23][1:3]  # Left hip
                lm24 = lmList[24][1:3]  # Right hip
                lm25 = lmList[25][1:3]  # Left knee
                lm26 = lmList[26][1:3]  # Right knee

                imgPants = cv2.imread(os.path.join(pantsFolderPath, listPants[image_number_pants]),
                                      cv2.IMREAD_UNCHANGED)
                if imgPants is not None:
                    # Calculate hip width and apply scaling factor
                    hipsWidth = abs(lm23[0] - lm24[0])
                    pantsWidth = int(hipsWidth * 1.2 * scaling_factor_pants)

                    # Calculate height based on distance from hip to knee and apply scaling
                    hipToKneeDistance = ((lm25[1] + lm26[1]) / 2) - ((lm23[1] + lm24[1]) / 2)
                    pantsHeight = int(hipToKneeDistance * 2.2 * scaling_factor_pants)

                    # Resize pants with calculated dimensions (if valid)
                    if pantsWidth > 0 and pantsHeight > 0:
                        imgPants = cv2.resize(imgPants, (pantsWidth, pantsHeight))

                        # Calculate position (center of hips)
                        # Horizontally: Center pants based on hip width
                        pantsX = int((lm23[0] + lm24[0]) / 2 - pantsWidth / 2)

                        # Vertically: Position pants at hip level
                        hipsY = int((lm23[1] + lm24[1]) / 2)
                        pantsY = hipsY - int(0.25 * pantsHeight) + 20

                        # Overlay the pants image
                        img = cvzone.overlayPNG(img, imgPants, (pantsX, pantsY))
                        print(f"Applied pants overlay: {image_number_pants}")
            except Exception as e:
                print(f"Error processing pants: {e}")

        # Process shirt overlay after pants (if enabled)
        if image_number_shirt >= 0 and listShirts:
            try:
                # Get landmarks for upper body (shirt)
                lm11 = lmList[11][1:3]  # Left shoulder
                lm12 = lmList[12][1:3]  # Right shoulder

                # Get hip landmarks to ensure shirt covers waist
                lm23 = lmList[23][1:3]  # Left hip
                lm24 = lmList[24][1:3]  # Right hip

                imgShirt = cv2.imread(os.path.join(shirtFolderPath, listShirts[image_number_shirt]),
                                      cv2.IMREAD_UNCHANGED)
                if imgShirt is not None:
                    # Calculate shoulder width and apply scaling
                    shoulderWidth = abs(lm11[0] - lm12[0])
                    widthOfShirt = int(shoulderWidth * fixedRatio * scaling_factor_shirt)

                    # Extend shirt length to cover waist
                    extendedRatio = shirtRatioHeightWidth * 1.15  # Increase height by 15%
                    imgShirt = cv2.resize(imgShirt, (widthOfShirt, int(widthOfShirt * extendedRatio)))

                    # Calculate offset
                    currentScaleShirt = shoulderWidth / 190
                    offsetShirt = (
                        int(44 * currentScaleShirt * scaling_factor_shirt),
                        int(48 * currentScaleShirt * scaling_factor_shirt)
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
                    print(f"Applied shirt overlay: {image_number_shirt}")
            except Exception as e:
                print(f"Error processing shirt: {e}")

    return img, pose_detected


# Start Flask server
if __name__ == '__main__':
    print("Flask server starting on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)