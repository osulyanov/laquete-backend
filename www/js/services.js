angular.module('starter.services', [])

  .factory('API', function($http, $q, $rootScope, $ionicLoading) {
  // Might use a resource here that returns a JSON array
  //var url = 'http://192.168.110.130:3000/api/v1/';
  var url = 'https://laquete.herokuapp.com/api/v1/';
  var url_local = 'http://localhost:3000/api/v1/';
  var url_base = 'http://laquete.herokuapp.com/';
  var w=$(window).width()/100;
  var h=$(window).height()/100;

  var churches = "before_get_request";

  $rootScope.showLoading = function(msg) {
    $ionicLoading.show({
      template: msg
    });
  };
  $rootScope.hideLoading = function(){
    $ionicLoading.hide();
  };
  // Open Inppbrower when click link(if not install inappbrowser plugin, will be open blank window)
  $rootScope.openUrl = function(url){
    console.log(url);
    if (window.cordova && window.cordova.InAppBrowser)
      var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes,hardwareback=yes,closebuttoncaption=Back');
    else
      var ref = window.open(url, '_blank', 'location=yes');
  };

  // var get_churches =  get(url + "/churches?",get_params);
  // get_churches.then(
  //   function (data){

  //     if(data)
  //     {
  //       console.log("All the churches: "+data);
  //       churches = data;
  //     }
  //     else
  //     {
  //       console.log("All the churches: "+"Failed");
  //     }
  //   }
  //   );

  return {
    currentPlatform: function() {
      return ionic.Platform.platform();
    },
    url: function() {
      return url;
    },
    url_base: function() {
      return url_base;
    },
    url_local: function () {
      return url_local;
    },
    vw: function ( val ) {
      return  w*val+'px';
    },
    token_params: function (  ) {
      var user_email = window.localStorage.getItem("user_email");
      var user_token = window.localStorage.getItem("user_token");
      var get_params = "user_token="+user_token+"&user_email="+user_email;

      return get_params;
    },
    vh: function ( val ) {
      return  h*val+'px';
    },
    login: function (endpoint, params){
      var deferred = $q.defer();
      $http({
        url: endpoint,
        method: "GET",
        headers: {
          'content-type':'application/json'
        },
        params: params
      }).
      success(function(data, status, headers, config) {
        console.log('success');
        console.dir(data);
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log('failed');
        deferred.resolve(data);
      });
      return deferred.promise;
    },
    get: function(endpoint, params) {
      console.log("inside get");
      var deferred = $q.defer();
      $http({
        url: endpoint,
        method: "GET",
        headers: {
          'content-type':'application/json'
        },
        params: params
      }).
      success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log('failed');
        console.log(status);

        deferred.resolve(data);
      });
      return deferred.promise;
    },
    wait_till_get: function(endpoint, params) {
      console.log("inside get");
      var deferred = $q.defer();
      $http({
        url: endpoint,
        async:false,
        method: "GET",
        headers: {
          'content-type':'application/json'
        },
        params: params
      }).
      success(function(data, status, headers, config) {
        console.log('success');
        console.dir(data);
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log('failed');
        deferred.resolve(data);
      });
      return deferred.promise;
    },
    post: function(endpoint, params) {
      console.log("inside post");
      var deferred = $q.defer();
      // console.log(params);
      $http({
        url: endpoint,
        method: "POST",
        headers: {
          'content-type':'application/json',
          'user_email':window.sessionStorage.user,
          'user_token':window.sessionStorage.token
        },
        data: params
      }).
      success(function(data, status, headers, config) {
        console.log('success');
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log('failed');
        console.dir(data);
        deferred.resolve(data);
      });
      return deferred.promise;
    },
    transaction: function(endpoint, params) {
      console.log("inside post");
      console.log(window.sessionStorage.user);
      var deferred = $q.defer();
      // console.log(params);
      $http({
        url: endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.s-money.v1+json",
          "Accept": "application/vnd.s-money.v1+json",
          "Authorization": "Bearer NTsxMjQ7a3VRNVRabnNEfg=="
        },
        data: params
      }).
      success(function(data, status, headers, config) {
        console.log('success');
        console.log(data);
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log("headers: "+headers);
        console.log('failed');
        console.dir(data);
        deferred.resolve(data);
      });
      return deferred.promise;
    },
    put: function(endpoint, params) {
      var deferred = $q.defer();
      $http({
        url: endpoint,
        method: "PUT",
        headers: {
          'content-type':'application/json',
          'user_token':window.sessionStorage.token
        },
        data: params
      }).
      success(function(data, status, headers, config) {
        console.log('success');
        //console.log(data);
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log('failed');
        console.dir(data);
        deferred.resolve(data);
      });
      return deferred.promise;
    },
    patch: function(endpoint, params) {
      var deferred = $q.defer();
      $http({
        url: endpoint,
        method: "PATCH",
        headers: {
          'content-type':'application/json'
        },
        data: params
      }).
      success(function(data, status, headers, config) {
        console.log('success');
        //console.log(data);
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log('failed');
        console.dir(data);
        deferred.resolve(data);
      });
      return deferred.promise;
    },
    del: function(endpoint, params) {
      var deferred = $q.defer();
      $http({
        url: endpoint,
        method: "DELETE",
        headers: {
          'content-type':'application/json'
        },
        data: params
      }).
      success(function(data, status, headers, config) {
        console.log('success');
        //console.log(data['data']);
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log('failed');
        //console.log(data);
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  };
});
