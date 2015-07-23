from flask import Blueprint, jsonify,request
import json, logging, logging.config

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))
logger = logging.getLogger(__name__.split('.')[0])

search_service = Blueprint("search_service", __name__)

@search_service.route("/search/text2image", methods=['POST'])
def get_images():
    print(request.get_json())
    pass

logger.info("loaded: " + __name__)