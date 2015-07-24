susana.controller(
    'Text2ImageCtrl',
    ['$scope', '$http', 'DataService',
        function ($scope, $http, DataService) {

            $scope.totalWords = 100;
            $scope.items = [];

            $scope.vocabulary=[];
            $scope.filterKeywords = DataService.retrieveData('filterKeywords');
            if(angular.isUndefined($scope.filterKeywords)){
                $scope.filterKeywords = ['a-line','red','a-linesd','reasfrd','a-liarfsne','reagd','a-lineasd','redasd','a-linde','read','a-daline','regfsad','a-lbine','wred','a-sdfline'];
            }

            $scope.removeKeyword=function(index){
                $scope.filterKeywords.splice(index, 1);
            };

            $scope.search={
                filterText: "",
                showVocabulary: false
            };

            $scope.$watch('search.filterText', filterVocabulary);

            function filterVocabulary(){
                var filteredVocab = DataService.getVocabTrie().search($scope.search.filterText);

               $scope.vocabulary = filteredVocab.values();
            }

            function createItem(jsonObj){
                imgUrls = jsonObj.predicted_imgs.slice(0, 4);
                for (var j = 0; j < 4; j++) {
                    imgUrls[j] = imgUrls[j].split("data/")[1];
                }

                return {
                    imageUrls: imgUrls,
                    wordTrueProjection: jsonObj.words_true_proj.join().replace(/,/g, ", ").replace(/_/g, " ")
                };
            }

            $http({method: 'POST', url: 'json/txt2img'}).success(function (data) {
                for (var i = 0; i < $scope.totalWords; i++) {
                    $scope.items[i] = createItem(data.items[i]);
                }
            });
        }
    ]
);
