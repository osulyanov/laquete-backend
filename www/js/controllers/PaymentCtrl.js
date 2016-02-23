angular.module('starter.controllers')
.controller('PaymentCtrl', function ($scope, $location, $ionicHistory, API, $rootScope, $ionicPopup, $filter, $rootScope) {
    $scope.platform = API.currentPlatform();
    $scope.user = {};
    $scope.initialized = false;

    $scope.mydisabled = true;
    $scope.btn_text = "Modiﬁer";
    $scope.back = function () {
      $ionicHistory.goBack();
    };

    //  var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];
    //
    var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    $scope.datepickerObject = {
      titleLabel: 'Title', //Optional
      todayLabel: 'Today', //Optional
      closeLabel: 'Close', //Optional
      setLabel: 'Set', //Optional
      setButtonType: 'button-assertive', //Optional
      todayButtonType: 'button-assertive', //Optional
      closeButtonType: 'button-assertive', //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      disabledDates: disabledDates, //Optional
      //weekDaysList: weekDaysList, //Optional
      monthList: monthList, //Optional
      templateType: 'popup', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: new Date(2012, 8, 2), //Optional
      to: new Date(2018, 8, 25), //Optional
      callback: function (val) { //Mandatory
        datePickerCallback(val);
      }
      //    dateFormat: 'dd-MM-yyyy', //Optional
      //    closeOnSelect: false, //Optional
    };

    $scope.$on('$ionicView.enter', function (e) {
      initOnEnterView();
    });

    $rootScope.$on('laquete.logout', function(e) {
      initScope();
    });

    $scope.profile_btn = function (e, userForm) {
      //      $scope.mydisabled = !$scope.mydisabled;
      if (!$scope.mydisabled) {
        $rootScope.showLoading("Veuillez patienter");
        //var date_converted = $filter('date')($scope.user.cc_exp_date, "yyyy-MM-dd");
        var month = String($scope.user.cc_exp_month);
        if (month.length == 1)
          month = '0' + month;
        var date_converted = String($scope.user.cc_exp_year) + '-' + month + '-' + '01';
        var get_card;
        if (hasValue($scope.user.card_no_p_h)) {
          get_card = API.get(API.url() + "rpayments/update_cardinfo?card_number=" + $scope.user.card_no + "&card_code=" + $scope.user.ccv + "&exp_date=" + date_converted + "&" + API.token_params());

        } else {
          get_card = API.get(API.url() + "rpayments/cardinfo?card_number=" + $scope.user.card_no + "&card_code=" + $scope.user.ccv + "&exp_date=" + date_converted + "&" + API.token_params());

        }
        get_card.then(
          function (data) {
            $rootScope.hideLoading();
            if (data["error"] == "You need to sign in or sign up before continuing.") {
              console.log("Delete history and logout");
              Helper.clearCachedViews(function () {
                $location.path("/home");
              });

            }
            if (data) {
              if (data.status === 500 || data.status === '500') {
                $ionicPopup.alert({
                  title: "Invalid Card",
                  content: "Please enter your card info again"
                });

              } else {
                console.log(data);
                $scope.mydisabled = true;
                $scope.btn_text = "Modiﬁer";
                if (data.last_four !== undefined) {
                  $scope.user.card_no_p_h = "xxxxxxxxxxxx" + data.last_four;
                }
                $scope.user.card_no = '';
                $scope.user.ccv = data.ccv;
                $scope.user.cc_exp_date = new Date(data.exp_date + 'T12:00:00');
                $scope.user.cc_exp_month = Number(getMonth(data.exp_date));
                $scope.user.cc_exp_year = Number(getYear(data.exp_date));
                userForm.$setPristine();
              }
            } else {
              console.log("something went wrong");
            }
          }
        );

      } else {
        e.preventDefault();
        $scope.mydisabled = false;
        $scope.btn_text = "Enregistrer";

      }
    };

    var initScope = function() {
      $scope.initialized = false;
      $scope.mydisabled = true;
      $scope.btn_text = "Modiﬁer";

      $scope.user = {};
    };

    var initOnEnterView = function() {
      if (!$scope.initialized) {
        $scope.user = {};
        initCardInfo();

        $scope.initialized = true;
      }
    };

    var initCardInfo = function() {
      var get_card = API.get(API.url() + "users/card?" + API.token_params());
      get_card.then(
        function (data) {
          if (data["error"] == "You need to sign in or sign up before continuing.") {
            console.log("Delete history and logout");
            Helper.clearCachedViews(function () {
              $location.path("/home");
            });

          }
          if (data) {
            if (data.status === 204) {
              $scope.mydisabled = false;
              $scope.btn_text = 'Enregistrer';
            } else {
              if (data.last_four !== undefined) {
                $scope.user.card_no_p_h = "xxxxxxxxxxxx" + data.last_four;
              }
              $scope.user.card_no = "";
              $scope.user.ccv = data.ccv;
              $scope.user.cc_exp_date = new Date(data.exp_date + 'T12:00:00');
              $scope.user.cc_exp_month = Number(getMonth(data.exp_date));
              $scope.user.cc_exp_year = Number(getYear(data.exp_date));
              //$scope.datepickerObject.inputDate = data.exp_date;
              console.log(data);

            }
          }
        }
      );
    }

    var datePickerCallback = function (val) {
      if (typeof (val) === 'undefined') {
        console.log('No date selected');
      } else {
        console.log('Selected date is : ', val);
        $scope.datepickerObject.inputDate = val;
      }
    };

    var disabledDates = [
      new Date(1437719836326),
      new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
      new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
      new Date("08-14-2015"), //Short format
      new Date(1439676000000) //UNIX format
    ];

    var getMonth = function (dateVal) {
      if (hasValue(dateVal)) {
        return dateVal.split('-')[1];
      } else {
        return '';
      }
    }

    var getYear = function (dateVal) {
      if (hasValue(dateVal)) {
        return dateVal.split('-')[0];
      } else {
        return '';
      }
    }


})
