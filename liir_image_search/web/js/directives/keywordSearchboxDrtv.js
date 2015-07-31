susana.directive('keywordSearchBox',
    ['UtilService', 'DataService',
        function (UtilService, DataService) {

            var MIN_WORDS_TO_SHOW = 10;
            var LOAD_MORE_WORDS_COUNT = 10;

            var searchBoxCount = 0;

            function generateSearchBoxId() {
                return "keywordsearchbox" + searchBoxCount++;
            }

            DataService.storeData(SEARCH_BOX_CALLBACK_MAP,{});

            return {
                restrict: "A",
                scope: {},
                templateUrl: "html/keywordsearchbox.html",
                link: function (scope, element, attrs) {
                },
                controller: function ($scope, $element, $attrs) {
                    if (angular.isDefined($attrs.searchBoxId)) {
                        $scope.searchBoxId = $attrs.searchBoxId;
                    } else {
                        $scope.searchBoxId = generateSearchBoxId();
                    }

                    $scope.vocabulary = [];

                    $scope.search = {
                        filterText: "",
                        showVocabularyDropdown: false
                    };

                    $scope.searchInputClicked = function ($event) {
                        $event.stopPropagation();
                        $scope.search.showVocabularyDropdown = true;

                        var count = 0;
                        for (var keyword in $scope.filterKeywordsMap) {
                            if ($scope.filterKeywordsMap.hasOwnProperty(keyword)) {
                                count = 1;
                                break;
                            }
                        }

                        if (count === 0) {//if the number of filtered keywords is zero
                            $scope.emptySearchBoxClicked += 1;//increment by 1 so that the auto scroll directive can detect change
                        }
                    };

                    $scope.isSelectableKeyword = function (keyword) {
                        return angular.isUndefined($scope.filterKeywordsMap[keyword]);
                    };

                    $scope.removeKeyword = function (keyword) {
                        delete $scope.filterKeywordsMap[keyword];
                        sendContentChangeCallback();
                    };

                    $scope.addKeyword = function ($event, keyword) {
                        if (angular.isUndefined($scope.filterKeywordsMap[keyword])) {
                            $scope.filterKeywordsMap[keyword] = keyword;
                            sendContentChangeCallback();
                        }

                        $event.stopPropagation();
                    };

                    $scope.checkEnterPressed = function ($event) {
                        if ($event.which === 13 && angular.isDefined($scope.vocabulary[0])) {
                            for (var i = 0; i < $scope.vocabulary.length; i++) {
                                if ($scope.isSelectableKeyword($scope.vocabulary[i])) {
                                    $scope.addKeyword($event, $scope.vocabulary[i]);
                                    break;
                                }
                            }
                        }
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

                    function sendContentChangeCallback() {
                        if (angular.isDefined($attrs.contentChangeCallback)) {
                            var filterKeywords = [];

                            for (var keyword in $scope.filterKeywordsMap) {
                                if ($scope.filterKeywordsMap.hasOwnProperty(keyword)) {
                                    filterKeywords.push(keyword);
                                }
                            }

                            var callback = $scope.$parent[$attrs.contentChangeCallback];
                            if (angular.isFunction(callback)) {
                                callback(filterKeywords);
                            }
                        }
                    }

                    $scope.filterKeywordsMap = DataService.retrieveData($scope.searchBoxId);
                    if (angular.isUndefined($scope.filterKeywordsMap)) {
                        $scope.filterKeywordsMap = {};
                    } else {
                        sendContentChangeCallback();
                    }

                    var searchboxCallbackMap = DataService.retrieveData(SEARCH_BOX_CALLBACK_MAP);
                    searchboxCallbackMap[$scope.searchBoxId] = function(){
                        $scope.search.showVocabularyDropdown = false;
                    };
                    DataService.storeData(SEARCH_BOX_CALLBACK_MAP, searchboxCallbackMap);

                    $scope.$on('$destroy', function () {
                        var searchboxCallbackMap = DataService.retrieveData(SEARCH_BOX_CALLBACK_MAP);
                        delete searchboxCallbackMap[$scope.searchBoxId];
                        DataService.storeData(SEARCH_BOX_CALLBACK_MAP, searchboxCallbackMap);
                        DataService.storeData($scope.searchBoxId, $scope.filterKeywordsMap);
                    });
                }
            };
        }
    ]);
