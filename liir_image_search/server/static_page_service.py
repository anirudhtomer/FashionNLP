from flask import Blueprint
import json

config_file = open("config.json", "r")
app_config = json.load(config_file)
config_file.close()

static_page_service = Blueprint("static_page_service" ,__name__, static_folder="../" + app_config['static_folder'])

@static_page_service.route("/", methods=['GET'])
def index():
    return static_page_service.send_static_file("index.html")

@static_page_service.route("/<path:url_path>", methods=['GET'])
def request_static_file(url_path):
    return static_page_service.send_static_file(url_path)