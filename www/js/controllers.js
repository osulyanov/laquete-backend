// angular.module('starter.controllers', [])
angular.module('starter.controllers', ['ngMap', 'ionic-datepicker', 'ngIOS9UIWebViewPatch', 'ionic'])
  .run(function ($rootScope, API) {
    $rootScope.churches = [];
    var user_email = window.localStorage.getItem("user_email"),
      user_token = window.localStorage.getItem("user_token"),
      token_params = "user_token=" + user_token + "&user_email=" + user_email;
  })


.service('Helper', function (API, $ionicHistory) {
  var Helper = this;
  Helper.sharedObject = {};
  Helper.sharedDonation = {};
  Helper.churches = [];

  Helper.getChurches = function () {
    return Helper.churches;
  };

  Helper.setSharedDonation = function (donation) {
    Helper.sharedDonation = donation;
  };

  Helper.getSharedDonation = function () {
    return Helper.sharedDonation;
  };

  Helper.getSharedChurches = function (callback) {
    if (Helper.churches.length != 0) {
      console.log("shared stored already");
      callback(Helper.churches);
    } else {
      Helper.GetChurchesFromServer(48.5149019, 1.8341628, function (data) {
        console.log("shared get");
        Helper.churches = data;
        callback(Helper.churches);
      });
    }
  };
  /**
   * Clear the history and cache before logout
   */
  Helper.clearCache = function () {
    $timeout(function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $log.debug('clearing cache');
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      //After this go back to any state like login
    }, 300);
  };
  /**
     * Clear the history and cache before logout
     * looks more accurate method than the aboce clearCache method
     * $ionicHistory.clearCache() now returns promise so you can ensure cache is cleared
     * Enables promise chaining
     $scope.clearCache().then((function() {
    return knetAccountHelper.updateSettings('preferences');
  })).then((function() {
    return $state.go('app.home')
  }));
     */
  Helper.clearCachedViews = function (callback) {
    window.localStorage.setItem("user_token", null);
    window.localStorage.setItem("user_email", null);
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
    $ionicHistory.clearCache().then(function () {
      callback();
    });
  };

  Helper.clearCachedViewz = function (callback) {
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
    $ionicHistory.clearCache().then(function () {
      callback();
    });
  };
  /**
   * Reloads the current page
   */
  Helper.refreshPage = function () {
    $state.go($state.currentState, {}, {
      reload: true
    })
  };

  Helper.setChurches = function (churches) {
    Helper.churches = churches;
  };

  Helper.GetFavChurchesFromServer = function (callback) {
    var get_churches = API.get(API.url() + "churches/favourite_churches?" + API.token_params());
    get_churches.then(
      function (data) {
        //console.log(data);
        if (data) {
          var main_church_id = window.localStorage.getItem("main_church_id");
          if (main_church_id != "null" && main_church_id != null) {
            var main_church_address = window.localStorage.getItem("main_church_address");
            var main_church_city = window.localStorage.getItem("main_church_city");
            var main_church_name = window.localStorage.getItem("main_church_name");
            var main_church_picto = window.localStorage.getItem("main_church_picto");


            var mainChurchArray = [];
            var mainChurchObject = {
              address: main_church_address,
              city: main_church_city,
              id: main_church_id,
              is_selected: false,
              name: main_church_name,
              picto: main_church_picto
            };
            mainChurchArray[0] = mainChurchObject;
            data = data.concat(mainChurchArray);
          }
          for (var i = 0, j = 0; i < data.length; i++) {
            data[i]['picto_hover'] = "images/" + data[i]['picto'] + "-hover.png";
            data[i]['picto'] = "images/" + data[i]['picto'] + ".png";
          }
          console.log("All churches Successful in Fav: " + data.length);
        } else {
          console.log("All churches UnSuccessful in Fav");
        }
        callback(data);
      }
    );
  };

  Helper.GetAllChurchesFromServer = function (callback) {
    var get_churches = API.get(API.url() + "churches/get_all_churches?" + API.token_params());
    get_churches.then(
      function (data) {
        //console.log(data);
        if (data) {
          for (var i = 0, j = 0; i < data.length; i++) {
            data[i]['picto_hover'] = "images/" + data[i]['picto'] + "-hover.png";
            data[i]['picto'] = "images/" + data[i]['picto'] + ".png";
          }
          console.log("All churches Successful in All: " + data.length);
        } else {
          console.log("All churches UnSuccessful in All");
        }
        callback(data);
      }
    );
  };

  //  Helper.GetChurchesFromServer = function (latitude, longitude, callback) {
  //    var get_churches = API.get(API.url() + "churches/geo_location_search?latitude=" + latitude + "&longitude=" + longitude + "&" + API.token_params());
  //    get_churches.then(
  //      function (data) {
  //        console.log(data);
  //        if (data) {
  //          for (var i = 0, j = 0; i < data.length; i++) {
  //            data[i]['picto_hover'] = "images/" + data[i]['picto'] + "-hover.png";
  //            data[i]['picto'] = "images/" + data[i]['picto'] + ".png";
  //          }
  //          console.log("All churches Successful in near: " + data.length);
  //        } else {
  //          console.log("All churches UnSuccessful in near");
  //        }
  //        callback(data);
  //      }
  //    );
  //  };
  Helper.getNearChurches = function (latitude, longitude, callback) {
    var get_churches = API.get(API.url() + "churches/geo_location_search?latitude=" + latitude + "&longitude=" + longitude + "&" + API.token_params());
    get_churches.then(
      function (data) {
        if (data) {
          for (var i = 0, j = 0; i < data.length; i++) {
            data[i]['picto_hover'] = "images/" + data[i]['picto'] + "-hover.png";
            data[i]['picto'] = "images/" + data[i]['picto'] + ".png";
          }
          console.log("All churches Successful in near: " + data.length);
        } else {
          console.log("All churches UnSuccessful in near");
        }
        callback(data);
      }
    );
  };
  Helper.OneTimeDonate = function (amount, church_id, callback) {
    var get_churches = API.get(API.url() + "rpayments/charge?amount=" + amount + "&church_id=" + church_id + "&" + API.token_params());
    get_churches.then(
      function (data) {
        if (data) {
          console.log("One time Donate Successful in Helper: " + data);
        } else {
          console.log("One time Donate UnSuccessful in Helper");
        }
        callback(data);
      }
    );
  };
  Helper.OneTimeDonateDioce = function (amount, dioce_id, callback) {
    var get_churches = API.get(API.url() + "rpayments/denier_charge?amount=" + amount + "&dioce_id=" + dioce_id + "&" + API.token_params());
    get_churches.then(
      function (data) {
        if (data) {
          console.log("One time Donate Successful in Helper: " + data);
        } else {
          console.log("One time Donate UnSuccessful in Helper");
        }
        callback(data);
      }
    );
  };
})


