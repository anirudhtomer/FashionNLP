susana.controller(
    'FindSimilarCtrl',
    ['$scope','FileUploader','DataService',
        function ($scope, FileUploader, DataService) {
            $scope.activeImage = {
                anyActive: false
            };

            $scope.flashError = false;

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
                    $scope.errorMessage="File size should be less than " + Math.floor(DataService.getMaxFileUploadSize()/1000) + " KB";
                }else if(filter.name==="fileExtensionFilter"){
                    $scope.errorMessage="Only jpg, png, jpeg, bmp, gif extensions are allowed";
                }

                $scope.flashError = true;
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
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                $scope.activeImage.anyActive = true;
                $scope.activeImage.url = "uploadedImages/" + fileItem.file.name;

            };
            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };

            $scope.uploadFile = function(){
                uploader.uploadAll();
            };


             //   $("#fileu").filestyle({input: false});

            console.info('uploader', uploader);
        }
    ]
);
