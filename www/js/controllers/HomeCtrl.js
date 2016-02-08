angular.module('starter.controllers')
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

  $scope.$on('$ionicView.enter', function (e) {
    setTimeout( function() {
      $scope.login();
    }, 3000);
  });
})
  .controller('testCtrl', function ($scope, $location) {
    $scope.$on('$ionicView.enter', function (e) {
      console.log("Inside testCtrl");
    });
  })
