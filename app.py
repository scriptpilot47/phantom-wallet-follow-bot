from flask import Flask, make_response, request, jsonify
import serve
import start

# Initialize the Flask app
app = Flask(__name__)

# Serve the next bot data
@app.route('/next-bot')
def next_bot():
    bot = serve.send_bot()
    return make_response(bot, 200)

# Start new bot instance
@app.route('/start-bot', methods=['POST'])
def start_bot():
    # Get the JSON object from the request
    data = request.get_json()
    start.start_bot(data)
    return make_response('data received', 200)

# Run the app
if __name__ == "__main__":
    app.run(debug=True)