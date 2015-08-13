import sys
import numpy as np

from liir_image_search.server.text2image.dress_demo.demo_code.myGibbsProcess.gibbs_input import process_gibbs_input as gibbs_input
from liir_image_search.server.text2image.dress_demo.demo_code.data_manager.data_provider import DataProvider

split = 'test'
dataset_fname = 'server/text2image/dress_demo/data/json/dataset_dress_all_{}.json'.format(split)
dataset = DataProvider(dataset_fname=dataset_fname)

# load the dictionary from file for word ids
# Load true list
rpath2 = 'server/text2image/dress_demo/data/data-processed/zappos-preprocessingfc7/test/text_visfc7/'
dot_words_fname = rpath2 + 'text.words'
dot_words = gibbs_input.DotWordsFile(dot_words_fname)
# print "Vocabulary size", dot_words.V

# Load matrix from model
model_name = 'cca'
exp = 'txt2img'
split = 'test'
fname = 'server/text2image/dress_demo/data/models/{}/{}_U_V_I{}.txt'.format(model_name, exp, split)
model = np.genfromtxt(fname, delimiter=',')
# print "model shape", model.shape


def text2image(keywords, total_images):

    # Create an Stest matrix of 1 x V and transform words into indices:
    Stest = np.zeros((1, dot_words.V))
    for word in keywords:
        word_id = dot_words.word2id[word]
        # print word_id
        Stest[0, word_id] += 1

    # print "Stest shape", Stest.shape

    # Multiply Stest * a
    img_scores = Stest.dot(model)
    # print "img_scores shape", img_scores.shape

    top_img_indices = np.argsort(-img_scores, axis=1)
    top_img_indices = top_img_indices.tolist()

    filteredImageSet = []
    for imgIndex in top_img_indices[0][0:total_images]:
        predicted_img = dataset.dataset['items'][imgIndex]
        filteredImageSet.append({'url': predicted_img['folder'] + predicted_img['img_filename'], 'imgid': predicted_img['imgid']})

    return filteredImageSet
# print top_img_ids[0][0:5]



