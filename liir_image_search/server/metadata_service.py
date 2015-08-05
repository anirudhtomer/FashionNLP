from flask import Blueprint, jsonify
import json, logging, logging.config

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))
logger = logging.getLogger(__name__.split('.')[0])

with open("config.json", "r") as config_file:
    app_config = json.load(config_file)

with open(app_config['vocabulary_file'], "r") as vocab_file:
    vocab_words = vocab_file.read().splitlines()

metadata_service = Blueprint("metadata_service", __name__)

@metadata_service.route("/metadata/getvocab", methods=['POST'])
def get_vocab():
    return jsonify(vocab=vocab_words)

@metadata_service.route("/metadata/isdemomodeactive", methods=['POST'])
def is_demo_mode_active():
    if 'demo_mode_active' in app_config:
        return jsonify(demoModeActive=app_config['demo_mode_active'])
    else:
        return jsonify(demoModeActive=False)

@metadata_service.route("/metadata/getmaxfileuploadsize", methods=['POST'])
def get_max_file_upload_size():
    if 'max_file_upload_size' in app_config:
        return jsonify(maxFileUploadSize=app_config['max_file_upload_size'])
    else:
        return jsonify(maxFileUploadSize=100000)

logger.info("loaded: " + __name__)