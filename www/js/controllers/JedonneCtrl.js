angular.module('starter.controllers')
.controller('JedonneCtrl', function ($scope, API, $ionicHistory, $rootScope, $location, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $ionicLoading, Helper) {

  $scope.plus_selected = false;

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
  $scope.quete_donate = true;
  $scope.quete = function () {
    console.log("Img quete clicked");

    $scope.donation_type = "quete";
    $scope.quete_donate = true;
    $scope.church_title = "Paroisse";
    // $scope.churchStyle = {"color":"#5ab43d"};
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
    $scope.typededonStyle = {"color":"#916153"};
  };

  $scope.addFavChurch = function () {
    console.log("addFavChurch");
    $location.path('/tab/churches');
  };
})

  .controller('RecurSetupCtrl', function ($scope, API, $ionicHistory, $rootScope, $location, $ionicLoading, Helper) {
    $scope.platform = API.currentPlatform();
    $scope.modified = false;
    $scope.validated = false;
    $scope.rpayment_id = 0;
    $scope.to_dioce = $location.search().to_dioce;
    $scope.back = function () {
      $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.enter', function (e) {

      $scope.modified = false;
      $scope.validated = false;
      $scope.rpayment_id = 0;
      $scope.to_dioce = $location.search().to_dioce;

      $scope.donation = Helper.getSharedDonation();
      $scope.create_setup = false;
      if ($scope.donation == null) {
        $rootScope.showLoading("Chargement...");
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

        $scope.selected_church = {
          'name': $scope.donation.church_name,
          'id': $scope.donation.church_id,
          'favorite': true
        };
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
        "degree_name": "Non Degree Undergraduate"
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
      $rootScope.showLoading("Chargement...");
      console.log("amount: " + $scope.donation.amount + " church_id: " + $scope.donation.church_id + " frqu: " + $scope.donation.frequency)

      if ($scope.to_dioce) {
        $scope.donation.frequency = "monthly";

      } else {
        $scope.donation.frequency = "weekly";

      }

      var set_url = "";
      //if ($scope.modified == true && $scope.rpayment_id != 0) {
      //  set_url = API.url() + 'rpayments/validate_recurring?id=' + $scope.rpayment_id;
      //} else {
      if ($scope.create_setup == false) {
        set_url = API.url() + 'rpayments/recurring?amount=' + $scope.donation.amount + "&church_id=" + $scope.donation.church_id + "&frequency=" + $scope.donation.frequency + "&" + API.token_params() + "&id=" + $scope.donation.id;
      } else {
        set_url = API.url() + 'rpayments/recurring?amount=' + $scope.donation.amount + "&church_id=" + $scope.church.id + "&frequency=" + $scope.donation.frequency + "&" + API.token_params();
      }

      //}

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

            //if ($scope.modified == false) {
            //  $scope.modified = true;
            //  $scope.rpayment_id = data["id"];
            //
            //} else {
            //  $scope.validated = true;
            //}
            // $ionicHistory.goBack();

            $location.path('/main/donregular');
          } else {
            console.log('Inside error');
          }
        });
    };

    $scope.delete_rec = function () {
      $rootScope.showLoading("Chargement...");

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
            $location.path('/main/donregular');
            // $ionicHistory.goBack();
          } else {
            console.log('Inside error');
          }
        });
    };

  })