/**
 * HardwareBackButtonManager
 * To enable call from controller like this
 * HardwareBackButtonManager.disable();
 * re-enable it when you want,
 * HardwareBackButtonManager.enable();
 */
.service('HardwareBackButtonManager', function ($ionicPlatform) {
  this.deregister = undefined;

  this.disable = function () {
    this.deregister = $ionicPlatform.registerBackButtonAction(function (e) {
      e.preventDefault();
      return false;
    }, 101);
  };

  this.enable = function () {
    if (this.deregister !== undefined) {
      this.deregister();
      this.deregister = undefined;
    }
  };
  return this;
})


// after loading image you can get call back like this <img ng-src="{{src}}" imageonload="afterload()" />
// The afterload() function would then be a $scope method
.directive('imageonload', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('load', function () {
        //call the function that was passed
        scope.$apply(attrs.imageonload);
      });
    }
  };
})

.directive('confirmPwd', function ($interpolate, $parse) {
  return {
    require: 'ngModel',
    link: function (scope, elem, attr, ngModelCtrl) {

      var pwdToMatch = $parse(attr.confirmPwd),
        pwdFn = $interpolate(attr.confirmPwd)(scope);

      scope.$watch(pwdFn, function (newVal) {
        ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
      });

      ngModelCtrl.$validators.password = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        return value == pwdToMatch(scope);
      };

    }
  };
})

.directive('hideTabs', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      scope.$watch(attributes.hideTabs, function (value) {
        $rootScope.hideTabs = value;
      });

      scope.$on('$ionicView.beforeLeave', function () {
        $rootScope.hideTabs = false;
      });
    }
  };
})

.controller('MaptestCtrl', function ($scope, $location) {
  // var map, marker;
  var contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the ' +
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
    'south west of the nearest large town, Alice Springs; 450&#160;km ' +
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
    'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
    'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
    'Aboriginal people of the area. It has many springs, waterholes, ' +
    'rock caves and ancient paintings. Uluru is listed as a World ' +
    'Heritage Site.</p>' +
    '<p>Attribution: Uluru, <a href="#/login">' +
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
    '(last visited June 22, 2009).</p>' +
    '</div>' +
    '</div>';
  var infoWindow = new google.maps.InfoWindow({
    content: contentString
  });

  $scope.showInfoWindow = function (event, evtMap, index) {
    map = evtMap;
    marker = map.markers[index];
    ind = index;
    var contentExa = 'Hi<br/>I am an infowindow<a href="http://www.google.com" ></a>' + index;
    // replace the following content with contentString to get example of window with url
    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    infoWindow.open(map, marker);
  };
  $scope.hideInfoWindow = function (event, evtMap, index) {
    map = evtMap;
    marker = map.markers[index];
    ind = index;
    var contentExa = 'Hi<br/>I am an infowindow<a href="http://www.google.com" ></a>' + index;
    // replace the following content with contentString to get example of window with url
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    infoWindow.open(map, marker);
  };
  $scope.positions = [[40.71, -74.21], [40.72, -74.20], [40.73, -74.19],
      [40.74, -74.18], [40.75, -74.17], [40.76, -74.16], [40.77, -74.15]];
  var ind = -1;

})

