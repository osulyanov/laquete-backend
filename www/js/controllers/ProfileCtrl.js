angular.module('starter.controllers')
  .controller('ProfileCtrl', function ($scope, $location, $ionicHistory, API) {
    $scope.platform = API.currentPlatform();

    $scope.user = {};

    $scope.mydisabled = true;
    $scope.btn_text = "Modiﬁer";

    $scope.$on('$ionicView.enter', function (e) {
      $scope.user.name = refineLocalStorageValue(window.localStorage.getItem("user_name"));
      $scope.user.surname = refineLocalStorageValue(window.localStorage.getItem("user_surname"));
      $scope.user.email = refineLocalStorageValue(window.localStorage.getItem("user_email"));
      $scope.user.password = refineLocalStorageValue(window.localStorage.getItem("user_password"));
      $scope.user.phone = refineLocalStorageNumber(window.localStorage.getItem("user_phone"));
      $scope.user.show_private = refineLocalStorageBoolean(window.localStorage.getItem("user_show_private"));
      $scope.btn_text = "Modiﬁer";
      $scope.mydisabled = true;
    });


    $scope.profile_btn = function () {
      $scope.mydisabled = !$scope.mydisabled;
      if (!$scope.mydisabled) {
        $scope.btn_text = "Valider";
      } else {
        //TODO: implement user update code
        var update_user = API.get(API.url() + "users/update?user_name=" + $scope.user.name + "&user_surname=" + $scope.user.surname + "&user_password=" + $scope.user.password + "&user_phone=" + $scope.user.phone + "&user_show_private=" + $scope.user.show_private + "&" + API.token_params());
        update_user.then(
          function (data) {
            if (data["error"] == "You need to sign in or sign up before continuing.") {
              console.log("Delete history and logout");
              Helper.clearCachedViews(function () {
                $location.path("/home");
              });

            }
            if (data) {
              window.localStorage.setItem("user_name", data.name);
              window.localStorage.setItem("user_surname", data.surname);
              window.localStorage.setItem("user_email", data.email);
              window.localStorage.setItem("user_password", $scope.user.password);
              window.localStorage.setItem("user_phone", $scope.user.phone);
              window.localStorage.setItem("user_show_private", $scope.user.show_private);

              $scope.btn_text = "Modiﬁer";
            } else {

            }
          }
        );

      }
    };
    $scope.back = function () {
      $ionicHistory.goBack();
    };
  })
