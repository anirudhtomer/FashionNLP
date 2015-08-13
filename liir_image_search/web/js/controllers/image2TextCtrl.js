susana.controller(
    'Image2TextCtrl',
    ['$scope', '$http','DataService',
        function ($scope, $http, DataService) {

            var MIN_IMAGES_TO_SHOW = 10;
            var LOAD_MORE_IMAGES_COUNT = 10;

            $scope.IMAGES_PER_ROW = 1;
            var LOADED_ATLEAST_ONCE = "LOADED_ATLEAST_ONCE";

            $scope.flashThankYou = false;
            $scope.flashError = false;

            $scope.images = [];
            $scope.errorMsg = "";

            $scope.demoModeActive = DataService.isDemoModeActive();
            $scope.checkboxStates = {};
            $scope.tags = "";

            $scope.loadMoreImages = function () {
                if ($scope.imgRowCountSequence.length * $scope.IMAGES_PER_ROW < $scope.images.length) {
                    var remainingImages = $scope.images.length - $scope.imgRowCountSequence.length * $scope.IMAGES_PER_ROW;
                    var newLength = $scope.imgRowCountSequence.length + ((LOAD_MORE_IMAGES_COUNT < remainingImages) ? Math.ceil(LOAD_MORE_IMAGES_COUNT / $scope.IMAGES_PER_ROW) : Math.ceil(remainingImages / $scope.IMAGES_PER_ROW));
                    $scope.imgRowCountSequence = new Array(newLength);
                }
            };

            $scope.isTrueWordInPredictedWordsArray = function(trueWord, imageIndex){
                if(trueWord==="dress"){
                    return true;
                }

                var imageItem = $scope.images[imageIndex];
                if(angular.isDefined(imageItem)){
                    for(var i=0; i<imageItem.words_predicted_with_scores.length; i++){
                        if(trueWord===imageItem.words_predicted_with_scores[i].word){
                            return true;
                        }
                    }
                }else{
                    return false;
                }
            };

            function getSelectedImageIds(){
                var imgIdArray = [];
                for(imgid in $scope.checkboxStates){
                    if($scope.checkboxStates.hasOwnProperty(imgid) && $scope.checkboxStates[imgid]===true){
                        imgIdArray.push(parseInt(imgid));
                    }
                }

                return imgIdArray;
            }

            $scope.submitTags = function(){
                var imgIdArray = getSelectedImageIds();
                if(imgIdArray.length > 0){
                    var tags = $scope.tags.trim();
                    if(tags.charAt(tags.length - 1)==','){
                        tags = tags.substring(0, $scope.tags.length - 1);
                    }

                    if(tags.length==0){
                        flashError("Please enter atleast one tag.");
                    }else {
                        $http({
                            method: 'POST',
                            url: 'store/tags',
                            data: {'images_id_array': imgIdArray, 'tags': tags}
                        }).success(processDBRequestResults);
                    }
                }else{
                    flashError("Please select atleast one image.");
                }
            };

            $scope.reportMisclassified = function(){
                var imgIdArray = getSelectedImageIds();
                if(imgIdArray.length > 0){
                    $http({
                        method: 'POST',
                        url: 'store/misclassfiedimages',
                        data: {'images_misclassified_array': imgIdArray}
                    }).success(processDBRequestResults);
                }else{
                    flashError("Please select atleast one image.");
                }
            };


            function flashError(message){
                $scope.errorMsg = message;
                $scope.flashError = true;
            }

            function processDBRequestResults(data){
                if(data.success==false){
                    flashError("Apologies this operation could not be performed due to an Internal error.")
                }else {
                    $scope.flashThankYou = true;
                }
                //This property is set false by directive
            }

            $scope.searchImages = function (filterKeywords) {
                if (filterKeywords.length === 0) {
                    $scope.images = DataService.retrieveData(IMAGE_2_TEXT_IMAGES);
                } else {
                    $scope.images = DataService.searchImg2TxtImages(filterKeywords);
                }
                $scope.imgRowCountSequence = new Array(($scope.images.length > MIN_IMAGES_TO_SHOW) ? Math.ceil(MIN_IMAGES_TO_SHOW / $scope.IMAGES_PER_ROW) : Math.ceil($scope.images.length / $scope.IMAGES_PER_ROW));
            };

            if (angular.isUndefined(DataService.retrieveData(LOADED_ATLEAST_ONCE))) {
                $scope.searchImages([]);
                DataService.storeData(LOADED_ATLEAST_ONCE, true);
            }
        }
    ]
);