.controller('ProfileCtrl', function ($scope, $location, $ionicHistory, API) {
  $scope.platform = API.currentPlatform();

  $scope.user = {};
  $scope.user.name = window.localStorage.getItem("user_name");
  $scope.user.surname = window.localStorage.getItem("user_surname");
  $scope.user.email = window.localStorage.getItem("user_email");

  $scope.mydisabled = true;
  $scope.btn_text = "Modiﬁer";
  $scope.profile_btn = function () {
    $scope.mydisabled = !$scope.mydisabled;
    if (!$scope.mydisabled) {
      $scope.btn_text = "Valider";
    } else {
      //TODO: implement user update code
      var get_churches = API.get(API.url() + "users/update?user_name=" + $scope.user.name + "&user_surname=" + $scope.user.surname + "&" + API.token_params());
      get_churches.then(
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
        $rootScope.showLoading("Please wait");
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
  .controller('ReceiptCtrl', function ($scope, $location, $ionicHistory, API,$ionicPopup, $timeout) {

    $scope.getInfo = function() {
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/getInfoPopup.html',
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
    }

    $scope.btn_text = "Obtenir mon reçu";
    $scope.platform = API.currentPlatform();
    $scope.back = function () {
      $ionicHistory.goBack();
    };
    $scope.mydisabled = false;
    $scope.profile_btn = function () {
      $location.path('/notification');
    };
  })

.controller('NotifyCtrl', function ($scope, $location, $ionicHistory, $ionicPlatform, API) {
  $scope.back = function () {
    $ionicHistory.goBack(-2);
  };
  $scope.platform = API.currentPlatform();
})


.controller('AboutUsCtrl', function ($scope, $location, $ionicHistory, $ionicPlatform, API) {
  $scope.platform = API.currentPlatform();
  $scope.back = function () {
    $ionicHistory.goBack();
  };
})


.controller('ChurchesCtrl', function ($scope, $ionicHistory, $rootScope, API, $q, $http, $compile, Helper) {
  $scope.$on('$ionicView.enter', function (e) {

  });

  $scope.ma_paroisses = false;

  //  $scope.initialize = function() {
  //    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
  //
  //    var mapOptions = {
  //      center: myLatlng,
  //      zoom: 16,
  //      mapTypeId: google.maps.MapTypeId.ROADMAP
  //    };
  //    var map = new google.maps.Map(document.getElementById("map"),
  //        mapOptions);
  //
  //
  //    var marker = new google.maps.Marker({
  //      position: myLatlng,
  //      map: map,
  //      title: 'Uluru (Ayers Rock)'
  //    });
  //
  //    google.maps.event.addListener(marker, 'click', function() {
  //      infowindow.open(map,marker);
  //    });
  //
  //    $scope.map = map;
  //  }
  //  //google.maps.event.addDomListener(window, 'load', initialize);

  $scope.user_lat = -1;
  $scope.user_long = -1;
  $scope.main_church_added = false;
  $scope.main_church = {};
  $scope.main_church_id = window.localStorage.getItem("main_church_id");
  if ($scope.main_church_id != null && $scope.main_church_id != "null") {
    $scope.main_church_added = true;
  }

  /* Map code starts here */
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
    timeout: 10000
  });
  $scope.nearChurches = [];
  $scope.has_near_churches = false;
  $scope.no_near_church_msg = "No near churches Found";


  function successCallback(position) {

    $scope.user_lat = position.coords.latitude;
    $scope.user_long = position.coords.longitude;
    var userLocation = $scope.user_lat + ', ' + $scope.user_long;
    console.log("You are found here: " + userLocation);
    $rootScope.showLoading("Please wait...");
    Helper.getNearChurches($scope.user_lat, $scope.user_long, function (data) {
      $rootScope.hideLoading();
      console.log("with location: " + data.length);
      if (data["error"] == "You need to sign in or sign up before continuing.") {
        console.log("Delete history and logout");
        Helper.clearCachedViews(function () {
          $location.path("/home");
        });
      }
      $scope.nearChurches = data;
      if (data.length > 0) {
        $scope.has_near_churches = true;
      } else {
        $scope.has_near_churches = false;
        $scope.nearChurches = [];
      }
    });
  }

  function errorCallback() {
    $rootScope.hideLoading();
    $scope.has_near_churches = false;
    $scope.no_near_church_msg = "Location could not be reached";
    console.log("Location could not be found");
  }
  var infoWindow = null;


  $scope.hide_keyboard = function () {
    console.log("hide");
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard && "ios" == API.currentPlatform()) {
      console.log("hidekeyboard")
      cordova.plugins.Keyboard.close();
    }
    $scope.query = "";
    $scope.query_fav = "";
  }
  $scope.showInfoWindow = function (event, evtMap, index) {
    if (infoWindow == null) {
      infoWindow = new google.maps.InfoWindow({
        content: "contentString"
      });
    }

    $scope.main_church_id = window.localStorage.getItem("main_church_id");

    console.log("inside showInfoWindow");
    var map = evtMap;
    marker = map.markers[index];
    ind = index;
    var contentExa = 'Hi<br/>I am an infowindow<a href="http://www.google.com" ></a>' + index;
    // replace the following content with contentString to get example of window with url
    var htmlElement = '<div><h>' + $scope.all_churches[index]['name'] + '<h/>' + '</br><p>' + $scope.all_churches[index]['address'] + '</p><i class="glyphicon glyphicon-heart-empty" ng-click="test(' + index + ')"></i>' + '</div>';
    var compiled = $compile(htmlElement)($scope);
    if (!$scope.main_church_added && $scope.ma_paroisses) {
      if ($scope.main_church_id != null && $scope.main_church_id == $scope.all_churches[index]['id']) {
        console.log("main church" + $scope.all_churches[index]['name'] + $scope.all_churches[index]['id']);
        htmlElement = '<div><h>' + $scope.all_churches[index]['name'] + '<h/>' + '</br><p>' + $scope.all_churches[index]['address'] + '</p><font color="#B39E83"><i class="glyphicon glyphicon-heart"></i></font>' + '</div>';
      } else {
        htmlElement = '<div><h>' + $scope.all_churches[index]['name'] + '<h/>' + '</br><p>' + $scope.all_churches[index]['address'] + '</p><i class="glyphicon glyphicon-heart-empty" ng-click="main(' + index + ')"></i>' + '</div>';
      }
      compiled = $compile(htmlElement)($scope);
    } else if ($scope.all_churches[index]['favorite']) {
      htmlElement = '<div><h>' + $scope.all_churches[index]['name'] + '<h/>' + '</br><p>' + $scope.all_churches[index]['address'] + '</p><i class="glyphicon glyphicon-heart" ng-click="test(' + index + ')"></i>' + '</div>';
      compiled = $compile(htmlElement)($scope);
    } else {
      htmlElement = '<div><h>' + $scope.all_churches[index]['name'] + '<h/>' + '</br><p>' + $scope.all_churches[index]['address'] + '</p><i class="glyphicon glyphicon-heart-empty" ng-click="test(' + index + ')"></i>' + '</div>';
      compiled = $compile(htmlElement)($scope);
    }

    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: compiled[0]
    });
    infoWindow.open(map, marker);
    $scope.test = function (index) {
      if (infoWindow != null) {
        console.log("Inside close window" + index);
        infoWindow.close();
        $scope.makeFavorite($scope.all_churches[index]);
      }
      console.log("Inside test");

    };
    $scope.main = function (index) {
      if (infoWindow != null) {
        console.log("Inside close window" + index);
        infoWindow.close();
        $scope.addMainChurch($scope.all_churches[index]);
      }
      console.log("Inside test");

    };
  };
  $scope.positions = [[40.71, -74.21], [40.72, -74.20], [40.73, -74.19],
      [40.74, -74.18], [40.75, -74.17], [40.76, -74.16], [40.77, -74.15]];
  /* Map code ends here */


  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  var user_email = window.localStorage.getItem("user_email");
  var user_token = window.localStorage.getItem("user_token");
  var get_params = "user_token=" + user_token + "&user_email=" + user_email;

  $scope.ma_paroisses = false;
  $scope.ma_paroisse = function () {
    console.log("ma_paroisse");
    $scope.ma_paroisses = true;
  };
  $scope.autres_paroisses = function () {
    console.log("autres_paroisses");
    $scope.ma_paroisses = false;
    //NOTE:		manually refresh the google maps
    google.maps.event.trigger(map, 'resize');
  };

  $scope.edit_main_church = function () {
    $scope.main_church_added = false;
  };

  $scope.is_map = true;
  $scope.list_map = function (value) {
    console.log("is_map: " + value);
    $scope.is_map = value;
    if (value) {
      console.log("manually refresh the google maps in map_fav");
      //NOTE:		manually refresh the google maps
      google.maps.event.trigger(map, 'resize');
    }

  };

  $scope.is_map_fav = true;
  $scope.list_map_fav = function (value) {
    console.log("is_map: " + value);
    $scope.is_map_fav = value;
    if (value) {
      //NOTE:		manually refresh the google maps
      console.log("manually refresh the google maps in map_fav");
      google.maps.event.trigger(map, 'resize');
    }

  };



  $scope.callGetChurches = function () {
    //Helper.getSharedChurches(function(data){
    //$rootScope.showLoading("Loading Data...");
    Helper.GetAllChurchesFromServer(function (data) {
      //$rootScope.hideLoading();
      setChurches(data);
    });
  };

  $scope.callGetChurches();
  $scope.searchbytown = false;
  $scope.searchbytown_fav = false;
  //  Helper.GetAllChurchesFromServer(function (data) {
  //    setChurches(data);
  //  });

  $scope.check = function (search) {
    $scope.searchbytown = search;
    // console.log($scope.searchbytown);
  };
  $scope.check_fav = function (search) {
    $scope.searchbytown_fav = search;
    // console.log($scope.searchbytown);
  };
  $scope.PostVille = false;
  $scope.Chercher = false;
  $scope.Geolocalisation = true;
  $scope.searchType = function (search) {
    if (search == "PostVille") {
      console.log("PostVille");
      $scope.PostVille = true;
      $scope.Chercher = false;
      $scope.Geolocalisation = false;
    } else if (search == "Chercher") {
      console.log("Chercher");
      $scope.PostVille = false;
      $scope.Chercher = true;
      $scope.Geolocalisation = false;
    } else if (search == "Geolocalisation") {
      console.log("Geolocalisation");
      $scope.PostVille = false;
      $scope.Chercher = false;
      $scope.Geolocalisation = true;
    }
  };
  $scope.PostVilleFav = false;
  $scope.ChercherFav = false;
  $scope.GeolocalisationFav = true;
  $scope.searchTypeFav = function (search) {
    if (search == "PostVilleFav") {
      console.log("PostVilleFav");
      $scope.PostVilleFav = true;
      $scope.ChercherFav = false;
      $scope.GeolocalisationFav = false;
    } else if (search == "ChercherFav") {
      console.log("ChercherFav");
      $scope.PostVilleFav = false;
      $scope.ChercherFav = true;
      $scope.GeolocalisationFav = false;
    } else if (search == "GeolocalisationFav") {
      console.log("GeolocalisationFav");
      $scope.PostVilleFav = false;
      $scope.ChercherFav = false;
      $scope.GeolocalisationFav = true;
    }
  };

  $scope.setMainChurch = function () {
    console.log("Set Main");
    $scope.main_church_id = window.localStorage.getItem("main_church_id");
    for (var i = 0; i < $scope.all_churches.length; i++) {
      if ($scope.all_churches[i]['id'] == $scope.main_church_id) {
        //console.log("Inside set Main" + $scope.all_churches[i]);
        $scope.main_church = $scope.all_churches[i];
      }
    }
  };

  $scope.addMainChurch = function (obj) {
    $rootScope.showLoading("Please wait...");
    console.log(obj);
    var promise;
    promise = API.get(API.url() + 'users/main_church', {
      'church_id': obj.id,
      'user_email': user_email,
      'user_token': user_token
    });


    // console.log(url + 'favorites',{'church_id': obj.id});
    promise.then(
      function (data) {
        $rootScope.hideLoading();
        if (data["error"] == "You need to sign in or sign up before continuing.") {
          console.log("Delete history and logout");
          Helper.clearCachedViews(function () {
            $location.path("/home");
          });

        }
        if (data.status == "200") {
          console.log("Main Favorite Successful");
          // $location.path('/postsearch');
          //$scope.callGetChurches();
          window.localStorage.setItem("main_church_id", obj['id']);
          $scope.main_church_id = obj['id'];
          console.log(data.address + data.city + data.name + data.picto);
          window.localStorage.setItem("main_church_address", data.church.address);
          window.localStorage.setItem("main_church_city", data.church.city);
          window.localStorage.setItem("main_church_name", data.church.name);
          window.localStorage.setItem("main_church_picto", data.church.picto);

          $scope.setMainChurch();
          $scope.main_church_added = true;
          //obj.favorite = true;
          // $scope.apply();

          // $scope.churchArray = data;
        } else {

        }
      }
    );

    // $location.path('/home');
  };

  $scope.makeFavorite = function (obj) {
    $rootScope.showLoading();
    console.log(obj);
    var promise;
    if (obj['favorite']) {
      console.log("already fav");
      promise = API.get(API.url() + 'favorites/destroy', {
        'church_id': obj.id,
        'user_email': user_email,
        'user_token': user_token
      });
    } else {
      console.log("make fav");
      promise = API.post(API.url() + 'favorites', {
        'church_id': obj.id,
        'user_email': user_email,
        'user_token': user_token
      });
    }

    // console.log(url + 'favorites',{'church_id': obj.id});
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
          console.log("Favorite Successful");
          for (var i = 0, j = 0; i < data.length; i++) {
            data[i]['picto_hover'] = "images/" + data[i]['picto'] + "-hover.png";
            data[i]['picto'] = "images/" + data[i]['picto'] + ".png";
          }
          // $location.path('/postsearch');
          setChurches(data);

        } else {

        }
      }
    );

    // $location.path('/home');
  };

  function setChurches(data) {
    $scope.all_churches = [];
    $scope.all_churches = data;
    console.log("before priniting data");
    console.log(data);
    console.log(" main_church_id: " + $scope.main_church_id);
    if ($scope.main_church_id == null) {
      console.log("if $scope.main_church_id: " + $scope.main_church_id);
      $scope.main_church_added = false;
    }
    for (var i = 0, j = 0; i < data.length; i++) {
      if ($scope.main_church_id == $scope.all_churches[i]['id']) {
        $scope.main_church = $scope.all_churches[i];
        console.log("loop $scope.main_church_id: " + $scope.main_church_id);
      }
    }
  }

  $scope.churchArray = [
      // {'name':'Muqadasa Mar','address':'Anarkali','city':'Lahore','id':'5','latitude':'1','longitude':'1','zip':'54000','favorite': false},
      // {'name':'Muqadasa Ma','address':'unknown','city':'Islamabad','id':'2','latitude':'40.7972934','longitude':'-98.23232','zip':'54902','favorite': false},
      // {'name':'Muqadasa M','address':'Old City','city':'Old City','id':'3','latitude':'30.23232','longitude':'24.23233','zip':'90000','favorite': true},
      // {'name':'Muqadasa ','address':'unknown','city':'Islamabad','id':'2','latitude':'40.7972934','longitude':'-98.23232','zip':'54902','favorite': false},
      // {'name':'Muqadasa','address':'Old City','city':'Old City','id':'3','latitude':'30.23232','longitude':'24.23233','zip':'90000','favorite': true},
      // {'name':'Muqadas','address':'unknown','city':'Islamabad','id':'2','latitude':'40.7972934','longitude':'-98.23232','zip':'54902','favorite': false},
      // {'name':'Muqada','address':'Old City','city':'Old City','id':'3','latitude':'30.23232','longitude':'24.23233','zip':'90000','favorite': true}
    ];
})

