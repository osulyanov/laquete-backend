angular.module('starter.controllers')
.controller('TutorialsCtrl', function ($scope, API, $ionicHistory, $location, Helper) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $scope.continue = function () {
    var user_email = window.localStorage.getItem("user_email");
    var user_token = window.localStorage.getItem("user_token");
    if (!angular.isUndefined(user_token) && user_token !== '' && user_token !== 'false' && user_token !== null && user_email !== null) {
      console.log("session token Available in Home");
      $location.path("/main/jedonne");
    } else {
      console.log("session token not Available in Home");
      $location.path("/login");
    }
  };
})

