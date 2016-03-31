angular.module('starter.controllers')
  .controller('ChurchesCtrl', function ($scope, $ionicHistory, $rootScope, API, $q, $http, $compile, Helper, $location, NgMap, $ionicLoading, $ionicPopup, $timeout) {
    $scope.initialized = false;

    $scope.scopeParam = {query: '', query_fav: '', ma_paroisses: false, in_fav_list: true, main_church_added: false};

    $scope.user_lat = -1;
    $scope.user_long = -1;
    $scope.main_church = {};
    $scope.main_church_id = window.localStorage.getItem("main_church_id");
    if (hasValue($scope.main_church_id)) {
      $scope.scopeParam.main_church_added = true;
    }

    $scope.near_churches = [];
    $scope.has_near_churches = false;
    $scope.no_near_church_msg = "Pas d'église à proximité";
    $scope.fav_churches = [];

    var user_email = '';
    var user_token = '';
    var get_params = '';
    var defaultLatLon = {lat: 48.5149019, lng: 1.8341628};
    var currentLatLon = {lat: 0, lng: 0};
    //var currentLatLon = {lat: 0, lng: 0};

    /* Map code starts here */
    //navigator.geolocation.getCurrentPosition(currentLocationSuccessCallback, currentLocationErrorCallback, {
    //  timeout: 10000
    //});

    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $scope.$on('$ionicView.enter', function (e) {
      $scope.is_map_fav = true;
      $scope.is_map = true;

      if ($location.search().default_tab == "false") {
        $scope.scopeParam.in_fav_list = false;
        $scope.scopeParam.ma_paroisses = false;
      } else if ($location.search().default_tab == "true") {
        $scope.scopeParam.main_church_added = false;
        $scope.scopeParam.ma_paroisses = true;
      } else {
        $scope.scopeParam.in_fav_list = true;
        $scope.scopeParam.ma_paroisses = false;
        $scope.scopeParam.main_church_added = true;
      }

      assignMap();

      initOnEnterView();
    });

    $rootScope.$on('laquete.logout', function (e) {
      $scope.scopeParam.main_church_added = false;
      initScope();
    });

    $scope.current_location = function (showLoading) {
      var map = $scope.map,
        pos;
      if (showLoading) {
        $ionicLoading.show({
          template: 'Chargement...'
        });
      }

      var geoMarker = new GeolocationMarker();

      geoMarker.setCircleOptions({fillColor: '#808080'});

      google.maps.event.addListener(geoMarker, 'geolocation_error', showGeolocationError);

      navigator.geolocation.getCurrentPosition(function (position) {
          // TODO: remove
          currentLatLon.lat = position.coords.latitude;
          currentLatLon.lng = position.coords.longitude;
          pos = new google.maps.LatLng(currentLatLon.lat, currentLatLon.lng);
          //pos = new google.maps.LatLng(defaultLatLon.lat, defaultLatLon.lng);
          console.log(pos);

          map.setCenter(pos);

          geoMarker.setMap(map);

          $ionicLoading.hide();
        },
        function (e) {
          console.log('ChurchesCtrl current location error: ' + e.code)

          if (showLoading) {
            console.log(e);
          }

          if (currentLatLon.lat === 0) {
            if ($rootScope.currentLatLon !== undefined && $rootScope.currentLatLon.lat !== 0) {
              currentLatLon = $rootScope.currentLatLon;
            } else {
              currentLatLon = defaultLatLon;
            }
          }

          pos = new google.maps.LatLng(currentLatLon.lat, currentLatLon.lng);
          //TODO: remove
          //pos = new google.maps.LatLng(defaultLatLon.lat, defaultLatLon.lng);

          map.setCenter(pos);

          geoMarker.setMap(map);

          if (showLoading) {
            $ionicLoading.hide();
          }

        }, {timeout: 5000});
    };

    var showGeolocationError = function (error) {
      console.log('There was an error obtaining your position. Message: ' + error.message);

      //if (currentLatLon.lat !== 0) {
      var err_msg = '';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          err_msg = ""
          //err_msg="User denied the request for Geolocation."
          break;
        case error.POSITION_UNAVAILABLE:
          err_msg = "Location information is unavailable."
          break;
        case error.TIMEOUT:
          err_msg = "The request to get user location timed out."
          break;
        case error.UNKNOWN_ERROR:
          err_msg = "An unknown error occurred."
          break;
      }

      //if (err_msg) {
      //  $ionicPopup.alert({
      //    title: "Geolocation",
      //    template: err_msg
      //  }).then(function(res) {
      //    console.log('geolocation error message closed.', res)
      //  });
      //}

      //}

    };

    $scope.hideKeyboard = function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }

      $scope.is_map = true;
      $scope.scopeParam.query = "";
      document.getElementById('query_id').value = '';
      document.getElementById('query_id').blur();
      document.getElementById('tab-churches').focus();
      $('#query-cancel').addClass('ng-hide');
      resizeMap();

    };

    $scope.hideKeyboardFav = function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }

      $scope.is_map_fav = true;
      $scope.scopeParam.query_fav = "";
      document.getElementById('query_fav_id').value = '';
      document.getElementById('query_fav_id').blur();
      document.getElementById('tab-fav-churches').focus();
      $('#query-fav-cancel').addClass('ng-hide');
      resizeMap();
    };

    $scope.markerShowInfoWindow = function (event, index) {
      $scope.selected_church_marker = $scope.near_churches[index];
      $scope.selected_church_index_marker = index;

      $scope.map.showInfoWindow('info-window-church', 'marker' + index);

      $scope.test = function (index) {
        $scope.map.hideInfoWindow('info-window-church');
        $scope.makeFavorite($scope.near_churches[index]);
        console.log("Inside test");
      };

      $scope.main = function (index) {
        $scope.map.hideInfoWindow('info-window-church');
        $scope.addMainChurch($scope.near_churches[index]);
        console.log("Inside test");
      };
    };

    $scope.maParoisse = function () {
      console.log("ma_paroisse");
      initMaTab();
      $scope.scopeParam.ma_paroisses = true;
      resizeMap();
    };

    $scope.autresParoisses = function () {
      console.log("autresParoisses");
      initFavTab();
      $scope.scopeParam.ma_paroisses = false;
      //NOTE:		manually refresh the google maps
      resizeMap();
    };

    $scope.editMainChurch = function () {
      $scope.scopeParam.main_church_added = false;
      $scope.is_map = true;
      $scope.scopeParam.query = '';
      centerMapDoubled();
    };

    $scope.backFromEditMainChurch = function () {
      $scope.scopeParam.main_church_added = true;
    };

    $scope.callGetChurches = function () {
      $rootScope.showLoading('Chargement...');
      Helper.GetAllChurchesFromServer(function (data) {
        setChurches(data);
        $scope.initialized = true;
        $rootScope.hideLoading();
      }, function (e) {
        $rootScope.hideLoading();
      });
    };

    $scope.queryFocus = function (focused, query) {
      if (focused) {
        $scope.is_map = false;
      }
    };

    $scope.queryFocusFav = function (focused, query) {
      if (focused) {
        $scope.is_map_fav = false;
      }
    };

    $scope.backToFavList = function () {
      $scope.scopeParam.in_fav_list = true;
    };

    $scope.goToChooseFav = function () {
      $scope.scopeParam.in_fav_list = false;
      $scope.is_map_fav = true;
      $scope.scopeParam.query_fav = '';
      centerMapDoubled();
    };

    $scope.setMainChurch = function () {
      console.log("Set Main");
      $scope.main_church_id = window.localStorage.getItem("main_church_id");
      for (var i = 0; i < $scope.all_churches.length; i++) {
        if ($scope.all_churches[i]['id'] == $scope.main_church_id) {
          $scope.main_church = $scope.all_churches[i];
        }
      }
    };

    $scope.addMainChurch = function (obj) {
      $rootScope.showLoading("Veuillez patienter...");
      console.log(obj);
      var promise;
      promise = API.get(API.url() + 'users/main_church', {
        'church_id': obj.id,
        'user_email': user_email,
        'user_token': user_token
      });

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
            window.localStorage.setItem("main_church_id", obj['id']);
            $scope.main_church_id = obj['id'];
            window.localStorage.setItem("main_church_address", data.church.address);
            window.localStorage.setItem("main_church_city", data.church.city);
            window.localStorage.setItem("main_church_name", data.church.name);
            window.localStorage.setItem("main_church_picto", data.church.picto);

            $scope.setMainChurch();
            setChurches($scope.all_churches);
            $scope.scopeParam.main_church_added = true;
          }
        }
      );
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
              if (String(data[i]['picto']).indexOf('.png') !== -1) {
                data[i]['picto'] = String(data[i]['picto']).substr(0, data[i]['picto'].length - 4);
              }
              data[i]['picto_hover'] = "images/" + data[i]['picto'] + "-hover.png";
              data[i]['picto'] = "images/" + data[i]['picto'] + ".png";
            }
            setChurches(data);
            $scope.scopeParam.in_fav_list = true;
          }
        }
      );
    };

    $scope.back = function () {
      if ($scope.scopeParam.ma_paroisses) {
        $scope.backFromEditMainChurch();
      } else {
        $scope.backToFavList();
      }
    }

    $scope.hideKeyboardWhenEnter = function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }
    }

    $scope.onSubmitChurches = function (e) {
    }

    $scope.hasValue = hasValue;

    //Functions

    function initScope() {
      $scope.initialized = false;

      $scope.scopeParam.ma_paroisses = false;
      $scope.scopeParam.main_church_added = false;
      $scope.is_map = true;
      $scope.is_map_fav = true;
      $scope.scopeParam.in_fav_list = true;
      $scope.fav_churches = [];

      user_email = '';
      user_token = '';
      get_params = '';
    }

    function initOnEnterView() {
      setMainChurchFromServer();

      if (!$scope.initialized) {
        user_email = window.localStorage.getItem("user_email");
        user_token = window.localStorage.getItem("user_token");
        get_params = "user_token=" + user_token + "&user_email=" + user_email;

        $scope.callGetChurches();
      }
    }

    function assignMap() {
      NgMap.getMap().then(function (map) {
        $scope.map = map;

        if (hasValue($location.search().default_tab)) {
          centerMapDoubled();
        }

        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
      });
    }

    function initFavTab() {
      $scope.is_map_fav = true;
      $scope.scopeParam.in_fav_list = true;
      $scope.scopeParam.query_fav = '';
    }

    function initMaTab() {
      $scope.is_map = true;
      $scope.scopeParam.main_church_added = true;
      $scope.scopeParam.query = '';
    }

    function setMainChurchFromServer() {
      if ($scope.main_church_id !== window.localStorage.getItem("main_church_id")) {
        $scope.main_church_id = refineLocalStorageNumber(window.localStorage.getItem("main_church_id"));

        if (hasValue($scope.main_church_id)) {
          Helper.GetOneChurchFromServer($scope.main_church_id, function (data) {
            window.localStorage.setItem("main_church_address", data.address);
            window.localStorage.setItem("main_church_city", data.city);
            window.localStorage.setItem("main_church_name", data.name);
            window.localStorage.setItem("main_church_picto", data.picto);

            $scope.main_church = data;
            $scope.scopeParam.main_church_added = true;

          });
        } else {
          $scope.main_church = null;
          $scope.scopeParam.main_church_added = false;
        }
      }
    }

    function resizeMap() {
      window.setTimeout(function () {
        google.maps.event.trigger($scope.map, 'resize')
      }, 2000);
    }

    function setChurches(data) {
      $scope.all_churches = [];
      $scope.fav_churches = [];
      $scope.near_churches = data;
      var temp_all_churches = data;
      if ($scope.main_church_id == null) {
        $scope.scopeParam.main_church_added = false;
      }

      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          defaultLatLon.lat = temp_all_churches[i].latitude;
          defaultLatLon.lng = temp_all_churches[i].longitude;
        }

        if ($scope.main_church_id == temp_all_churches[i]['id']) {
          $scope.fav_churches.unshift(temp_all_churches[i]);
          $scope.all_churches.unshift(temp_all_churches[i]);
          $scope.main_church = temp_all_churches[i];
        } else {
          $scope.all_churches.push(temp_all_churches[i]);

          if (temp_all_churches[i].favorite) {
            $scope.fav_churches.push(temp_all_churches[i]);
          }
        }
      }
    }

    function sortFavChurches() {
      var temp = null;

      for (var i = 0, j = 0; i < $scope.fav_churches.length; i++) {
        if ($scope.main_church_id == $scope.fav_churches[i]['id']) {
          temp = $scope.fav_churches[i];
          $scope.fav_churches.splice(i, 1);
          $scope.fav_churches.unshift(temp);
          break;
        }
      }
    }

    function currentLocationSuccessCallback(position) {
      $scope.user_lat = defaultLatLon.lat; //position.coords.latitude; //
      $scope.user_long = defaultLatLon.lng; //position.coords.longitude; //
      var userLocation = $scope.user_lat + ', ' + $scope.user_long;
      console.log("You are found here: " + userLocation);
      $rootScope.showLoading("Veuillez patienter...");
      Helper.getNearChurches($scope.user_lat, $scope.user_long, function (data) {
        $rootScope.hideLoading();
        console.log("with location: " + data.length);
        if (data["error"] == "You need to sign in or sign up before continuing.") {
          console.log("Delete history and logout");
          Helper.clearCachedViews(function () {
            $location.path("/home");
          });
        }
        $scope.near_churches = data;
        if (data.length > 0) {
          $scope.has_near_churches = true;
        } else {
          $scope.has_near_churches = false;
          $scope.near_churches = [];
        }
      });
    }

    function currentLocationErrorCallback() {
      $rootScope.hideLoading();
      $scope.has_near_churches = false;
      $scope.no_near_church_msg = "Location could not be reached";
      console.log("Location could not be found");
    }

    function centerMap() {
      resizeMap();
      $scope.current_location(true);
    }

    function centerMapDoubled() {
      centerMap();
      window.setTimeout(function () {
        $scope.current_location(false)
      }, 3000);
    }
  })
