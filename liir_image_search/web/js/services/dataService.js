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

            /******************************************
             * Creating a Filter for Images
             ******************************************/
            $http({
                method: 'POST',
                url: 'json/img2txt'
            }).success(function (data) {

                var images = [];
                for (var i = 0; i < data.items.length; i++) {
                    images[i] = {imgid: data.items[i].imgid};
                    images[i].imageUrl = data.items[i].folder.split("data/")[1] + data.items[i].img_filename;
                    images[i].wordsPredictedStr = data.items[i].words_predicted.replace(/ /g, ", ").replace(/_/g, " ");
                    images[i].wordsPredictedArray = data.items[i].words_predicted_with_scores;
                    for (j = 0; j < images[i].wordsPredictedArray.length; j++) {
                        images[i].wordsPredictedArray[j].score = $filter('number')(images[i].wordsPredictedArray[j].score * 100, 2);
                    }
                    images[i].wordsTrueProjectionArray = data.items[i].words_true_proj.split(" ");

                    for (var j = 0; j < images[i].wordsPredictedArray.length; j++) {
                        word = images[i].wordsPredictedArray[j].word;
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
                            images[k++] = storage[IMAGE_2_TEXT_IMAGES][index];
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
                'isDemoModeActive': function () {
                    return demoModeActive;
                },
                'getMaxFileUploadSize': function () {
                    return maxFileUploadSize;
                }
            };
        }]
);
