from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import io

app = Flask(__name__)
CORS(app)  # Allow all origins, or configure specific origins

@app.route('/detect-captcha', methods=['POST'])
def detect_captcha():
    # Get the image file from the request
    file = request.files['image']

    # Open the image
    image = Image.open(io.BytesIO(file.read()))

    # Convert the image to grayscale (optional)
    image = image.convert('L')

    # Use pytesseract to detect text from the image
    captcha_text = pytesseract.image_to_string(image)

    # Return the detected text as a JSON response
    return jsonify({'captcha_text': captcha_text.strip()})

if __name__ == '__main__':
    app.run(debug=True)

