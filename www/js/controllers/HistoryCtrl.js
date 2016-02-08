angular.module('starter.controllers')
.controller('HistoryCtrl', function ($scope, $location, $rootScope, $ionicHistory, API) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  /**
   Every time donation is made increase this counter
   */

  $scope.$on('$ionicView.enter', function (e) {
    $rootScope.badgeCountHistory = 0;
    $scope.refresh();
  });


  //    var form_height = document.getElementById('form-history').offsetWidth;
  //    var windHeight = window.innerHeight;
  //    var tab_and_header_height = window.innerHeight * 18.2 / 100;
  //    var scroll_height = $("#ion-scroll").height();
  //    var col = document.getElementById('scroll-history').offsetWidth;
  //    console.log("col: " + (windHeight - tab_and_header_height));
  //    var x = $(".scroll-history").height(windHeight - (form_height)); //= Math.floor( windHeight - tab_and_header_height );
  //    //var tab_h = $(".tabs").attr('height');
  //    console.log("scroll_height: " + x + scroll_height + " form Height: " + form_height + " tab_and_header_height: " + tab_and_header_height + " windHeight: " + windHeight);

  console.log("Inside HistoryCtrl");
  $scope.refresh = function () {
    $rootScope.is_history = true;
    // $rootScope.header_with_title = true;
    var user_email = window.localStorage.getItem("user_email");
    var user_token = window.localStorage.getItem("user_token");
    var get_params = "user_token=" + user_token + "&user_email=" + user_email;

    // $scope.donations = [];
    $rootScope.showLoading("Chargement...");

    var promise = API.get(API.url() + 'donations/by_user?' + get_params);
    promise.then(
      function (data) {
        $rootScope.hideLoading();
        if (data["error"] == "You need to sign in or sign up before continuing.") {
          console.log("Delete history and logout");
          Helper.clearCachedViews(function () {
            $location.path("/home");
          });

        }
        if (data) {

          $scope.donations = [];
          $scope.donations = data;
          $scope.user_has_donate = true;
          // $scope.donations = data;
          if (data.length > 0) {
            $scope.user_has_donate = true;
            for (var i = $scope.donations.length - 1; i >= 0; i--) {
              $scope.donations[i]["donation_date"] = data[i]["updated_at"];

              //              amount: 90
              //              church_name: "Centre Jean XXIII"
              //              created_at: "2015-12-08T11:35:04.767Z"
              //              picto: 2
              //              updated_at: "2015-12-08T11:35:04.767Z"
              console.log($scope.donations[i]["donation_date"]);
            }
          }
        } else {
          console.log('Inside error');
        }
      });
  };

  $scope.user_has_donate = false;
  $scope.donations = [
//      {
//        picto: '1',
//        donation_date: '20140313T00:00:00',
//        church_name: 'Almsdf',
//        amount: '100'
//    },
//      {
//        'picto': '2',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '200'
//    },
//      {
//        'picto': '3',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '300'
//    },
//      {
//        'picto': '1',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '100'
//    },
//      {
//        'picto': '2',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '200'
//    },
//      {
//        'picto': '3',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '300'
//    },
//      {
//        'picto': '1',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '100'
//    },
//      {
//        'picto': '2',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '200'
//    },
//      {
//        'picto': '3',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '300'
//    },
//      {
//        'picto': '1',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '100'
//    },
//      {
//        'picto': '2',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'Almsdf',
//        'amount': '200'
//    },
//      {
//        'picto': '3',
//        'donation_date': '20140313T00:00:00',
//        'church_name': 'last',
//        'amount': '300'
//    }
  ]


});
