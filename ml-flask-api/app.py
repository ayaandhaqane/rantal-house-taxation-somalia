from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Allow requests from any origin (for local dev)

# Change path as needed if model is in a different folder
MODEL_PATH = os.path.join(os.path.dirname(__file__), "rental_tax_model.pkl")

# Load your trained SVR model from file
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from the request
        data = request.json
        # Parse the rent from data
        current_rent = float(data.get('currentHouseRent', 0))

        # Prepare the input as numpy array for the model
        features = np.array([[current_rent]])
        # Predict tax
        prediction = model.predict(features)

        # Return the prediction as JSON
        return jsonify({'prediction': float(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/')
def home():
    return "Rental Tax Prediction Flask API is running!"

if __name__ == '__main__':
    # Use host="0.0.0.0" for Docker; for local, just use default.
    app.run(port=5002, debug=True)

