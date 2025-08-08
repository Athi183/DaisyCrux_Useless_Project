from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)  # Allow CORS for all domains

@app.route('/analyze', methods=['POST'])
def analyze_roti():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # --- Roundness Detection ---
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    roundness = 0
    if contours:
        c = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(c)
        perimeter = cv2.arcLength(c, True)
        if perimeter != 0:
            roundness = (4 * np.pi * area) / (perimeter ** 2)

    # --- Burn Spot Detection ---
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower_burn = np.array([0, 0, 0])
    upper_burn = np.array([180, 255, 50])
    burn_mask = cv2.inRange(hsv, lower_burn, upper_burn)
    burn_count = cv2.countNonZero(burn_mask)

    return jsonify({
        'roundness': round(roundness, 2),
        'burn_count': int(burn_count)
    })

if __name__ == '__main__':
    app.run(debug=True)
