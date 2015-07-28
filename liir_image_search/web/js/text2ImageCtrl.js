susana.controller(
    'Text2ImageCtrl',
    ['$scope', '$http', 'DataService',
        function ($scope, $http, DataService) {

            var MIN_WORDS_TO_SHOW = 10;
            var LOAD_MORE_WORDS_COUNT = 10;

            $scope.vocabulary = [];
            $scope.filteredImages = [];

            $scope.search = {
                filterText: "",
                showVocabularyDropdown: false
            };

            $scope.searchInputClicked = function($event) {
                $event.stopPropagation();
                $scope.search.showVocabularyDropdown = true;

                var count = 0;
                for (var keyword in $scope.filterKeywordsMap) {
                    if ($scope.filterKeywordsMap.hasOwnProperty(keyword)) {
                        count = 1;
                        break;
                    }
                }

                if(count===0){//if the number of filtered keywords is zero
                    $scope.emptySearchBoxClicked+=1;//increment by 1 so that the auto scroll directive can detect change
                }
            };

            $scope.removeKeyword = function (keyword) {
                delete $scope.filterKeywordsMap[keyword];
                $scope.searchImages();
            };

            $scope.addKeyword = function ($event, keyword) {
                if (angular.isUndefined($scope.filterKeywordsMap[keyword])) {
                    $scope.filterKeywordsMap[keyword] = keyword;
                    $scope.searchImages();
                }

                $event.stopPropagation();
            };

            $scope.searchImages = function () {
                var filterKeywords = [];

                for (var keyword in $scope.filterKeywordsMap) {
                    if ($scope.filterKeywordsMap.hasOwnProperty(keyword)) {
                        filterKeywords.push(keyword);
                    }
                }

                if (filterKeywords.length > 0) {
                    $http({
                        method: 'POST',
                        url: 'search/text2image',
                        data: {keywords: filterKeywords}
                    }).success(function (data) {
                        $scope.filteredImages = data.images;
                        $scope.imageRowSequence = new Array(Math.ceil($scope.filteredImages.length / 4))
                    });
                } else {
                    $scope.filteredImages.length = 0;
                    $scope.imageRowSequence = new Array(0);
                }
            };

            $scope.isSelectableKeyword = function (keyword) {
                return angular.isUndefined($scope.filterKeywordsMap[keyword]);
            };

            $scope.$watch('search.filterText', filterVocabulary);

            function filterVocabulary() {
                var filteredVocab = DataService.getVocabTrie().search($scope.search.filterText);
                $scope.vocabulary = filteredVocab.values();
                $scope.vocabCountSequence = new Array(($scope.vocabulary.length > MIN_WORDS_TO_SHOW) ? MIN_WORDS_TO_SHOW : $scope.vocabulary.length);
            }

            $scope.loadMoreVocabulary = function () {
                if ($scope.vocabCountSequence.length < $scope.vocabulary.length) {
                    var remainingElements = $scope.vocabulary.length - $scope.vocabCountSequence.length;
                    var newLength = $scope.vocabCountSequence.length + ((LOAD_MORE_WORDS_COUNT < remainingElements) ? LOAD_MORE_WORDS_COUNT : remainingElements);
                    $scope.vocabCountSequence = new Array(newLength);
                }
            };

            $scope.$on("$destroy", function () {
                console.log("destroy called");
                DataService.storeData('filterKeywordsMap', $scope.filterKeywordsMap);
            });

            $scope.undefinedFilter = function(imageRowNum,imageNum){
                return angular.isUndefined($scope.filteredImages[imageRowNum*4 + imageNum]);
            };

            $scope.filterKeywordsMap = DataService.retrieveData('filterKeywordsMap');
            if (angular.isUndefined($scope.filterKeywordsMap)) {
                $scope.filterKeywordsMap = {};
            }else{
                $scope.searchImages();
            }
        }
    ]
);
