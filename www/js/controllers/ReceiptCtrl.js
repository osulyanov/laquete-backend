angular.module('starter.controllers')
.controller('ReceiptCtrl', function ($scope, $location, $ionicHistory, API,$ionicPopup, $timeout, Helper) {
  $scope.user = {city: '', zip: '', address: ''};
  $scope.can_update = true;

  $scope.$on('$ionicView.enter', function (e) {
    $scope.user.city = refineLocalStorageValue(window.localStorage.getItem("user_city"));
    $scope.user.zip = refineLocalStorageValue(window.localStorage.getItem("user_zip"));
    $scope.user.address = refineLocalStorageValue(window.localStorage.getItem("user_address"));
    if ($scope.user.address) {
      $scope.can_update = false;
    }
  });

  $scope.getInfo = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/getInfoPopup.html',
      cssClass: 'my-custom-popup',
      title: '',
      subTitle: '',
      scope: $scope,
      buttons: [
        {
          text: '<b>Ok</b>',
          type: 'button button-clear button-positive btn-donne btn-primary btn-getInfo-Ok',
          onTap: function (e) {
            myPopup.close();
          }
        }
      ]
    });
    setTimeout( function() {
      $('.btn-getInfo-Ok').hide().show(0);
    }, 1000)
  };

  $scope.$on('$ionicView.afterEnter', function(e) {
    $scope.getInfo();
  });

  $scope.btn_text = "Obtenir mon reçu";
  $scope.platform = API.currentPlatform();
  $scope.back = function () {
    $ionicHistory.goBack();
  };
  $scope.mydisabled = false;
  $scope.profile_btn = function () {
    Helper.UpdateUserInfo($scope.user, function (data) {
      $scope.can_update = false;
      window.localStorage.setItem("user_city", $scope.user.city);
      window.localStorage.setItem("user_zip", $scope.user.zip);
      window.localStorage.setItem("user_address", $scope.user.address);
      $location.path('/notification');
    });
  };
})
