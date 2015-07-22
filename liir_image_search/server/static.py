
from flask import Blueprint


static = Blueprint("static",__name__, static_folder="../web")

@static.route("/", methods=['GET'])
def index():
    return static.send_static_file("index.html")

@static.route("/<path:url_path>", methods=['GET'])
def request_static_file(url_path):
    return static.send_static_file(url_path)