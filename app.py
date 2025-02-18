from flask import Flask, request, jsonify
from flask_cors import CORS
from david import fetch_marks  # Import function from david.py

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

@app.route("/get_marks", methods=["POST"])  # Ensure this endpoint exists
def get_marks():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        marks_data = fetch_marks(username, password)  # Fetch from david.py

        return jsonify(marks_data)  # Return JSON

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Catch errors

if __name__ == "__main__":
    app.run(debug=True)
