angular.module('starter.controllers')
.controller('LoginCtrl', function ($scope, $location, API, $http, $q, $rootScope, $ionicHistory, Helper) {
  $scope.$on('$ionicView.enter', function (e) {
    $scope.user = {};
    $scope.user.email = "";
    $scope.user.pwd = "";
    $scope.no_password = false;
    $scope.error = "";
  });
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  console.log(API.vh(4));
  var url = 'http://localhost:3000/api/v1/';
  $scope.error = null;
  $scope.error_email = null;
  $scope.error_pwd = null;
  $scope.signup = function () {
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path('/signup');
  };
  $scope.user = {};
  $scope.user.email = "";
  $scope.user.pwd = "";
  $scope.error = "";
  $scope.no_password = false;

  $scope.submitForm = function () {
    console.log("Inside login");

    var email = $scope.user.email;
    var pwd = $scope.user.pwd;
    console.log(email);
    console.log(pwd);
    if (pwd) {
      $scope.no_password = false;
    } else {
      $scope.no_password = true;
      return false;
    }
    $rootScope.showLoading("Veuillez patienter...");
    // $scope.error = "inside submit";

    var promise = API.login(API.url() + 'sessions?user_email=' + email + '&user_password=' + pwd);
    promise.then(
      function (data) {
        $rootScope.hideLoading();

        if (!angular.isUndefined(data) && data && data.user_token) {
          // $scope.error = "inside data token: " + data.user_token;
          window.localStorage.setItem("user_token", data.user_token);
          window.localStorage.setItem("user_email", data.user_email);
          window.localStorage.setItem("user_password", data.user_password);
          window.localStorage.setItem("user_name", data.user_name);
          window.localStorage.setItem("user_zip", data.user_zip);
          window.localStorage.setItem("user_address", data.user_address);
          window.localStorage.setItem("user_city", data.user_city);
          window.localStorage.setItem("user_phone", data.user_phone);
          window.localStorage.setItem("user_show_private", data.user_show_private);

          window.localStorage.setItem("main_church_address", refineLocalStorageValue(data.main_church_address));
          window.localStorage.setItem("main_church_city", refineLocalStorageValue(data.main_church_city));
          window.localStorage.setItem("main_church_name", refineLocalStorageValue(data.main_church_name));
          window.localStorage.setItem("main_church_picto", refineLocalStorageValue(data.main_church_picto));
          console.log("user_surname" + data.user_surname);
          window.localStorage.setItem("user_surname", data.user_surname);
          window.localStorage.setItem("main_church_id", refineLocalStorageValue(data.main_church_id));
          $location.path("/main/jedonne");
        } else {
          $scope.error = 'Email or password is wrong';
          // $scope.error = "Email already exists";
        }
      }
    );
  };
})
