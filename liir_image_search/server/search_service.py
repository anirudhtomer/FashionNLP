from flask import Blueprint, jsonify,request

search_service = Blueprint("search_service", __name__)

@search_service.route("/search/text2image", methods=['POST'])
def get_images():
    print(request.get_json())
    pass
