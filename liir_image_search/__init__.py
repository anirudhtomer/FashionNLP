from flask import Flask, jsonify, request
from liir_image_search.server.static import static
import json

app = Flask(__name__, static_folder="web")
app.register_blueprint(static)

@app.route("/json/<string:file_name>", methods=['POST'])
def request_json(file_name):
    print(request.get_json()['heck'])
    return jsonify(**json.load(open(app.static_folder + "/json/"+ file_name + ".json","r")))

if __name__ == "__main__":
    app.run()
