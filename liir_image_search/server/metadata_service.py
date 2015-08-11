from flask import Blueprint, jsonify
import json, logging, logging.config

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))
logger = logging.getLogger("metadata_service")

with open("config.json", "r") as config_file:
    app_config = json.load(config_file)

with open(app_config['vocabulary_file'], "r") as vocab_file:
    vocab_words = vocab_file.read().splitlines()

metadata_service = Blueprint("metadata_service", __name__)

demo_mode_status = False
if 'demo_mode_active' in app_config:
    demo_mode_status = app_config['demo_mode_active']

if demo_mode_status==False:
    logger.info("Browser will show information with Demo mode Inactive")
else:
    logger.info("Browser will show information with Demo mode Active. Some options will not be shown to users.")

@metadata_service.route("/metadata/getvocab", methods=['POST'])
def get_vocab():
    logger.debug("Request received for fetching vocabulary file")
    return jsonify(vocab=vocab_words)

@metadata_service.route("/metadata/isdemomodeactive", methods=['POST'])
def is_demo_mode_active():
    logger.debug("Request received for checking if Demo mode is active")
    return jsonify(demoModeActive=demo_mode_status)

@metadata_service.route("/metadata/getmaxfileuploadsize", methods=['POST'])
def get_max_file_upload_size():
    logger.debug("Request received for checking max file upload size")
    if 'max_file_upload_size' in app_config:
        return jsonify(maxFileUploadSize=app_config['max_file_upload_size'])
    else:
        return jsonify(maxFileUploadSize=100000)

logger.info("Blueprint: " + __name__ + " is loaded.")