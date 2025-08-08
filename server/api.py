from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

def encode_image_to_base64(image):
    _, buffer = cv2.imencode('.png', image)
    return base64.b64encode(buffer).decode('utf-8')
def detect_burns(img, mask):
    # Convert to grayscale and invert
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    inverted = 255 - gray

    # Apply the chapati mask to remove background
    masked_inverted = cv2.bitwise_and(inverted, inverted, mask=mask)

    # Threshold to detect dark regions
    _, burn_mask = cv2.threshold(masked_inverted, 200, 255, cv2.THRESH_BINARY)

    # Clean small noise
    kernel = np.ones((3, 3), np.uint8)
    burn_mask = cv2.morphologyEx(burn_mask, cv2.MORPH_OPEN, kernel, iterations=2)
    burn_mask = cv2.dilate(burn_mask, kernel, iterations=1)

    # Find contours on clean burn mask
    contours, _ = cv2.findContours(burn_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    burn_overlay = img.copy()
    burn_count = 0

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 50:
            burn_count += 1
            cv2.drawContours(burn_overlay, [cnt], -1, (0, 0, 255), -1)  # red fill

    return burn_overlay, burn_count


def analyze_roti(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    roundness = 0
    contour_image = img.copy()
    mask = np.zeros_like(gray)

    if contours:
        c = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(c)
        perimeter = cv2.arcLength(c, True)
        if perimeter != 0:
            roundness = (4 * np.pi * area) / (perimeter ** 2)
        cv2.drawContours(contour_image, [c], -1, (0, 255, 0), 2)
        cv2.drawContours(mask, [c], -1, 255, -1)  # Create roti mask

    # 🧠 Burn detection with mask
    burn_image, burn_count = detect_burns(img, mask)

    return {
        'roundness': round(roundness, 2),
        'burn_count': int(burn_count),
        'contour_image': encode_image_to_base64(contour_image),
        'burn_image': encode_image_to_base64(burn_image)
    }

@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    result = analyze_roti(img)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
