from flask import Flask, jsonify, request
from liir_image_search.server.static_page_service import static_page_service
from liir_image_search.server.metadata_service import metadata_service
from liir_image_search.server.search_service import search_service

import json

config_file = open("config.json", "r")
app_config = json.load(config_file)
config_file.close()

app = Flask(__name__, static_folder=app_config['static_folder'])
app.register_blueprint(static_page_service)
app.register_blueprint(metadata_service)
app.register_blueprint(search_service)

@app.route("/json/<string:file_name>", methods=['POST'])
def request_json(file_name):
    print(request.get_json()['heck'])
    return jsonify(**json.load(open(app.static_folder + "/json/" + file_name + ".json", "r")))

if __name__ == "__main__":
    app.run(port=app_config['server_port'], debug=False, use_reloader=False, use_evalex=False)
