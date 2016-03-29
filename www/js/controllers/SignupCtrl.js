angular.module('starter.controllers')
  .controller('SignupCtrl', function ($scope, $location, API, $rootScope) {
    $scope.$on('$ionicView.enter', function (e) {
      $scope.user = {
        email: '',
        pwd: '',
        surname: '',
        name: '',
        show_private: ''
      };
    });
    $scope.user = {};
    $scope.error = "";
    $scope.login = function (username, password) {
      $location.path('/login');
    };

    $scope.user.email = "";
    $scope.user.pwd = "";
    $scope.user.surname = "";
    $scope.user.name = "";
    $scope.user.terms = false;

    $scope.termsChange = function () {
      if ($scope.user.terms) {
        $rootScope.openUrl("http://appli-laquete.fr/conditions-generales-dutilisation/");
      }
    };

    $scope.submitForm = function () {
      console.log("Inside Signup");
      console.log($scope.user.email);
      console.log($scope.user.pwd);
      var email = $scope.user.email;
      var pwd = $scope.user.pwd;
      var surname = $scope.user.surname;
      var name = $scope.user.name;
      var show_private = $scope.user.show_private;
      // $scope.error = "inside submit";
      // var url = 'http://localhost:3000/api/v1/';
      $rootScope.showLoading("Veuillez patienter...");

      var promise = API.get(API.url() + 'registrations?user_email=' + email + '&user_password=' + pwd + '&name=' + name + '&surname=' + surname + "&show_private=" + $scope.user.show_private);
      promise.then(
        function (data) {
          $rootScope.hideLoading();
          if (!angular.isUndefined(data) && data && data.user_token) {
            if (data.user_token == "nil") {
              $scope.error = 'Email already exists';
              //NOTE: just note
            } else {
              // $scope.error = "inside data token: " + data.user_token;
              window.localStorage.setItem("user_token", data.user_token);
              window.localStorage.setItem("user_email", data.user_email);
              window.localStorage.setItem("user_name", name);
              window.localStorage.setItem("user_surname", surname);
              window.localStorage.setItem("user_show_private", show_private);

              window.localStorage.setItem("main_church_address", "null");
              window.localStorage.setItem("main_church_city", "null");
              window.localStorage.setItem("main_church_name", "null");
              window.localStorage.setItem("main_church_picto", "null");
              window.localStorage.setItem("main_church_id", "null");

              //TODO: save the user at session storage
              $location.path('/signup-e2');
            }
            console.log(data);
          } else {
            $scope.error = 'Email or password is wrong';
            // $scope.error = "Email already exists";
          }
        }
      );
    };
  })
