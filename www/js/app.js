// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function ($ionicPlatform, $rootScope, $ionicPopup, $timeout, $cordovaGeolocation) {
  $ionicPlatform.ready(function (API) {
    console.log('DEVICE READY*****');

    var body = document.getElementsByTagName("body")[0];
    body.id = "index";
    // $rootScope.callGetChurches();
    // console.log("Inside ready: "+body.id);

    // document.getElementById("myP").style.font = "italic bold 20px arial,serif";
    // var result = angular.element(element.getElementsByClassName("btn-laquete"));
    // var btn = document.getElementsByClassName("btn-laquete")[0];
    // console.log("Btn: "+btn+"result"+result.length);
    // btn.style.font = "12px";

    var w = $(window).width() / 100;
    var h = $(window).height() / 100;
    // console.log("W: "+w);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    $rootScope.currentLatLon = {lat: 0, lng: 0};
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $rootScope.currentLatLon.lat  = position.coords.latitude;
        $rootScope.currentLatLon.lng = position.coords.longitude;
        console.log(position);
      }, function(err) {
        console.log('Geolocation Error occurred. Error code: ' + err.code);
      });

    $rootScope.iosdevice = false;
    var checkiOS = function iOS() {

      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ];

      while (iDevices.length) {
        if (navigator.platform === iDevices.pop()){ $rootScope.iosdevice = true; return true; }
      }
      $rootScope.iosdevice = false;
      return false;
    };

    checkiOS();

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.show();
    }
    // if (window.StatusBar && checkiOS()) {
    //   // org.apache.cordova.statusbar required
    //   StatusBar.styleDefault();
    //   StatusBar.show();
    // }


    $rootScope.checkInternetConnection = function() {
      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.alert({
            title: "Internet Disconnected",
            template: "The Wi-Fi is disabled on your device."
          }).then(function(result) {
            ionic.Platform.exitApp();
          });

        }
      }

    };

    $rootScope.checkInternetConnection();

    //document.addEventListener("offline", onOffline, false);

    //function onOffline() {
    //  // Handle the offline event
    //  $ionicPopup.alert({
    //        title: "Internet Disconnected",
    //        content: "The internet is disconnected on your device."
    //      })
    //      .then(function (result) {
    //
    //        ionic.Platform.exitApp();
    //
    //      });
    //}

    // Working code for no internet connection
//    if (window.Connection) {
//      if (navigator.connection.type == Connection.NONE) {
//        $ionicPopup.alert({
//            title: "Internet Disconnected",
//            content: "The internet is disconnected on your device."
//          })
//          .then(function (result) {
//
//            ionic.Platform.exitApp();
//
//          });
//      }
//    }

  });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom'); // other values: top
  $ionicConfigProvider.navBar.alignTitle('center'); // align navbar title to center

//   $compileProvider.imgSrcSanitizationWhitelist('images/');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.churches', {
      url: '/churches',
      views: {
        'tab-churches': {
          templateUrl: 'templates/tab-churches.html',
          controller: 'ChurchesCtrl'
        }
      }
    })
    .state('tab.donregular', {
      url: '/donregular',
      views: {
        'tab-donregular': {
          templateUrl: 'templates/tab-donregular.html',
          controller: 'DonregularCtrl'
        }
      }
    })
    .state('tab.history', {
      url: '/history',
      views: {
        'tab-history': {
          templateUrl: 'templates/tab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })

  .state('tab.jedonne', {
      url: '/jedonne',
      views: {
        'tab-jedonne': {
          templateUrl: 'templates/tab-jedonne.html',
          controller: 'JedonneCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    })
    .state('payment', {
      url: '/payment',
      templateUrl: 'templates/payment.html',
      controller: 'PaymentCtrl'
    })
    .state('receipt', {
      url: '/receipt',
      templateUrl: 'templates/receipt.html',
      controller: 'ReceiptCtrl'
    })
    .state('notification', {
      url: '/notification',
      templateUrl: 'templates/notification.html',
      controller: 'NotifyCtrl'
    })
    .state('about_us', {
      url: '/about_us',
      templateUrl: 'templates/about_us.html',
      controller: 'AboutUsCtrl'
    })

  .state('maptest', {
    url: '/maptest',
    templateUrl: 'templates/maptest.html',
    controller: 'MaptestCtrl'

  })

  .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'templates/custom-tabs.html'
    })
    .state('main.jedonne', {
      url: '/jedonne',
      views: {
        'main-jedonne': {
          templateUrl: 'templates/jedonne.html',
          controller: 'JedonneCtrl'
        }
      }
    })
    .state('main.churches', {
      url: '/churches',
      views: {
        'main-churches': {
          templateUrl: 'templates/tab-churches.html',
          controller: 'ChurchesCtrl'
        }
      }
    })
    .state('main.donregular', {
      url: '/donregular',
      views: {
        'main-donregular': {
          templateUrl: 'templates/tab-donregular.html',
          controller: 'DonregularCtrl'
        }
      }
    })
    .state('main.history', {
      url: '/history',
      views: {
        'main-history': {
          templateUrl: 'templates/tab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })
    .state('main.account', {
      url: '/account',
      views: {
        'main-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('login', {
      url: '/login',

      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'

    })
    .state('forgot-password', {
      url: '/forgot-password',

      templateUrl: 'templates/forgot-password.html',
      controller: 'ForgotPasswordCtrl'

    })
    .state('setup', {
      url: '/setup',
      templateUrl: 'templates/donregular-setup.html',
      controller: 'RecurSetupCtrl'

    })
    .state('rlist', {
      url: '/rlist',

      templateUrl: 'templates/rlist.html',
      controller: 'LoginCtrl'

    })
    .state('signup', {
      url: '/signup',

      templateUrl: 'templates/signup.html',
      controller: 'SignupCtrl'

    })
    .state('signup-e2', {
      url: '/signup-e2',

      templateUrl: 'templates/signup-etape2.html',
      controller: 'SignupE2Ctrl'

    })
    .state('tutorials', {
      url: '/tutorials',

      templateUrl: 'templates/tutorials.html',
      controller: 'TutorialsCtrl'

    });

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/dash');
  $urlRouterProvider.otherwise('/home');

});
