angular.module('starter.controllers')
.controller('PaymentCtrl', function ($scope, $location, $ionicHistory, API, $rootScope) {
  $scope.platform = API.currentPlatform();
  $scope.user = {};

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


  var datePickerCallback = function (val) {
    if (typeof (val) === 'undefined') {
      console.log('No date selected');
    } else {
      console.log('Selected date is : ', val);
      $scope.datepickerObject.inputDate = val;
    }
  };

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
        $scope.user.card_no_p_h = "xxxxxxxxxxxx" + data.last_four;
        $scope.user.card_no = "";
        $scope.user.ccv = data.ccv;
        $scope.datepickerObject.inputDate = data.exp_date;
        console.log(data);
      } else {

      }
    }
  );

  $scope.profile_btn = function () {
    //      $scope.mydisabled = !$scope.mydisabled;
    if (!$scope.mydisabled) {
      $rootScope.showLoading("Veuillez patienter");
      var get_card = API.get(API.url() + "rpayments/update_cardinfo?card_number=" + $scope.user.card_no + "&card_code=" + $scope.user.ccv + "&exp_date=" + $scope.datepickerObject.inputDate + API.token_params());
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
            console.log(data);
            $scope.mydisabled = true;
            $scope.btn_text = "Modiﬁer";
          } else {
            console.log("something went wrong");
          }
        }
      );

    } else {
      $scope.mydisabled = false;
      $scope.btn_text = "Enregistrer";

    }
  };

  var disabledDates = [
    new Date(1437719836326),
    new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
    new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
    new Date("08-14-2015"), //Short format
    new Date(1439676000000) //UNIX format
  ];


})
