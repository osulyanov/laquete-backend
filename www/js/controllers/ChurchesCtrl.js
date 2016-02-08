angular.module('starter.controllers')
  .controller('ChurchesCtrl', function ($scope, $ionicHistory, $rootScope, API, $q, $http, $compile, Helper, $location, NgMap, $ionicLoading) {
    $scope.initialized = false;
    $scope.ma_paroisses = false;

    $scope.user_lat = -1;
    $scope.user_long = -1;
    $scope.main_church_added = false;
    $scope.main_church = {};
    $scope.main_church_id = window.localStorage.getItem("main_church_id");
    if (hasValue($scope.main_church_id)) {
      $scope.main_church_added = true;
    }

    $scope.nearChurches = [];
    $scope.has_near_churches = false;
    $scope.no_near_church_msg = "Pas d'église à proximité";
    $scope.fav_churches = [];

    $scope.searchParam = {query: '', query_fav: ''};

    var user_email = '';
    var user_token = '';
    var get_params = '';
    var defaultLatLon = {lat: 48.5149019, lng: 1.8341628};

    /* Map code starts here */
    navigator.geolocation.getCurrentPosition(currentLocationSuccessCallback, currentLocationErrorCallback, {
      timeout: 10000
    });

    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $scope.$on('$ionicView.enter', function (e) {
      $scope.is_map_fav = true;
      $scope.is_map = true;

      if ($location.search().default_tab == "false") {
        $scope.in_fav_list = false;
        $scope.ma_paroisses = false;
        resizeMap();
      } else if ($location.search().default_tab == "true") {
        $scope.main_church_added = false;
        $scope.ma_paroisses = true;
        resizeMap();
      } else {
        $scope.in_fav_list = true;
        $scope.ma_paroisses = false;
        $scope.main_church_added = true;
      }

      setMap();
      initOnEnterView();
    });

    $scope.$on('laquete.logout', function(e) {
      $scope.main_church_added = false;
      initScope();
    });

    $scope.current_location= function(){
      $scope.positions = [];

      $ionicLoading.show({
        template: 'Loading...'
      });

      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //$scope.positions.push({lat: pos.k,lng: pos.B});
        $scope.positions.push({lat: pos.lat(),lng: pos.lng()});
        console.log(pos);

        var map = $scope.map;
        map.setCenter(pos);

        var GeoMarker = new GeolocationMarker();
        GeoMarker.setCircleOptions({fillColor: '#808080'});

        //google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
        //  map.setCenter(this.getPosition());
        //  map.fitBounds(this.getBounds());
        //});

        google.maps.event.addListener(GeoMarker, 'geolocation_error', function(e) {
          console.log('There was an error obtaining your position. Message: ' + e.message);
        });

        GeoMarker.setMap(map);

        $ionicLoading.hide();
      });

    };

    $scope.hide_keyboard = function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }

      $scope.is_map = true;
      $scope.searchParam.query = "";
      document.getElementById('query_id').value = '';
      document.getElementById('query_id').blur();
      document.getElementById('tab-churches').focus();
      $('#query-cancel').addClass('ng-hide');
      resizeMap();

    };

    $scope.hide_keyboard_fav = function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }

      $scope.is_map_fav = true;
      $scope.searchParam.query_fav = "";
      document.getElementById('query_fav_id').value = '';
      document.getElementById('query_fav_id').blur();
      document.getElementById('tab-fav-churches').focus();
      $('#query-fav-cancel').addClass('ng-hide');
      resizeMap();
    };

    $scope.markerShowInfoWindow = function (event, index) {
      $scope.selected_church_marker = $scope.all_churches[index];
      $scope.selected_church_index_marker = index;

      $scope.map.showInfoWindow('info-window-church', 'marker' + index);

      $scope.test = function (index) {
        $scope.map.hideInfoWindow('info-window-church');
        $scope.makeFavorite($scope.all_churches[index]);
        console.log("Inside test");
      };

      $scope.main = function (index) {
        $scope.map.hideInfoWindow('info-window-church');
        $scope.addMainChurch($scope.all_churches[index]);
        console.log("Inside test");
      };
    };

    $scope.ma_paroisse = function () {
      console.log("ma_paroisse");
      initMaTab();
      $scope.ma_paroisses = true;
      resizeMap();
    };

    $scope.autres_paroisses = function () {
      console.log("autres_paroisses");
      initFavTab();
      $scope.ma_paroisses = false;
      //NOTE:		manually refresh the google maps
      resizeMap();
    };

    $scope.edit_main_church = function () {
      $scope.main_church_added = false;
      $scope.is_map = true;
      $scope.searchParam.query = '';
      resizeMap();
    };

    $scope.back_from_edit_main_church = function () {
      $scope.main_church_added = true;
    };

    $scope.callGetChurches = function () {
      Helper.GetAllChurchesFromServer(function (data) {
        setChurches(data);
        $scope.initialized = true;
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

    $scope.backToFavList = function() {
      $scope.in_fav_list = true;
    };

    $scope.goToChooseFav = function() {
      $scope.in_fav_list = false;
      $scope.is_map_fav = true;
      $scope.searchParam.query_fav = '';
      resizeMap();
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
            //sortFavChurches();
            setChurches($scope.all_churches);
            $scope.main_church_added = true;
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
                data[i]['picto']  = String(data[i]['picto']).substr(0, data[i]['picto'].length - 4);
              }
              data[i]['picto_hover'] = "images/" + data[i]['picto'] + "-hover.png";
              data[i]['picto'] = "images/" + data[i]['picto'] + ".png";
            }
            // $location.path('/postsearch');
            setChurches(data);
            $scope.in_fav_list = true;
          } else {

          }
        }
      );
    };

    //Functions

    function initScope() {
      $scope.initialized = false;

      $scope.ma_paroisses = false;
      $scope.main_church_added = false;
      $scope.is_map = true;
      $scope.is_map_fav = true;
      $scope.in_fav_list = true;
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

    function setMap() {
      NgMap.getMap().then(function(map) {
        $scope.map = map;
        if (!$scope.initialized) {
          initMap();
        }
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
      });
    }

    function initFavTab() {
      $scope.is_map_fav = true;
      $scope.in_fav_list = true;
      $scope.searchParam.query_fav = '';
    }

    function initMaTab() {
      $scope.is_map = true;
      $scope.main_church_added = true;
      $scope.searchParam.query = '';
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
            $scope.main_church_added = true;

          });
        } else {
          $scope.main_church = null;
          $scope.main_church_added = false;
        }
      }
    }

    function resizeMap() {
      window.setTimeout(function(){google.maps.event.trigger($scope.map, 'resize')},2000);
    }

    function setChurches(data) {
      $scope.all_churches = [];
      $scope.fav_churches = [];
      var temp_all_churches = data;
      console.log("before priniting data");
      console.log(data);
      console.log(" main_church_id: " + $scope.main_church_id);
      if ($scope.main_church_id == null) {
        console.log("if $scope.main_church_id: " + $scope.main_church_id);
        $scope.main_church_added = false;
      }
      for (var i = 0, j = 0; i < data.length; i++) {
        if ($scope.main_church_id == temp_all_churches[i]['id']) {
          $scope.fav_churches.unshift(temp_all_churches[i]);
          $scope.all_churches.unshift(temp_all_churches[i]);
          $scope.main_church = temp_all_churches[i];
          console.log("loop $scope.main_church_id: " + $scope.main_church_id);
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
        $scope.nearChurches = data;
        if (data.length > 0) {
          $scope.has_near_churches = true;
        } else {
          $scope.has_near_churches = false;
          $scope.nearChurches = [];
        }
      });
    }

    function currentLocationErrorCallback() {
      $rootScope.hideLoading();
      $scope.has_near_churches = false;
      $scope.no_near_church_msg = "Location could not be reached";
      console.log("Location could not be found");
    }

    function initMap() {
      $scope.map.setCenter(defaultLatLon);
      resizeMap();
    }

    //window.addEventListener('native.keyboardshow', keyboardShowHandler);
    //
    //function keyboardShowHandler(e){
    //  if ((!$scope.ma_paroisses && $scope.is_map_fav) || ($scope.ma_paroisses && $scope.is_map)) {
    //    cordova.plugins.Keyboard.close();
    //  }
    //}
    //
    //window.addEventListener('keyboardWillShow', function () {
    //  // Describe your logic which will be run each time when keyboard is about to be shown.
    //  if ($scope.is_map_fav) {
    //    cordova.plugins.Keyboard.close();
    //  }
    //});
  })
