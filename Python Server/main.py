from flask import Flask, request, abort
from model import LLM_Model

app = Flask(__name__)
model = LLM_Model()

@app.route("/")
def hello_world():
    return "Server Running!"

@app.route("/chat", methods=["GET"])
def chat():
    result = "*NaN*"
    if request.args.get("prompt") == "None":
        abort(400, "Prompt not given!!")
    try:
        result = model.predict(request.args.get("prompt"), debug=True)
    except:
        abort(400, "Could Not Load Model")
    return result

if __name__ == "__main__":
    app.run()
