from flask import Blueprint
import json, logging, logging.config

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))
logger = logging.getLogger("static_page_service")

with open("config.json", "r") as config_file:
    app_config = json.load(config_file)

static_page_service = Blueprint("static_page_service" ,__name__, static_folder="../" + app_config['static_folder'])

@static_page_service.route("/", methods=['GET'])
def index():
    logger.debug("Request for index.html arrived")
    return static_page_service.send_static_file("index.html")

@static_page_service.route("/<path:url_path>", methods=['GET'])
def request_static_file(url_path):
    logger.debug(url_path)
    return static_page_service.send_static_file(url_path)

logger.info("Blueprint: " + __name__ + " is loaded.")