from flask import Blueprint, jsonify, request
import json, logging, logging.config
import random
import liir_image_search.server.text2image.dress_demo.demo_code.txt2img.txt2img as txt2img

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))

logger = logging.getLogger("search_service")

with open("config.json", "r") as config_file:
    app_config = json.load(config_file)

TEXT2IMAGE_COUNT = app_config['text2image_count']

search_service = Blueprint("search_service", __name__)

logger.debug("Reading raw data file")
with open(app_config['rawdata_file'], "r") as rawdata_file:
    rawdata = json.load(rawdata_file)['dresses']

logger.debug("Reading image to text file")
with open(app_config['img2txt_file'], "r") as img2txt_file:
    img2txtdata = json.load(img2txt_file)['items']

logger.debug("Creating File name to image item map")
filename2imageitem_map = {}
for img2txtitem in img2txtdata:
    filename2imageitem_map[img2txtitem['img_filename']] = img2txtitem

def find_images_for_the_text(keywords):
    logger.debug(keywords)
    filteredImagesSet=txt2img.text2image(keywords, TEXT2IMAGE_COUNT)

    for imageObject in filteredImagesSet:
        imageObject['url'] = imageObject['url'].split("data/")[1]
        imageObject['score'] = 0

    logger.debug(filteredImagesSet)
    return filteredImagesSet

@search_service.route("/search/text2image", methods=['POST'])
def get_images():
    request_obj = request.get_json()
    return jsonify(images=find_images_for_the_text(request_obj['keywords']))


@search_service.route("/search/rawimages", methods=['POST'])
def get_rawimages():
    request_obj = request.get_json()
    requestedImages = request_obj['imageIdList']
    logger.debug(requestedImages)
    response = []
    for i in requestedImages:
        response.append(rawdata[i])

    return jsonify(images=response)

@search_service.route("/search/img2txt", methods=['POST'])
def request_json():
    return jsonify(images=img2txtdata)

#Change the following function to integrate the image to image search functionality with your code
@search_service.route("/upload/image", methods=['POST'])
def upload_image():
    file = request.files['file']
    logger.debug("Processing upload request for the name: " + file.filename)
    file.save(app_config['upload_folder'] + "/" + file.filename)

    response = {'failureReason': ""}
    #replave this code to use real image to image search
    if file.filename in filename2imageitem_map:
        #Assign an object like the img2txt json object here
        response['imgDetails'] = filename2imageitem_map[file.filename]
        #assign array of URL to the following object
        response['similarImages'] = find_images_for_the_text(response['imgDetails']['words_predicted'].split(" "))
    else:
        response['failureReason'] = "We could not find details for this image"

    return jsonify(**response)

logger.info("loaded: " + __name__)