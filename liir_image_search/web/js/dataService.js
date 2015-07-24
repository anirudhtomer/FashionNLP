susana.factory(
    'DataService',
    ['$http', 'TrieService',
        function ($http, TrieService) {

            var registeredCallbacks = [];
            var vocabLoaded = false;
            var vocabulary = [];
            var storage = {};

            var vocabTrie = TrieService.createNewTrie();

            $http({method: 'POST', url: 'metadata/getvocab'}).success(function (data) {
                vocabulary = data.vocab;
                vocabLoaded = true;

                for(var i=0; i<vocabulary.length; i++){
                    currentWord = vocabulary[i];
                    splitByHyphen = currentWord.split("-");
                    splitBySpace = currentWord.split(" ");
                    if(splitByHyphen.length>1){
                        for(j=0;j<splitByHyphen.length; j++){
                            vocabTrie.addWord(splitByHyphen[j], currentWord)
                        }
                    }else if(splitBySpace.length>1){
                        for(j=0;j<splitBySpace.length; j++){
                            vocabTrie.addWord(splitBySpace[j], currentWord)
                        }
                    }else{
                        vocabTrie.addWord(currentWord, currentWord)
                    }
                }

                for (var i = 0; i < registeredCallbacks.length; i++) {
                    registeredCallbacks[i](vocabulary);
                }
                registeredCallbacks.length = 0;
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

            function getVocabTrie(){
                return vocabTrie;
            }

            function storeData(key, value) {
                storage[key] = value;
            }

            function retrieveData(key) {
                return storage[key];
            }

            return {
                'getVocabulary': getVocabulary,
                'getVocabTrie': getVocabTrie,
                'storeData': storeData,
                'retrieveData': retrieveData
            };
        }]
);
