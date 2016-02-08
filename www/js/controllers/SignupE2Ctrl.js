angular.module('starter.controllers')
.controller('SignupE2Ctrl', function ($scope, $location, API, Helper, $rootScope, $ionicHistory) {
  $scope.error = '';
  $scope.platform = API.currentPlatform();

  var init = function() {
    $scope.error = '';
  };

  $scope.$on('$ionicView.enter', function (e) {
    init();
  });

  $scope.back = function () {
    $ionicHistory.goBack();
  };
  $scope.user = {};
  $scope.user.cc_number = null;
  $scope.user.email = null;
  $scope.user.cc_ccv = null;
  $scope.user.cc_exp_date = null;
  $scope.skip_card = function () {
    $location.path('/main/jedonne');
  }
  $scope.add_card = function () {
    $rootScope.showLoading("Veuillez patienter");
    var cc_number = $scope.user.cc_number;
    var cc_ccv = $scope.user.cc_cvc;
    var cc_exp_date = $scope.user.cc_exp_date;
    var stripe_email = $scope.user.email;
    console.log("cc_number" + cc_number);
    var promise = API.get(API.url() + 'rpayments/cardinfo?card_number=' + cc_number + '&card_code=' + cc_ccv + '&stripe_email=' + stripe_email + '&exp_date=' + cc_exp_date + API.token_params());
    promise.then(
      function (data) {
        $rootScope.hideLoading();
        console.log("data: " + data);
        if (data["error"] == "You need to sign in or sign up before continuing.") {
          console.log("Delete history and logout");
          Helper.clearCachedViews(function () {
            $location.path("/home");
          });

        }
        if (data == true) {
          init();
          $location.path('/main/jedonne');
        } else {
          $scope.error = data.error;
          // $scope.error = "Email already exists";
        }
      }
    );
  };
  $scope.continue = function () {
    Helper.clearCachedViews(function () {
      console.log("Inside callback clearCache");
      $location.path('/main/jedonne');
    });

  };
})
