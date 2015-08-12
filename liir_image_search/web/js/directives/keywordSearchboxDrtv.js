susana.directive('keywordSearchBox',
    ['UtilService', 'DataService',
        function (UtilService, DataService) {

            var MIN_WORDS_TO_SHOW = 10;
            var LOAD_MORE_WORDS_COUNT = 10;

            var searchBoxCount = 0;

            function generateSearchBoxId() {
                return "keywordsearchbox" + searchBoxCount++;
            }

            DataService.storeData(SEARCH_BOX_CALLBACK_MAP, {});

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

                    $scope.selectedVocabIndex = -1;

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
                        if ($event.which === 13 && $scope.vocabulary.length > 0) {
                            if ($scope.isSelectableKeyword($scope.vocabulary[$scope.selectedVocabIndex])) {
                                $scope.addKeyword($event, $scope.vocabulary[$scope.selectedVocabIndex]);
                            }
                        }
                    };

                    $scope.handleOnMouseOver = function (vocabIndex) {
                        $scope.selectedVocabIndex = vocabIndex;
                    };

                    $scope.handleKeyDown = function ($event) {
                        if ($event.which === 38) {
                            handleArrowUp();
                        } else if ($event.which === 40) {
                            handleArrowDown();
                        }
                    };

                    function handleArrowUp() {
                        var MAX_HEIGHT_ELEMENT = $(".keyword-select-dropdown").height();
                        var MAX_HEIGHT_CHILDREN = $(".keyword-select-dropdown").children().first().height();

                        if ($scope.selectedVocabIndex > 0) {
                            var indexBeforeUpdating = $scope.selectedVocabIndex;
                            var skipcount = 0;
                            do {
                                $scope.selectedVocabIndex--;
                                skipcount++;
                            } while ($scope.selectedVocabIndex > 0 && !$scope.isSelectableKeyword($scope.vocabulary[$scope.selectedVocabIndex]));

                            //given the order of conditions only checking this condition is sufficient
                            if (!$scope.isSelectableKeyword($scope.vocabulary[$scope.selectedVocabIndex])) {
                                $scope.selectedVocabIndex = indexBeforeUpdating;
                            }else{
                                $(".keyword-select-dropdown")[0].scrollTop = $(".keyword-select-dropdown")[0].scrollTop - MAX_HEIGHT_CHILDREN * (skipcount>0?skipcount:1);;
                            }
                        }
                    }

                    function handleArrowDown() {
                        var MAX_HEIGHT_ELEMENT = $(".keyword-select-dropdown").height();
                        var MAX_HEIGHT_CHILDREN = $(".keyword-select-dropdown").children().first().height();

                        if ($scope.selectedVocabIndex < ($scope.vocabulary.length - 1)) {
                            var indexBeforeUpdating = $scope.selectedVocabIndex;
                            var skipcount = 0;
                            do {
                                $scope.selectedVocabIndex++;
                                skipcount++;
                            } while ($scope.selectedVocabIndex < ($scope.vocabulary.length - 1) && !$scope.isSelectableKeyword($scope.vocabulary[$scope.selectedVocabIndex]));

                            //given the order of conditions only checking this condition is sufficient
                            if (!$scope.isSelectableKeyword($scope.vocabulary[$scope.selectedVocabIndex])) {
                                $scope.selectedVocabIndex = indexBeforeUpdating;
                            } else if ($scope.selectedVocabIndex >= Math.floor(MAX_HEIGHT_ELEMENT / MAX_HEIGHT_CHILDREN)) {
                                $(".keyword-select-dropdown")[0].scrollTop = $(".keyword-select-dropdown")[0].scrollTop + MAX_HEIGHT_CHILDREN * (skipcount>0?skipcount:1);
                            }
                        }
                    }

                    $scope.$watch('search.filterText', filterVocabulary);

                    function filterVocabulary() {
                        var filteredVocab = DataService.getVocabTrie().search($scope.search.filterText);
                        $scope.vocabulary = filteredVocab.values();
                        $scope.vocabCountSequence = new Array(($scope.vocabulary.length > MIN_WORDS_TO_SHOW) ? MIN_WORDS_TO_SHOW : $scope.vocabulary.length);

                        $scope.selectedVocabIndex = -1;
                        handleArrowDown();
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
                    searchboxCallbackMap[$scope.searchBoxId] = function () {
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
