angular.module('starter.controllers')
.controller('AccountCtrl', function ($scope, $ionicHistory, $rootScope, $location, Helper, $state, $stateParams) {
  $scope.$on('$ionicView.enter', function (e) {
    $rootScope.is_history = false;
  });
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  // $scope.clearHistory = function() {
  //   console.log("clear history in AccountCtrl");
  //     $ionicHistory.clearHistory();
  //  }
  var user_email = window.localStorage.getItem("user_email");
  var user_token = window.localStorage.getItem("user_token");
  var user_name = window.localStorage.getItem("user_name");
  var user_surname = window.localStorage.getItem("user_surname");

  var get_params = "user_token=" + user_token + "&user_email=" + user_email;
  $scope.isDisabled = true;
  $scope.isEditable = false;
  $scope.user = {};
  $scope.user.name = user_name;
  $scope.user.subname = user_surname;
  $scope.user.email = user_email;
  $scope.user.password = "********";

  var url = 'http://laquete.herokuapp.com/api/v1/';
  // var url = 'http://localhost:3000/api/v1/';
  $scope.edit_profile = function () {
    console.log('Inside edit');
    $scope.isDisabled = false;
    $scope.isEditable = true;
    $scope.user.password = "";
    // $scope.$apply();
  };
  $scope.logout = function () {
    window.localStorage.setItem("user_token", '');
    window.localStorage.setItem("user_email", '');
    window.localStorage.setItem("user_name", '');
    window.localStorage.setItem("user_zip", '');
    window.localStorage.setItem("user_address", '');
    window.localStorage.setItem("user_city", '');
    window.localStorage.setItem("user_phone", '');
    window.localStorage.setItem("user_show_private", '');
    window.localStorage.setItem("main_church_address", '');
    window.localStorage.setItem("main_church_city", '');
    window.localStorage.setItem("main_church_name", '');
    window.localStorage.setItem("main_church_picto", '');
    window.localStorage.setItem("user_surname", '');
    window.localStorage.setItem("main_church_id", '');

    $rootScope.$emit('laquete.logout');

    $state.transitionTo($state.current, $stateParams, {
      reload: true,
      inherit: false,
      notify: true
    });
    $state.go('login');
    //Helper.clearCachedViewz(function () {
    //  console.log("Inside callback clearCache");
    //  $location.path('/home');
    //});
  };

  $scope.nav_profile = function () {
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path('/profile');
  };
  $scope.nav_payment = function () {
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path('/payment');
  };
  $scope.nav_receipt = function () {
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path('/receipt');
  };
  $scope.nav_about_us = function () {
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path('/about_us');
  };





  $scope.profoliosubmit = function () {
    $scope.isDisabled = true;
    $scope.isEditable = false;
    $scope.user.password = "********";



    // if ($scope.userForm.$valid) {
    //   alert('Form is valid');
    // }
  };
})
