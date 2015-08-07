susana.factory(
    'DataService',
    ['$http', '$filter', 'TrieService', 'HashSetService',
        function ($http, $filter, TrieService, HashSetService) {

            var registeredCallbacks = [];
            var vocabLoaded = false;
            var vocabulary = [];
            var storage = {};
            var demoModeActive = false;
            var maxFileUploadSize = 100000;

            var vocabTrie = TrieService.createNewTrie();
            var imageIndexByKeywordMap = {};

            $http({method: 'POST', url: 'metadata/isdemomodeactive'}).success(function (data) {
                if (angular.isDefined(data.demoModeActive)) {
                    demoModeActive = data.demoModeActive;
                }
            });

            $http({method: 'POST', url: 'metadata/getmaxfileuploadsize'}).success(function (data) {
                if (angular.isDefined(data.maxFileUploadSize)) {
                    maxFileUploadSize = data.maxFileUploadSize;
                }
            });


            /******************************************
             * Creating a Trie of Vocabulary
             ***************************************/
            $http({method: 'POST', url: 'metadata/getvocab'}).success(function (data) {
                vocabulary = data.vocab;
                vocabLoaded = true;

                for (var i = 0; i < vocabulary.length; i++) {
                    currentWord = vocabulary[i];
                    splitByHyphen = currentWord.split("-");
                    splitByUnderscore = currentWord.split("_");
                    splitBySpace = currentWord.split(" ");
                    if (splitByHyphen.length > 1) {
                        for (var j = 0; j < splitByHyphen.length; j++) {
                            vocabTrie.addWord(splitByHyphen[j], currentWord)
                        }
                    } else if (splitByUnderscore.length > 1) {
                        for (var j = 0; j < splitByUnderscore.length; j++) {
                            vocabTrie.addWord(splitByUnderscore[j], currentWord)
                        }
                    } else if (splitBySpace.length > 1) {
                        for (var j = 0; j < splitBySpace.length; j++) {
                            vocabTrie.addWord(splitBySpace[j], currentWord)
                        }
                    } else {
                        vocabTrie.addWord(currentWord, currentWord)
                    }
                }

                for (var i = 0; i < registeredCallbacks.length; i++) {
                    registeredCallbacks[i](vocabulary);
                }
                registeredCallbacks.length = 0;
            });

            function processImg2TxtResponseItem(imageItem){
                imageItem.imageUrl = imageItem.folder.split("data/")[1] + imageItem.img_filename;
                imageItem.words_predicted = imageItem.words_predicted.replace(/ /g, ", ").replace(/_/g, " ");
                for (j = 0; j < imageItem.words_predicted_with_scores.length; j++) {
                    imageItem.words_predicted_with_scores[j].score = $filter('number')(imageItem.words_predicted_with_scores[j].score * 100, 2);
                }
                imageItem.words_true_proj = imageItem.words_true_proj.split(" ");
                return imageItem;
            }

            /******************************************
             * Creating a Filter for Images
             ******************************************/
            $http({
                method: 'POST',
                url: 'search/img2txt'
            }).success(function (data) {

                var images = data.images;
                for (var i = 0; i < images.length; i++) {
                    images[i]=processImg2TxtResponseItem(images[i])
                    for (var j = 0; j < images[i].words_predicted_with_scores.length; j++) {
                        word = images[i].words_predicted_with_scores[j].word;
                        if (angular.isUndefined(imageIndexByKeywordMap[word])) {
                            imageIndexByKeywordMap[word] = [];
                        }
                        imageIndexByKeywordMap[word].push(i);
                    }
                }

                storeData(IMAGE_2_TEXT_IMAGES, images);
            });

            function getVocabulary(callback) {
                if (angular.isFunction(callback)) {
                    if (vocabLoaded === true) {
                        callback(vocabulary);
                    } else {
                        registeredCallbacks.push(callback);
                    }
                }
            }

            function getVocabTrie() {
                return vocabTrie;
            }

            function storeData(key, value) {
                storage[key] = value;
            }

            function retrieveData(key) {
                return storage[key];
            }

            function searchImg2TxtImages(filterKeywords) {
                var totalFilterKeywords = filterKeywords.length;
                var imageIndexMap = {};
                for (var i = 0; i < totalFilterKeywords; i++) {
                    var imageIndexArray = imageIndexByKeywordMap[filterKeywords[i]];
                    if (angular.isDefined(imageIndexArray)) {
                        for (j = 0; j < imageIndexArray.length; j++) {
                            imageIndex = imageIndexArray[j];
                            if (angular.isUndefined(imageIndexMap[imageIndex])) {
                                imageIndexMap[imageIndex] = 0;
                            }
                            imageIndexMap[imageIndex]++;
                        }
                    }else{//no image has that keyword
                        return [];
                    }
                }

                var images = [];
                var k = 0;
                for (var index in imageIndexMap) {
                    if (imageIndexMap.hasOwnProperty(index)) {
                        if (imageIndexMap[index] === totalFilterKeywords) {
                            images[k++] = retrieveData(IMAGE_2_TEXT_IMAGES)[index];
                        }
                    }
                }

                return images;
            }

            return {
                'getVocabulary': getVocabulary,
                'getVocabTrie': getVocabTrie,
                'searchImg2TxtImages': searchImg2TxtImages,
                'storeData': storeData,
                'retrieveData': retrieveData,
                'processImg2TxtResponseItem': processImg2TxtResponseItem,
                'isDemoModeActive': function () {
                    return demoModeActive;
                },
                'getMaxFileUploadSize': function () {
                    return maxFileUploadSize;
                }
            };
        }]
);
