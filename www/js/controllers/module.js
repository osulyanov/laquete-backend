angular.module('starter.controllers', ['ionic-datepicker', 'ngIOS9UIWebViewPatch', 'ionic', 'ngMap'])
  .run(function ($rootScope, API) {
    $rootScope.churches = [];
    var user_email = window.localStorage.getItem("user_email"),
      user_token = window.localStorage.getItem("user_token"),
      token_params = "user_token=" + user_token + "&user_email=" + user_email;
  })


  .filter('filterChurch', function() {
    return function(churches, query) {
      if (churches == undefined)
        return [];
      var results = [];
      if (!query)
        results = churches;
      else {
        $.each(churches, function(i, item) {
          if ((item.zip ? item.zip : '').toUpperCase().indexOf(query.toUpperCase()) > -1 || (item.city ? item.city : '').toUpperCase().indexOf(query.toUpperCase()) > -1)
            results.push(item);
        });
      }
      return results;
    }
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
            if (hasValue(main_church_id)) {
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
              if (String(data[i]['picto']).indexOf('.png') !== -1) {
                data[i]['picto']  = String(data[i]['picto']).substr(0, data[i]['picto'].length - 4);
              }
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
              if (String(data[i]['picto']).indexOf('.png') !== -1) {
                data[i]['picto']  = String(data[i]['picto']).substr(0, data[i]['picto'].length - 4);
              }
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

    Helper.GetOneChurchFromServer = function (id, callback) {
      var get_churches = API.get(API.url() + "churches/" + id + "?" + API.token_params());
      get_churches.then(
        function (data) {
          if (data) {
            if (String(data['picto']).indexOf('.png') !== -1) {
              data['picto']  = String(data['picto']).substr(0, data['picto'].length - 4);
            }
            data['picto_hover'] = "images/" + data['picto'] + "-hover.png";
            data['picto'] = "images/" + data['picto'] + ".png";
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
              if (String(data[i]['picto']).indexOf('.png') !== -1) {
                data[i]['picto']  = String(data[i]['picto']).substr(0, data[i]['picto'].length - 4);
              }
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
    Helper.OneTimeDonateDioce = function (amount, church_id, callback) {
      // Helper.OneTimeDonateDioce = function (amount, dioce_id, callback) {
      // var get_churches = API.get(API.url() + "rpayments/denier_charge?amount=" + amount + "&dioce_id=" + dioce_id + "&" + API.token_params());
      var get_churches = API.get(API.url() + "rpayments/denier_charge?amount=" + amount + "&church_id=" + church_id + "&" + API.token_params());
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
    Helper.UpdateUserInfo = function (user, callback) {
      // Helper.OneTimeDonateDioce = function (amount, dioce_id, callback) {
      // var get_churches = API.get(API.url() + "rpayments/denier_charge?amount=" + amount + "&dioce_id=" + dioce_id + "&" + API.token_params());
      var update_user = API.get(API.url() + "users/update?user_city=" + user.city + "&user_address=" + user.address + "&user_zip=" + user.zip + "&" + API.token_params());
      update_user.then(
        function (data) {
          if (data) {
            console.log("User Update Successful in Helper: " + data);
          } else {
            console.log("User Update UnSuccessful in Helper");
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

  .directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(function(){
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
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

    //$scope.showInfoWindow = function (event, evtMap, index) {
    //  map = evtMap;
    //  marker = map.markers[index];
    //  ind = index;
    //  var contentExa = 'Hi<br/>I am an infowindow<a href="http://www.google.com" ></a>' + index;
    //  // replace the following content with contentString to get example of window with url
    //  infoWindow.close();
    //  infoWindow = new google.maps.InfoWindow({
    //    content: contentString
    //  });
    //  infoWindow.open(map, marker);
    //};
    //$scope.hideInfoWindow = function (event, evtMap, index) {
    //  map = evtMap;
    //  marker = map.markers[index];
    //  ind = index;
    //  var contentExa = 'Hi<br/>I am an infowindow<a href="http://www.google.com" ></a>' + index;
    //  // replace the following content with contentString to get example of window with url
    //  var infoWindow = new google.maps.InfoWindow({
    //    content: contentString
    //  });
    //  infoWindow.open(map, marker);
    //};
    $scope.positions = [[40.71, -74.21], [40.72, -74.20], [40.73, -74.19],
      [40.74, -74.18], [40.75, -74.17], [40.76, -74.16], [40.77, -74.15]];
    var ind = -1;

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

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats, $state) {
    console.log($state.current.name);
    console.log("Inside ChatDetailCtrl");
    $scope.chat = Chats.get($stateParams.chatId);
  })

function refineLocalStorageValue(value) {
  return (value !== 'null' && value !== 'undefined') ? value : '';
}

function refineLocalStorageBoolean(value) {
  return (value === 'true');
}

function refineLocalStorageNumber(value) {
  return (value !== 'null' && value !== 'undefined') ? Number(value) : '';
}

function hasValue(value) {
  return (value !== 'null' && value !== 'undefined' && value !== null && value !== undefined && value !== '');
}

