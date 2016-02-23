angular.module('starter.controllers')
  .controller('RecurSetupCtrl', function ($scope, API, $ionicHistory, $rootScope, $location, $ionicLoading, Helper, $ionicPopup) {
    $scope.platform = API.currentPlatform();
    $scope.modified = false;
    $scope.validated = false;
    $scope.rpayment_id = 0;
    $scope.to_dioce = $location.search().to_dioce;
    $scope.back = function () {
      $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.enter', function (e) {

      $scope.modified = false;
      $scope.validated = false;
      $scope.rpayment_id = 0;
      $scope.to_dioce = $location.search().to_dioce;

      $scope.donation = Helper.getSharedDonation();
      $scope.create_setup = false;
      if ($scope.donation == null) {
        $rootScope.showLoading("Chargement...");
        $scope.title = "programmer un don de ne jamais manquer la quête?";
        $scope.create_setup = true;
        Helper.GetFavChurchesFromServer(function (data) {
          $rootScope.hideLoading();
          $scope.donation = {};
          if (data) {
            if (data["error"] == "You need to sign in or sign up before continuing.") {
              console.log("Delete history and logout");
              Helper.clearCachedViews(function () {
                $location.path("/home");
              });

            }
            $scope.all_fav_churches = [];

            $scope.all_fav_churches = data;

            console.log("all_fav_churches.length in setup: " + $scope.all_fav_churches.length);
            if ($scope.all_fav_churches.length > 0) {
              $scope.user_has_fav_churches = true;
            }

          } else {
            $scope.fav_churches = [];
            $scope.user_has_fav_churches = false;
          }
        });
      } else {
        console.log("donation: " + $scope.donation);
        $scope.title = "Modifiez votre don";

        $scope.selected_church = {
          'name': $scope.donation.church_name,
          'id': $scope.donation.church_id,
          'favorite': true
        };
      }
    })

    console.log("donation: " + $scope.donation);
    $scope.degrees = [
      {
        "degree_code": "GB",
        "degree_name": "Bachelor of Science"
      },
      {
        "degree_code": "GR",
        "degree_name": "Non Degree Undergraduate"
      }
    ];

    $scope.all_fav_churches = [];
    $scope.selecteddegree = {
      degree_code: "GB"
    };
    $scope.selected_church = {};
    $scope.church = null;
    $scope.select_church = function (church) {
      $scope.church = church;
      if (church != null) {
        console.log("Church " + church.name);
      }

    };
    $scope.select_freq = function (church) {
      console.log("Church " + church);
    };

    $scope.setup_rec = function () {
      $rootScope.showLoading("Chargement...");
      console.log("amount: " + $scope.donation.amount + " church_id: " + $scope.donation.church_id + " frqu: " + $scope.donation.frequency)

      if ($scope.to_dioce) {
        $scope.donation.frequency = "monthly";

      } else {
        $scope.donation.frequency = "weekly";

      }

      var set_url = "";
      //if ($scope.modified == true && $scope.rpayment_id != 0) {
      //  set_url = API.url() + 'rpayments/validate_recurring?id=' + $scope.rpayment_id;
      //} else {
      if ($scope.create_setup == false) {
        set_url = API.url() + 'rpayments/recurring?amount=' + $scope.donation.amount + "&church_id=" + $scope.donation.church_id + "&frequency=" + $scope.donation.frequency + "&" + API.token_params() + "&id=" + $scope.donation.id;
      } else {
        set_url = API.url() + 'rpayments/recurring?amount=' + $scope.donation.amount + "&church_id=" + $scope.church.id + "&frequency=" + $scope.donation.frequency + "&" + API.token_params();
      }

      //}

      console.log(set_url);

      var promise = API.get(set_url);
      promise.then(
        function (data) {
          $rootScope.hideLoading();
          if (data) {
            if (data["error"] == "You need to sign in or sign up before continuing.") {
              console.log("Delete history and logout");
              Helper.clearCachedViews(function () {
                $location.path("/home");
              });

            } else if (data.error == "no card added") {
              $ionicPopup.alert({
                title: "No card found",
                content: "Please add your card info for transaction"
              })
              .then(function (result) {
                $location.path('payment');
              });
            }

            console.log("set Data: " + data);

            //if ($scope.modified == false) {
            //  $scope.modified = true;
            //  $scope.rpayment_id = data["id"];
            //
            //} else {
            //  $scope.validated = true;
            //}
            // $ionicHistory.goBack();

            $location.path('/main/donregular');
          } else {
            console.log('Inside error');
          }
        });
    };

    $scope.delete_rec = function () {
      $rootScope.showLoading("Chargement...");

      var promise = API.get(API.url() + 'rpayments/del_rec?' + API.token_params() + "&id=" + $scope.donation.id);
      promise.then(
        function (data) {
          $rootScope.hideLoading();
          if (data) {
            if (data["error"] == "You need to sign in or sign up before continuing.") {
              console.log("Delete history and logout");
              Helper.clearCachedViews(function () {
                $location.path("/home");
              });
            }
            console.log("set Data: " + data);
            $location.path('/main/donregular');
            // $ionicHistory.goBack();
          } else {
            console.log('Inside error');
          }
        });
    };

})
