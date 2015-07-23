from flask import Blueprint
import json, logging, logging.config

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))
logger = logging.getLogger(__name__.split('.')[0])

with open("config.json", "r") as config_file:
    app_config = json.load(config_file)

static_page_service = Blueprint("static_page_service" ,__name__, static_folder="../" + app_config['static_folder'])

@static_page_service.route("/", methods=['GET'])
def index():
    return static_page_service.send_static_file("index.html")

@static_page_service.route("/<path:url_path>", methods=['GET'])
def request_static_file(url_path):
    return static_page_service.send_static_file(url_path)

logger.info("loaded: " + __name__)