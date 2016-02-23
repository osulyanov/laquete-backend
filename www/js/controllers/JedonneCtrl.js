angular.module('starter.controllers')
.controller('JedonneCtrl', function ($scope, API, $ionicHistory, $rootScope, $location, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $ionicLoading, Helper) {

  $scope.selected_church_id = -1;
  $scope.donation_type = "quete";
  $scope.amount = 0;


  $scope.btn_donate_dis = true;

  $scope.money = {
    'one':false,
    'two':false,
    'five':false,
    'ten':false,
    'twenty':false
  }
  $scope.plus_selected = false;
  $scope.church_title = "Paroisse"
  var selected_church_id = -1;
  var church_first_index = -1;
  var church_second_index = -1;
  $scope.user_has_fav_churches = false;
  // two d array
  $scope.fav_churches = [];

  $rootScope.badgeCountHistory = 0;
  var diocese_first_index = -1;
  var diocese_second_index = -1;
  $scope.searched_churches = [];
  $scope.has_searched_churches = false;
  $scope.diocese_search = false;
  $scope.quete_donate = true;

  $scope.addChurch = function() {
    $location.path("/main/churches");
    if ($scope.fav_churches.length == 0) {
      $location.url("/main/churches?default_tab=true");
    } else {
      $location.url("/main/churches?default_tab=false");
    }
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
      $scope.plus_selected = ($scope.fav_churches.length == arg ? true:false);
    }

    $scope.swiper.on('slideChangeStart', function () {
      if ($scope.fav_churches.length != $scope.swiper.activeIndex) {
        $scope.choseChurch($scope.swiper.activeIndex);
      } else {
        $scope.selected_church_id = -1;
        $scope.plus_selected = true;
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
    $rootScope.showLoading("Chargement...");
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

    if ($scope.amount === 0) {
      $scope.btn_donate_dis = true;
      $scope.colorStyle = {"color" : "#916153"}
    } else {
      $scope.btn_donate_dis = false;
      $scope.colorStyle = {"color" : "#5ab43d"}

    }
  });

  $scope.one_time_donate = function () {
    console.log("church_id: " + $scope.selected_church_id);
    console.log("amount: " + $scope.amount);
    $rootScope.showLoading("Veuillez patienter...");
    if ($scope.donation_type == 'quete') {
      // if ($scope.selected_church_id != -1) {


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
              $location.path('payment');
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
      // Helper.OneTimeDonateDioce($scope.amount, $scope.selected_dioce_id, function (data) {
      Helper.OneTimeDonateDioce($scope.amount, $scope.selected_church_id, function (data) {
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
  // $scope.showPopup = function () {
  //   $scope.data = {};
  //   // An elaborate, custom popup
  //     var myPopup = $ionicPopup.show({
  //       template: '',
  //       cssClass: 'my-custom-popup-after-donation',
  //       title: '',
  //       subTitle: '',
  //       scope: $scope,


  //     });
  //   myPopup.then(function (res) {
  //     console.log('Tapped!', res);
  //     // $scope.selected_church_id = -1;
  //     $scope.amount = 0;
  //     $scope.btn_donate_dis = true;
  //   });
  //   $timeout(function () {
  //     myPopup.close(); //close the popup after 3 seconds for some reason
  //   }, 3000);
  // };


  // $.scope.showPopup = function(){
  //   $ionicHistory.nextViewOptions({
  //     disableBack: false
  //   });
  //   $location.path('/after_donation');
  // };




  $scope.showPopup = function () {
    $scope.data = {};
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '',
      cssClass: 'my-custom-popup-after-donation',
      title: '',
      subTitle: '',
      scope: $scope,
      buttons: [
        {
          text: '<b>&#9746</b>',
          type: 'button button-clear button-positive btn-primary btn-pop-Back',
          onTap: function (e) {
            myPopup.close();
          }
        }
      ]
    });
    myPopup.then(function (res) {
      console.log('Tapped!', res);
      // $scope.selected_church_id = -1;
      $scope.amount = 0;
      $scope.btn_donate_dis = true;
    });
    setTimeout( function() {
      $('.btn-getInfo-Ok').hide().show(0);
    }, 1000)
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
    $ionicPopup.alert({
      title: 'Don\'t eat that!',
      template: 'It might taste good'
    }).then(function (res) {
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
    $scope.colorStyle = {"color" : "#5ab43d"}
  };
  $scope.add2 = function () {

    $scope.makeBrownMoney('two');

    if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
      $scope.btn_donate_dis = false;
    }
    $scope.amount += 2;
    $("#amount").text($scope.amount);
    $scope.colorStyle = {"color" : "#5ab43d"}
    console.log("after adding 2: " + $scope.amount);
  };
  $scope.add5 = function () {
    $scope.makeBrownMoney('five');
    if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
      $scope.btn_donate_dis = false;
    }
    $scope.amount += 5;
    $("#amount").text($scope.amount);
    $scope.colorStyle = {"color" : "#5ab43d"}
  };
  $scope.add10 = function () {
    $scope.makeBrownMoney('ten');
    if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
      $scope.btn_donate_dis = false;
    }
    $scope.amount += 10;
    $("#amount").text($scope.amount);
    $scope.colorStyle = {"color" : "#5ab43d"}
  };
  $scope.add20 = function () {
    $scope.makeBrownMoney('twenty');
    if ($scope.amount == 0 && ($scope.selected_church_id != -1 || $scope.selected_dioce_id != -1)) {
      $scope.btn_donate_dis = false;
    }
    $scope.amount += 20;
    $("#amount").text($scope.amount);
    $scope.colorStyle = {"color" : "#5ab43d"}
  };
  $scope.zero = function () {
    if ($scope.amount != 0) {
      $scope.btn_donate_dis = true;
    }
    $scope.amount = 0;
    $("#amount").text($scope.amount);
    $scope.colorStyle = {"color" : "#916153"}
    console.log("after clicked 0: " + $scope.amount);
  };
  $scope.quete = function () {
    console.log("Img quete clicked");

    $scope.donation_type = "quete";
    $scope.quete_donate = true;
    $scope.church_title = "Paroisse";
    // $scope.churchStyle = {"color":"#5ab43d"};
  };
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
            if (String(data[i]['picto']).indexOf('.png') !== -1) {
              data[i]['picto']  = String(data[i]['picto']).substr(0, data[i]['picto'].length - 4);
            }
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
  $scope.devier = function () {
    $scope.donation_type = "devier";
    $scope.quete_donate = false;
    console.log("Img devier clicked");
    $scope.church_title = "Diocèse"
    $scope.typededonStyle = {"color":"#916153"};
  };

  $scope.addFavChurch = function () {
    console.log("addFavChurch");
    $location.path('/tab/churches');
  };
})
