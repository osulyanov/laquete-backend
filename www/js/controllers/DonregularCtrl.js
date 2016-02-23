angular.module('starter.controllers')
.controller('DonregularCtrl', function ($scope, API, $ionicHistory, $rootScope, $location, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $ionicLoading, Helper, $ionicModal) {

  $scope.currentDonation = null;
  $scope.showDateModal = false;

  $scope.openModal = function () {
    $scope.data = {};
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '',
      cssClass: 'my-custom-popup-after-donation',
      title: '',
      subTitle: '',
      scope: $scope,
      buttons: [
        {
          text: '<b>&#9746</b>',
          type: 'button button-clear button-positive btn-primary btn-pop-Back',
          onTap: function (e) {
            myPopup.close();
          }
        }
      ]
    });
    myPopup.then(function (res) {
      console.log('Tapped!', res);
      // $scope.selected_church_id = -1;
    });
    setTimeout( function() {
      $('.btn-getInfo-Ok').hide().show(0);
    }, 1000)
  };

  $scope.donations = [];
  $scope.$on('$ionicView.enter', function (e) {
    // $scope.donations = [];
    $rootScope.showLoading("Chargement...");

    var promise = API.get(API.url() + 'donations/by_user_rec?' + API.token_params());
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
          $scope.donations = [];
          $scope.donations = data;
          $scope.user_has_donate = true;
          // $scope.donations = data;
          if (data.length > 0) {
            $scope.user_has_donate = true;
            for (var i = $scope.donations.length - 1; i >= 0; i--) {
              $scope.donations[i]["donation_date"] = data[i]["updated_at"];
              $scope.donations[i]["picto"] = "images/" + data[i]['picto'] + ".png";
            }
          }
        } else {
          console.log('Inside error');
        }
      });
  });

  $scope.getInfo = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/donregularInfoPopup.html',
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

  $scope.add_recurring = function (to_dioce) {
    console.log("Inside goto setup");
    Helper.setSharedDonation(null);
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path('/setup').search({to_dioce: to_dioce});
  };
  $scope.edit_recurring = function (donation) {
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    console.log("Inside goto setup");
    Helper.setSharedDonation(donation);
    to_dioce = false;
    if (donation.frequency == 'monthly') {
      to_dioce = true;
    }
    $location.path('/setup').search({to_dioce: to_dioce});;
  };


  $ionicHistory.nextViewOptions({
    disableBack: true
  });
})