.controller('TutorialsCtrl', function ($scope, API, $ionicHistory, $location, Helper) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $scope.continue = function () {
      var user_email = window.localStorage.getItem("user_email");
      var user_token = window.localStorage.getItem("user_token");
      if (!angular.isUndefined(user_token) && user_token !== '' && user_token !== 'false' && user_token !== null && user_email !== null) {
        console.log("session token Available in Home");
        $location.path("/main/jedonne");
        // $location.path( "/maptest" );
      } else {
        console.log("session token not Available in Home");
        $location.path("/login");
        // $location.path( "/maptest" );
      }
    };
  })
  .controller('jedonneCtrl', function ($scope, API, $ionicHistory, $rootScope, $location, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $ionicLoading, Helper) {

    $scope.addChurch = function() {
      $location.path("/main/churches");
    }

    $scope.checkiOS = function iOS() {

      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ];

      while (iDevices.length) {
        if (navigator.platform === iDevices.pop()){ return true; }
      }

      return false;
    }

    var startSwiper = function () {

      if ($scope.swiper != null) {
        console.log("not null")
        $scope.swiper.destroy(true, true)
      }
      $scope.swiper = new Swiper('.swiper-container', {
        loop: false,
        slidesPerView: 3,
        spaceBetween: 0,
        preventClicks: true,
      });



      $scope.slideClicked = function (clickedIndex) {
        var activeIndex = $scope.swiper.activeIndex;
        console.log("clicked index = " + clickedIndex)
        console.log("active index = " + activeIndex)
        if (clickedIndex > activeIndex) {
          $scope.swiper.slideNext(true, 300);
        } else if (clickedIndex < activeIndex) {
          $scope.swiper.slidePrev(true, 300)
        }
      }

      $scope.choseChurch = function (arg) {
        if ($scope.fav_churches.length > 0) {
          $scope.fav_churches[arg]['is_selected'] = true;
          $scope.selected_church_id = $scope.fav_churches[arg]['id'];
          console.log("activeIndex = " + (arg))
          console.log("selected_church_id = " + $scope.selected_church_id)
          console.log("seelcted church name  = " + $scope.fav_churches[arg]['name'])
        }
      }

      $scope.swiper.on('slideChangeStart', function () {
        if ($scope.fav_churches.length != $scope.swiper.activeIndex) {
          $scope.choseChurch($scope.swiper.activeIndex);
        }
        $timeout(function () {
          $scope.$digest();
        })

      });
    }

    $scope.$on('$ionicView.enter', function (e) {
      console.log("view entered")
      $scope.user_has_fav_churches = false;
      $scope.fav_churches = [];
      $rootScope.showLoading("Loading Data...");
      Helper.GetFavChurchesFromServer(function (data) {
        $rootScope.hideLoading();
        if (data) {
          if (data["error"] == "You need to sign in or sign up before continuing.") {
            console.log("Delete history and logout");
            Helper.clearCachedViews(function () {
              $location.path("/home");
            });

          }
          var all_fav_churches = [];
          var all_fav_churches = data;

          $scope.fav_churches = all_fav_churches; //my change

          console.log("all_fav_churches.length: " + all_fav_churches.length);
          if (all_fav_churches.length > 0) {
            $scope.user_has_fav_churches = true;
          }

          startSwiper();
          $scope.choseChurch($scope.swiper.activeIndex);
          $timeout(function () {
            $scope.swiper.update();
            $scope.$digest();
          })

          //for (var i = 0; i < all_fav_churches.length; i++) {
          //  if ((i % 5) == 0) {
          //    $scope.fav_churches[Math.trunc(i / 5)] = [];
          //  }
          //  $scope.fav_churches[Math.trunc(i / 5)][i % 5] = all_fav_churches[i];
          //  $scope.fav_churches[Math.trunc(i / 5)][i % 5]['is_selected'] = false;
          //  //console.log("Index: " + Math.trunc(i / 5) + "  no: " + (i % 5) + " Church: " + $scope.fav_churches[Math.trunc(i / 5)][i % 5]['picto_hover']);
          //}
          //
          //$ionicSlideBoxDelegate.update();


        } else {
          $scope.user_has_fav_churches = false;
          $scope.fav_churches = null;
          console.log("All churches UnSuccessful in jedonneCtrl");
        }
      })
    });

    var selected_church_id = -1;
    var church_first_index = -1;
    var church_second_index = -1;
    $scope.user_has_fav_churches = false;
    // two d array
    $scope.fav_churches = [];

    $rootScope.badgeCountHistory = 0;
    $scope.one_time_donate = function () {
      console.log("church_id: " + $scope.selected_church_id);
      console.log("amount: " + $scope.amount);
      $rootScope.showLoading("Please wait...");
      if ($scope.selected_church_id != -1) {


        Helper.OneTimeDonate($scope.amount, $scope.selected_church_id, function (data) {
          console.log(data);
          $rootScope.hideLoading();
          if (data["error"] == "You need to sign in or sign up before continuing.") {
            console.log("Delete history and logout");
            Helper.clearCachedViews(function () {
              $location.path("/home");
            });

          }
          $scope.amount = 0;
          if (data == true) {
            $scope.showPopup();
            $rootScope.badgeCountHistory += 1;
          } else if (data.error == "no card added") {
            $ionicPopup.alert({
                title: "No card found",
                content: "Please add your card info for transaction"
              })
              .then(function (result) {
                $location.path('signup-e2');
              });

          } else if (data == false) {
            $ionicPopup.alert({
                title: "Something went error",
                content: "Transaction failed. please try again later"
              })
              .then(function (result) {
                $scope.selected_church_id = -1;
                $scope.amount = 0;
                $scope.btn_donate_dis = true;
              });
          }
        })
      } else {
        Helper.OneTimeDonateDioce($scope.amount, $scope.selected_dioce_id, function (data) {
          console.log(data);
          $rootScope.hideLoading();
          if (data["error"] == "You need to sign in or sign up before continuing.") {
            console.log("Delete history and logout");
            Helper.clearCachedViews(function () {
              $location.path("/home");
            });

          }
          $scope.amount = 0;
          if (data == true) {
            $scope.showPopup();
            $rootScope.badgeCountHistory += 1;
          } else if (data.error == "no card added") {
            $ionicPopup.alert({
                title: "No card found",
                content: "Please add your card info for transaction"
              })
              .then(function (result) {
                $location.path('signup-e2');
              });

          } else if (data == false) {
            $ionicPopup.alert({
                title: "Something went error",
                content: "Transaction failed. please try again later"
              })
              .then(function (result) {
                $scope.selected_church_id = -1;
                $scope.amount = 0;
                $scope.btn_donate_dis = true;
              });
          }
        })
      }
    };
    /* POP_UP starts */
      $scope.showPopup = function () {


      $scope.data = {};
      // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          template: '',
          cssClass: 'my-custom-popup-after-donation',
          title: '',
          subTitle: '',
          scope: $scope,


        });
      myPopup.then(function (res) {
        console.log('Tapped!', res);
        $scope.selected_church_id = -1;
        $scope.amount = 0;
        $scope.btn_donate_dis = true;
      });
      $timeout(function () {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
    };
    // A confirm dialog
    $scope.showConfirm = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Consume Ice Cream',
        template: 'Are you sure you want to eat this ice cream?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };

    // An alert dialog
    $scope.showAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Don\'t eat that!',
        template: 'It might taste good'
      });
      alertPopup.then(function (res) {
        console.log('Thank you for not eating my delicious ice cream cone');
      });
    };
    /* POP_UP ends here */

    $scope.diocese_search_active = false;
    $scope.diocese_search_activate = function () {
      $scope.diocese_search_active = !$scope.diocese_search_active;
    };
    $scope.goto_add_fav = function () {
      $location.path('/main/churches');
    };


    $scope.slideHasChanged = function (index) {
      console.log("Index" + index);
    };
    $ionicHistory.nextViewOptions({
      disableBack: false
    });

    $scope.selected_church_id = -1;
    $scope.donation_type = "quete";
    $scope.amount = 0;


    $scope.btn_donate_dis = true;



    //$scope.select_church = function (index, index_second, church_id) {
    //  if ($scope.amount != 0 && $scope.selected_church_id == -1) {
    //    $scope.btn_donate_dis = false;
    //  }
    //  $scope.selected_dioce_id = -1;
    //  console.log("Index: " + index + " Index_second: " + index_second + " Church_id: " + church_id);
    //  $scope.selected_church_id = church_id;
    //  console.log("Before church_first_index: " + church_first_index + " church_second_index: " + church_second_index);
    //  if (church_first_index != -1 && church_second_index != -1) {
    //    $scope.fav_churches[church_first_index][church_second_index]['is_selected'] = false;
    //  }
    //  if (index_second != 2) {
    //    var temp = $scope.fav_churches[index][2];
    //    $scope.fav_churches[index][2] = $scope.fav_churches[index][index_second];
    //    $scope.fav_churches[index][index_second] = temp;
    //    $scope.fav_churches[index][2]['is_selected'] = true;
    //  } else {
    //    $scope.fav_churches[index][2]['is_selected'] = true;
    //  }
    //  church_first_index = index;
    //  church_second_index = 2;
    //  console.log("After church_first_index: " + church_first_index + " church_second_index: " + church_second_index);
    //};
    //
    $scope.money = {
      'one':false,
      'two':false,
      'five':false,
      'ten':false,
      'twenty':false
    }

    $scope.makeBrownMoney = function(arg) {
      $scope.money[arg] = true;
      setTimeout(function() {
        $scope.money[arg] = false;
        $timeout(function() {
          $scope.$digest();
        })
      },300)
    }

    $scope.add1 = function () {

      $scope.makeBrownMoney('one');

      if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
        $scope.btn_donate_dis = false;
      }


      $scope.amount += 1;
      console.log("after adding 1: " + $scope.amount + " selected_church_id" + $scope.selected_church_id);
      $("#amount").text($scope.amount);
    };
    $scope.add2 = function () {

      $scope.makeBrownMoney('two');

      if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
        $scope.btn_donate_dis = false;
      }
      $scope.amount += 2;
      $("#amount").text($scope.amount);
      console.log("after adding 2: " + $scope.amount);
    };
    $scope.add5 = function () {
      $scope.makeBrownMoney('five');
      if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
        $scope.btn_donate_dis = false;
      }
      $scope.amount += 5;
      $("#amount").text($scope.amount);
    };
    $scope.add10 = function () {
      $scope.makeBrownMoney('ten');
      if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
        $scope.btn_donate_dis = false;
      }
      $scope.amount += 10;
      $("#amount").text($scope.amount);
    };
    $scope.add20 = function () {
      $scope.makeBrownMoney('twenty');
      if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
        $scope.btn_donate_dis = false;
      }
      $scope.amount += 20;
      $("#amount").text($scope.amount);
    };
    $scope.zero = function () {
      if ($scope.amount != 0) {
        $scope.btn_donate_dis = true;
      }
      $scope.amount = 0;
      $("#amount").text($scope.amount);
      console.log("after clicked 0: " + $scope.amount);
    };

    $scope.quete_donate = true;
    $scope.quete = function () {
      console.log("Img quete clicked");
      $scope.donation_type = "quete";
      $scope.quete_donate = true;
      $scope.church_title = "Paroisse";
    };
    $scope.diocese_search = false;
    /* vairables for testing */
    // $scope.quete_donate = false;
    // $scope.diocese_search = true;

    $scope.cancel_diocese = function () {
      $scope.quete_donate = true;
      $scope.diocese_search = false;
      diocese_first_index = -1;
      diocese_second_index = -1;
      $scope.selected_church_id = -1;
      $scope.selected_dioce_id = -1;
      $scope.btn_donate_dis = true;
      $scope.church_title = "Paroisse"
    }
    $scope.searched_churches = [];
    $scope.has_searched_churches = false;

    $scope.diocese_search_btn = function (zipcode) {
      var zip = zipcode;
      var get_churches = API.get(API.url() + "churches/manual_search?keyword=" + zip + "&" + API.token_params());
      get_churches.then(
        function (data) {
          if (data) {
            if (data["error"] == "You need to sign in or sign up before continuing.") {
              console.log("Delete history and logout");
              Helper.clearCachedViews(function () {
                $location.path("/home");
              });

            }
            //if ($scope.fav_churches[church_first_index] != null && $scope.fav_churches[church_first_index][2] != null) {
            //  $scope.fav_churches[church_first_index][2]['is_selected'] = false;
            //}

            $scope.selected_church_id = -1;
            $scope.selected_dioce_id = -1;
            for (var i = 0, j = 0; i < data.length; i++) {
              data[i]['picto_hover'] = "images/" + data[i]['picto'] + "-hover.png";
              data[i]['picto'] = "images/" + data[i]['picto'] + ".png";
            }
            $scope.diocese_search = true;
            console.log("All churches Successful in diocese_search_btn");
            console.log(data);
            if (data.length > 0) {
              $scope.has_searched_churches = true;
              $scope.selected_dioce_id = data[0].id;
            }


            $scope.searched_churches = [];
            for (var i = 0; i < data.length; i++) {
              if ((i % 5) == 0) {
                $scope.searched_churches[Math.trunc(i / 5)] = [];
              }
              $scope.searched_churches[Math.trunc(i / 5)][2 % 5] = data[i];
              $scope.searched_churches[Math.trunc(i / 5)][2 % 5]['is_selected'] = true;
              console.log($scope.searched_churches[Math.trunc(i / 5)][2 % 5]['is_selected']);
              console.log("Index: " + Math.trunc(i / 5) + "  no: " + (2 % 5) + " Church: " + $scope.searched_churches[Math.trunc(i / 5)][2 % 5]['picto_hover']);
            }
            if ($scope.amount != 0) {
              $scope.btn_donate_dis = false;
            }

            $ionicSlideBoxDelegate.update();
          } else {
            console.log("All churches UnSuccessful in diocese_search_btn");
          }
        }
      );
    };
    var diocese_first_index = -1;
    var diocese_second_index = -1;

    $scope.select_diocese = function (index, index_second, selected_dioce_id) {
      if ($scope.amount != 0 && $scope.selected_dioce_id == -1) {
        $scope.btn_donate_dis = false;
      }
      console.log("Index: " + index + " Index_second: " + index_second + " selected_dioce_id: " + selected_dioce_id);
      $scope.selected_dioce_id = selected_dioce_id;
      //      $scope.selected_church_id = church_id;
      console.log("Before church_first_index: " + diocese_first_index + " church_second_index: " + diocese_second_index);
      if (diocese_first_index != -1 && diocese_second_index != -1) {
        //$scope.fav_churches[diocese_first_index][diocese_second_index]['is_selected'] = false;
      }
      if (index_second != 2) {
        var temp = $scope.searched_churches[index][2];
        $scope.searched_churches[index][2] = $scope.searched_churches[index][index_second];
        $scope.searched_churches[index][index_second] = temp;
        $scope.searched_churches[index][2]['is_selected'] = true;
      } else {
        $scope.searched_churches[index][2]['is_selected'] = true;
      }
      diocese_first_index = index;
      diocese_second_index = 2;
      console.log("After church_first_index: " + church_first_index + " church_second_index: " + church_second_index);
    };
    $scope.church_title = "Paroisse"
    $scope.devier = function () {
      $scope.donation_type = "devier";
      $scope.quete_donate = false;
      console.log("Img devier clicked");
      $scope.church_title = "Diocèse"
      $scope.btn_donate_dis = true;

    };

    $scope.addFavChurch = function () {
      console.log("addFavChurch");
      $location.path('/tab/churches');
    };
  })

