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

logger.info("loaded: " + __name__)