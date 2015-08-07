susana.controller(
    'FindSimilarCtrl',
    ['$scope','FileUploader','DataService',
        function ($scope, FileUploader, DataService) {
            $scope.IMAGES_PER_ROW  = 4;

            $scope.resetActiveImage=function(){
                $scope.activeImage = {
                    anyActive: false,
                    imageDetails: {
                        words_predicted_with_scores: [],
                        words_predicted: "",
                        words_true_proj: [],
                        image_url: ""
                    }
                };
            };
            $scope.resetActiveImage();

            $scope.flashError = false;

            $scope.isTrueWordInPredictedWordsArray = function(trueWord){
                if(trueWord==="dress"){
                    return true;
                }

                var imageItem =  $scope.activeImage.imageDetails;
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

            $scope.similarImages = [];
            $scope.imageRowSequence = new Array(0);

            function showError(msg){
                $scope.errorMessage=msg;
                $scope.flashError = true;
                $scope.resetActiveImage();
            }

            var uploader=$scope.uploader = new FileUploader({
                url: 'upload/image'
            });

            uploader.filters.push({
                name: 'fileExtensionFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            uploader.filters.push({
                name: 'fileSizeFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return item.size <= DataService.getMaxFileUploadSize();
                }
            });

            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                if(filter.name === "fileSizeFilter"){
                    showError("File size should be less than " + Math.floor(DataService.getMaxFileUploadSize()/1000) + " KB");
                }else if(filter.name==="fileExtensionFilter"){
                    showError("Only jpg, png, jpeg, bmp, gif extensions are allowed");
                }
            };
            uploader.onAfterAddingFile = function(fileItem) {
                uploader.uploadItem(fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                if(response.failureReason.length>0){
                    showError(response.failureReason);
                }else {
                    $scope.activeImage.anyActive = true;
                    $scope.activeImage.imageDetails = DataService.processImg2TxtResponseItem(response.imgDetails);
                    $scope.activeImage.imageDetails.imageUrl = "uploadedImages/" + fileItem.file.name;

                    $scope.similarImages = response.similarImages;
                    $scope.imageRowSequence = new Array(Math.ceil($scope.similarImages.length / $scope.IMAGES_PER_ROW));
                }
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                showError("We had an error uploading the image.");
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };

            $scope.uploadFile = function(){
                uploader.uploadAll();
            };

            console.info('uploader', uploader);
        }
    ]
);
