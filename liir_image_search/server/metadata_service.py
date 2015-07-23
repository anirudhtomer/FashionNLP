from flask import Blueprint, jsonify
import json

config_file = open("config.json", "r")
app_config = json.load(config_file)
config_file.close()

vocab_file = open(app_config['vocabulary_file'], "r")
vocab_words = vocab_file.read().splitlines()
vocab_file.close()

metadata_service = Blueprint("metadata_service", __name__)

@metadata_service.route("/metadata/getvocab", methods=['POST'])
def get_vocab():
    return jsonify(**vocab_words)