.controller('RecurSetupCtrl', function ($scope, API, $ionicHistory, $rootScope, $location, $ionicLoading, Helper) {
    $scope.platform = API.currentPlatform();
    $scope.back = function () {
      $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.enter', function (e) {

      $scope.donation = Helper.getSharedDonation();
      $scope.create_setup = false;
      if ($scope.donation == null) {
        $rootScope.showLoading("Loading Data...");
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
        $scope.all_fav_churches = [];
        $scope.all_fav_churches = [{
          'name': $scope.donation.church_name,
          'id': $scope.donation.church_id,
          'favorite': true
        }];

        $scope.selected_church = $scope.all_fav_churches[0];
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
        "degree_name": "Non Degree Undergraduate unun dfsfsdfsdfsdfsdfsdfs"
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
      $rootScope.showLoading("Loading Data...");
      console.log("amount: " + $scope.donation.amount + " church_id: " + $scope.donation.church_id + " frqu: " + $scope.donation.frequency)
      var set_url = "";
      if ($scope.create_setup == false) {
        set_url = API.url() + 'rpayments/recurring?amount=' + $scope.donation.amount + "&church_id=" + $scope.donation.church_id + "&frequency=" + $scope.donation.frequency + "&" + API.token_params() + "&id=" + $scope.donation.id;
      } else {
        set_url = API.url() + 'rpayments/recurring?amount=' + $scope.donation.amount + "&church_id=" + $scope.church.id + "&frequency=" + $scope.donation.frequency + "&" + API.token_params();
      }
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

            }
            console.log("set Data: " + data);
            $ionicHistory.goBack();
          } else {
            console.log('Inside error');
          }
        });
    };

    $scope.delete_rec = function () {
      $rootScope.showLoading("Loading Data...");

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
            $ionicHistory.goBack();
          } else {
            console.log('Inside error');
          }
        });
    };

  })
  .controller('DonregularCtrl', function ($scope, API, $ionicHistory, $rootScope, $location, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $ionicLoading, Helper) {

    $scope.donations = [];
    $scope.$on('$ionicView.enter', function (e) {
      // $scope.donations = [];
      $rootScope.showLoading("Loading Data...");

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


    $scope.add_recurring = function () {
      console.log("Inside goto setup");
      Helper.setSharedDonation(null);
      $ionicHistory.nextViewOptions({
        disableBack: false
      });
      $location.path('/setup');
    };
    $scope.edit_recurring = function (donation) {
      $ionicHistory.nextViewOptions({
        disableBack: false
      });
      console.log("Inside goto setup");
      Helper.setSharedDonation(donation);
      $location.path('/setup');
    };


    $ionicHistory.nextViewOptions({
      disableBack: true
    });
  })


.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats, $state) {
  console.log($state.current.name);
  console.log("Inside ChatDetailCtrl");
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('HomeCtrl', function ($scope, $location, $rootScope) {

    //    var body = document.getElementsByTagName("body")[0];
    //    console.log("Inside HomeCtrl: " + body.id);
    //    body.id = "HomeCtrl";
    //    console.log("Inside HomeCtrl: " + body.id);

    // var posOptions = {timeout: 10000, enableHighAccuracy: false};
    // $cordovaGeolocation
    //   .getCurrentPosition(posOptions)
    //   .then(function (position) {
    //     var latitude  = position.coords.latitude
    //     var longitude = position.coords.longitude
    //     console.log("latitude: " + latitude);
    //     console.log("longitude: "+ longitude);
    //   }, function(err) {
    //     // error
    //   });

    // $rootScope.callGetChurches();
    // var w=$(window).width()/100;
    // var h=$(window).height()/100;
    // function vw( val ) {
    //    return  w*val+'px';
    // }
    // function vh( val ) {
    //    return  h*val+'px';
    // }
    // console.log("vh(4): "+vw(4));
    // console.log("w: "+w);
    // console.log("h: "+h);
    // var url = 'http://localhost:3000/api/v1/';

    //TANWEER: to clear the history
    // window.history.go(-(history.length - 1));
    // window.location.replace('your new url');

    // var body = document.getElementsByTagName("body")[0];
    // body.id = "index";

    // adding a global variable
    // $rootScope.bodylayout = 'index';

    // window.localStorage.setItem("key","value");
    // window.localStorage.setItem("user_email","");
    // window.localStorage.setItem("user_token","");
    // $scope.key = window.localStorage.getItem("key");
    //var email = window.localStorage['user_email'] = "abc@gmail.com";
    // window.localStorage['user_email'];
    // console.log("email:"+email);


    var user_email = window.localStorage.getItem("user_email");
    var user_token = window.localStorage.getItem("user_token");
    console.log("user_email:" + user_email + " user_token:" + user_token);


    $scope.login = function () {
      var user_tutorials = window.localStorage.getItem("user_tutorials");
      console.log(user_tutorials);

      if (user_tutorials == null) {
        window.localStorage.setItem("user_tutorials", "viewed");
        $location.path("/tutorials");
      } else if ((window.localStorage.getItem("user_token") != '') && (window.localStorage.getItem("user_token") != 'false') && (window.localStorage.getItem("user_token") != null)) {
        console.log("session token Available in Home");
        console.log(window.localStorage.getItem("user_token"));
        if (window.localStorage.getItem("user_token") == "null" || window.localStorage.getItem("user_token") == null) {
          $location.path("/login");
          // $location.path( "/maptest" );
        } else {
          $location.path("/main/jedonne");
        }
      } else {
        console.log("session token not Available in Home");
        $location.path("/login");
        // $location.path( "/maptest" );
      }
      // $location.path( "/history" );
    };
  })
  .controller('AccountCtrl', function ($scope, $ionicHistory, $rootScope, $location, Helper, $state) {
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
      window.localStorage.setItem("user_token", "");
      window.localStorage.setItem("user_email", "");
      $state.transitionTo($state.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
      $location.path('/home');
      //      Helper.clearCachedViewz(function () {
      //        console.log("Inside callback clearCache");
      //        $location.path('/home');
      //      });
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
  .controller('LoginCtrl', function ($scope, $location, API, $http, $q, $rootScope, $ionicHistory, Helper) {
    $scope.$on('$ionicView.enter', function (e) {
      $scope.user = {};
      $scope.user.email = "";
      $scope.user.pwd = "";
    });
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    console.log(API.vh(4));
    var url = 'http://localhost:3000/api/v1/';
    $scope.error = null;
    $scope.error_email = null;
    $scope.error_pwd = null;
    $scope.signup = function () {
      $ionicHistory.nextViewOptions({
        disableBack: false
      });
      $location.path('/signup');
    };




    $scope.user = {};
    $scope.user.email = "";
    $scope.user.pwd = "";
    $scope.error = "";

    $scope.submitForm = function () {
      console.log("Inside login");

      var email = $scope.user.email;
      var pwd = $scope.user.pwd;
      console.log(email);
      console.log(pwd);
      $rootScope.showLoading("Please wait...");
      // $scope.error = "inside submit";

      var promise = API.login(API.url() + 'sessions?user_email=' + email + '&user_password=' + pwd);
      promise.then(
        function (data) {
          $rootScope.hideLoading();

          if (!angular.isUndefined(data) && data && data.user_token) {
            // $scope.error = "inside data token: " + data.user_token;
            window.localStorage.setItem("user_token", data.user_token);
            window.localStorage.setItem("user_email", data.user_email);
            window.localStorage.setItem("user_name", data.user_name);

            window.localStorage.setItem("main_church_address", data.main_church_address);
            window.localStorage.setItem("main_church_city", data.main_church_city);
            window.localStorage.setItem("main_church_name", data.main_church_name);
            window.localStorage.setItem("main_church_picto", data.main_church_picto);
            console.log("user_surname" + data.user_surname);
            window.localStorage.setItem("user_surname", data.user_surname);
            window.localStorage.setItem("main_church_id", data.main_church_id);
            $location.path("/main/jedonne");
          } else {
            $scope.error = 'Email or password is wrong';
            // $scope.error = "Email already exists";
          }
        }
      );
    };
  })

.controller('SignupCtrl', function ($scope, $location, API, $rootScope) {
    $scope.$on('$ionicView.enter', function (e) {
      $scope.user = {};
      $scope.user.email = "";
      $scope.user.pwd = "";
      $scope.user.surname = "";
      $scope.user.name = "";
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

    $scope.submitForm = function () {
      console.log("Inside Signup");
      console.log($scope.user.email);
      console.log($scope.user.pwd);
      var email = $scope.user.email;
      var pwd = $scope.user.pwd;
      var surname = $scope.user.surname;
      var name = $scope.user.name;
      // $scope.error = "inside submit";
      // var url = 'http://localhost:3000/api/v1/';
      $rootScope.showLoading("Please wait...");

      var promise = API.get(API.url() + 'registrations?user_email=' + email + '&user_password=' + pwd + '&name=' + name + '&surname=' + surname);
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
  .controller('SignupE2Ctrl', function ($scope, $location, API, Helper, $rootScope, $ionicHistory) {
    $scope.platform = API.currentPlatform();
    $scope.$on('$ionicView.enter', function (e) {

    });
    $scope.back = function () {
      $ionicHistory.goBack();
    };
    $scope.user = {};
    $scope.user.cc_number = null;
    $scope.user.email = null;
    $scope.user.cc_ccv = null;
    $scope.user.cc_exp_date = null;
    $scope.add_card = function () {
      $rootScope.showLoading("Please wait");
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
            $location.path('/main/jedonne');
          } else {
            $scope.error = 'Email or password is wrong';
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
  .controller('testCtrl', function ($scope, $location) {
    $scope.$on('$ionicView.enter', function (e) {
      console.log("Inside testCtrl");
    });
  })
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

      $scope.donations = [{
        "picto":1,
        "church_id":99,
        "church_name":"sfdbsdmxcvbmcxbvmxc",
        "dioce_name":"dsfbsdbcvxnmbnvm",
        "amount":881
      }];
      //$rootScope.showLoading("Loading Data...");

      //var promise = API.get(API.url() + 'donations/by_user?' + get_params);
      //promise.then(
      //  function (data) {
      //    $rootScope.hideLoading();
      //    if (data["error"] == "You need to sign in or sign up before continuing.") {
      //      console.log("Delete history and logout");
      //      Helper.clearCachedViews(function () {
      //        $location.path("/home");
      //      });
      //
      //    }
      //    if (data) {
      //
      //      $scope.donations = [];
      //      $scope.donations = data;
      //      $scope.user_has_donate = true;
      //      // $scope.donations = data;
      //      if (data.length > 0) {
      //        $scope.user_has_donate = true;
      //        for (var i = $scope.donations.length - 1; i >= 0; i--) {
      //          $scope.donations[i]["donation_date"] = data[i]["updated_at"];
      //
      //          //              amount: 90
      //          //              church_name: "Centre Jean XXIII"
      //          //              created_at: "2015-12-08T11:35:04.767Z"
      //          //              picto: 2
      //          //              updated_at: "2015-12-08T11:35:04.767Z"
      //          console.log($scope.donations[i]["donation_date"]);
      //        }
      //      }
      //    } else {
      //      console.log('Inside error');
      //    }
      //  });
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
