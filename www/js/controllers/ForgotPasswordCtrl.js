angular.module('starter.controllers')
  .controller('ForgotPasswordCtrl', function ($scope, $location, API, $rootScope, $ionicPopup, $ionicHistory) {
    $scope.$on('$ionicView.enter', function (e) {
      $scope.user = {
        email: ''
      };
    });
    $scope.user = {};
    $scope.error = "";
    $scope.login = function (username, password) {
      $location.path('/login');
    };

    $scope.user.email = "";

    $scope.submit_btn = function () {
      console.log($scope.user.email);
      var email = $scope.user.email;
      $rootScope.showLoading("Veuillez patienter...");

      var promise = API.post(API.url() + 'passwords/request_password_reset', {email: $scope.user.email});
      promise.then(
        function (data) {
          $rootScope.hideLoading();
          if (!angular.isUndefined(data) && !data.error) {
            $ionicPopup.alert({
              title: "Succès",
              template: "Email de reinitialisation du mot de passe envoyé"
            }).then(function(res) {
              console.log('Password reset request has been sent', res)
              $location.path('/login');

            });
          } else {
            if (data.error === 'Email does not exist') {
              $ionicPopup.alert({
                title: "Info",
                template: "Pas d’adresse email liée à ce compte."
              }).then(function(res) {
                console.log('Password reset: email does not exist', res)
              });
            } else {
              $scope.error = 'Forgot password request has been failed to send';
            }
          }
        }
      );
    };

    $scope.back = function () {
      $location.path('/login')
    };

  })
