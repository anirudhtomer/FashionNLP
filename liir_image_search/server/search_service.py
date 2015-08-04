from flask import Blueprint, jsonify, request
import json,logging, logging.config
import random

with open("logging.json", "r") as logging_file:
    logging.config.dictConfig(json.load(logging_file))
logger = logging.getLogger(__name__.split('.')[0])

with open("config.json", "r") as config_file:
    app_config = json.load(config_file)

TEXT2IMAGE_COUNT = app_config['text2image_count']

search_service = Blueprint("search_service", __name__)

with open("json/rawdata_orig.json", "r") as rawdata_file:
    rawdata = json.load(rawdata_file)['dresses']

@search_service.route("/search/text2image", methods=['POST'])
def get_images():
    request_obj = request.get_json()
    logger.debug(request_obj['keywords'])
    indices = random.sample(range(0, len(predicted_imgs) - 1), TEXT2IMAGE_COUNT)
    response = []
    for i in indices:
        response.append({'url': predicted_imgs[i].split("data/")[1], 'score': i})

    return jsonify(images=response)

@search_service.route("/search/rawimages", methods=['POST'])
def get_rawimages():
    request_obj = request.get_json()
    requestedImages = request_obj['imageIdList']
    logger.debug(requestedImages)
    response = []
    for i in requestedImages:
        response.append(rawdata[i])

    return jsonify(images=response)

logger.info("loaded: " + __name__)






'''
 Following stuff to be removed after real binding with engine
'''

predicted_imgs = [
    "dress_attributes/data/images/BridesmaidDresses/B00B98XYP0.jpg",
    "dress_attributes/data/images/Wedding2/B00MLXYU1E.jpg",
    "dress_attributes/data/images/Wedding2/B00MWH1HTW.jpg",
    "dress_attributes/data/images/SpecialOccasion2/B00L21IJSQ.jpg",
    "dress_attributes/data/images/Wedding/B00KFIQPQK.jpg",
    "dress_attributes/data/images/NightOutCocktail2/B00UA8KUJS.jpg",
    "dress_attributes/data/images/BridesmaidDresses/B00N70U37U.jpg",
    "dress_attributes/data/images/MotheroftheBrideDresses2/B00G34B8QW.jpg",
    "dress_attributes/data/images/BridesmaidDresses2/B00M7S0TOU.jpg",
    "dress_attributes/data/images/Dresses/B00N8IGX3O.jpg",
    "dress_attributes/data/images/NightOutCocktail2/B00OZUR798.jpg",
    "dress_attributes/data/images/Wedding2/B00GV176HC.jpg",
    "dress_attributes/data/images/BridesmaidDresses2/B00QNE2208.jpg",
    "dress_attributes/data/images/Dresses2/B00B6EXL6E.jpg",
    "dress_attributes/data/images/BridesmaidDresses/B00J7PCT9O.jpg",
    "dress_attributes/data/images/BridesmaidDresses/B00L4PNMTG.jpg",
    "dress_attributes/data/images/Wedding2/B00M2P7298.jpg",
    "dress_attributes/data/images/BridesmaidDresses2/B00URT8GT6.jpg",
    "dress_attributes/data/images/Dresses2/B00NYSMK44.jpg",
    "dress_attributes/data/images/Wedding2/B00Q6I1004.jpg",
    "dress_attributes/data/images/Wedding2/B00NOGN6UI.jpg",
    "dress_attributes/data/images/Wedding2/B00NKWSHNW.jpg",
    "dress_attributes/data/images/WeddingDresses/B00BPQ1296.jpg",
    "dress_attributes/data/images/WeddingDresses2/B0091QUA3G.jpg",
    "dress_attributes/data/images/WeddingDresses/B00ITKF756.jpg",
    "dress_attributes/data/images/WeddingDresses2/B00RYU3MPO.jpg",
    "dress_attributes/data/images/WeddingDresses/B00DFKPHGY.jpg",
    "dress_attributes/data/images/Wedding2/B00MQEZH88.jpg",
    "dress_attributes/data/images/SpecialOccasion/B00HCXOJNM.jpg",
    "dress_attributes/data/images/WeddingDresses/B00DHWXOGA.jpg",
    "dress_attributes/data/images/Wedding2/B00MNZK1AO.jpg",
    "dress_attributes/data/images/Wedding2/B00ITK6A48.jpg",
    "dress_attributes/data/images/WeddingDresses/B009CQWU74.jpg",
    "dress_attributes/data/images/Dresses/B00BM6U9N4.jpg",
    "dress_attributes/data/images/Wedding/B00AXWIQWO.jpg",
    "dress_attributes/data/images/SpecialOccasion2/B00MRTCWUS.jpg",
    "dress_attributes/data/images/Wedding/B00G0NUKNI.jpg",
    "dress_attributes/data/images/SpecialOccasion2/B00O3YR368.jpg",
    "dress_attributes/data/images/Wedding2/B00URC9SMC.jpg",
    "dress_attributes/data/images/Wedding2/B00R7E5XRW.jpg",
    "dress_attributes/data/images/WeddingDresses/B00JVIVN62.jpg",
    "dress_attributes/data/images/Wedding2/B00HC18Q92.jpg",
    "dress_attributes/data/images/SpecialOccasion2/B00BMOOBAS.jpg",
    "dress_attributes/data/images/Wedding/B00ITK8XYI.jpg",
    "dress_attributes/data/images/WeddingDresses2/B00MA8J344.jpg",
    "dress_attributes/data/images/Wedding2/B00N8NKMN6.jpg",
    "dress_attributes/data/images/NightOutCocktail2/B00EPRQ9BS.jpg",
    "dress_attributes/data/images/BridesmaidDresses/B00MXRRMSG.jpg",
    "dress_attributes/data/images/WeddingDresses2/B00UULVOZY.jpg",
    "dress_attributes/data/images/WeddingDresses2/B00NXX1E2E.jpg",
    "dress_attributes/data/images/Wedding/B00DCFFB18.jpg",
    "dress_attributes/data/images/MotheroftheBrideDresses2/B00PBZ413Q.jpg",
    "dress_attributes/data/images/Wedding/B00JVJ5X0S.jpg",
    "dress_attributes/data/images/Wedding2/B00SAET676.jpg",
    "dress_attributes/data/images/NightOutCocktail2/B00ITIL04A.jpg",
    "dress_attributes/data/images/BridesmaidDresses2/B00MHDJYXW.jpg",
    "dress_attributes/data/images/SpecialOccasion2/B00FHT82GI.jpg",
    "dress_attributes/data/images/Dresses/B00EP6VT0U.jpg",
    "dress_attributes/data/images/BridesmaidDresses/B00K6CF4EY.jpg",
    "dress_attributes/data/images/BridesmaidDresses/B00K5AP4JM.jpg"
]
