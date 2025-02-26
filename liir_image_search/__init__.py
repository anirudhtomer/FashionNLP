from flask import Flask, jsonify, request
from liir_image_search.server.static_page_service import static_page_service
from liir_image_search.server.metadata_service import metadata_service
from liir_image_search.server.search_service import search_service
from liir_image_search.server.db_service import db_service
import json, logging, logging.config

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))
logger = logging.getLogger(__name__)

with open("config.json", "r") as config_file:
    app_config = json.load(config_file)

app = Flask(__name__, static_folder=app_config['static_folder'])
app.register_blueprint(static_page_service)
app.register_blueprint(metadata_service)
app.register_blueprint(search_service)
app.register_blueprint(db_service)

logger.info("All blueprints are registered")

if __name__ == "__main__":
    try:
        app.run(host='0.0.0.0', port=app_config['server_port'], debug=False, use_reloader=False, use_evalex=False)
    except Exception as e:
        logger.critical("Server couldn't be started: " + str(e))

logger.info("Server: " + __name__ + " is up and running on port " + str(app_config['server_port']))
