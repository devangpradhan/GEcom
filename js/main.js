(function ($) {
	"use strict";

/*=============================================
	=    		 Preloader			      =
=============================================*/
function preloader() {
	$('#ctn-preloader').addClass('loaded');
	$("#loading").fadeOut(500);
	// Una vez haya terminado el preloader aparezca el scroll

	if ($('#ctn-preloader').hasClass('loaded')) {
		// Es para que una vez que se haya ido el preloader se elimine toda la seccion preloader
		$('#preloader').delay(900).queue(function () {
			$(this).remove();
		});
	}
}

$(window).on('load', function () {
	preloader();
	mainSliderActive();
	thirdSlider();
	h9Slider();
	wowAnimation();
});



/*=============================================
	=    		Mobile Menu			      =
=============================================*/
//SubMenu Dropdown Toggle
if ($('.menu-area li.menu-item-has-children ul').length) {
	$('.menu-area .navigation li.menu-item-has-children').append('<div class="dropdown-btn"><span class="fas fa-angle-down"></span></div>');

}

//Mobile Nav Hide Show
if ($('.mobile-menu').length) {

	//Dropdown Button
	$('.mobile-menu li.menu-item-has-children .dropdown-btn').on('click', function () {
		$(this).toggleClass('open');
		$(this).prev('ul').slideToggle(500);
	});
	//Menu Toggle Btn
	$('.mobile-nav-toggler').on('click', function () {
		$('body').addClass('mobile-menu-visible');
	});

	//Menu Toggle Btn
	$('.menu-backdrop, .mobile-menu .close-btn').on('click', function () {
		$('body').removeClass('mobile-menu-visible');
	});
}

//Dropdown Button
$('.side-header-nav li.menu-item-has-children a').on('click', function () {
	$(this).next('ul.submenu').slideToggle(500);
});


/*=============================================
	=            Custom Scroll            =
=============================================*/
$(window).on("load", function () {
	if ($(".navigation .scroll, .off-canvas-widget.scroll").length) {
		$(".navigation .scroll, .off-canvas-widget.scroll").mCustomScrollbar({
			mouseWheelPixels: 50,
			scrollInertia: 0,
		});
	}
});



/*=============================================
	=     Menu sticky & Scroll to top      =
=============================================*/
$(window).on('scroll', function () {
	var scroll = $(window).scrollTop();
	if (scroll < 245) {
		$("#sticky-header").removeClass("sticky-menu");
		$('.scroll-to-target').removeClass('open');

	} else {
		$("#sticky-header").addClass("sticky-menu");
		$('.scroll-to-target').addClass('open');
	}
});


/*=============================================
	=    		 Scroll Up  	         =
=============================================*/
if ($('.scroll-to-target').length) {
  $(".scroll-to-target").on('click', function () {
    var target = $(this).attr('data-target');
    // animate
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 1000);

  });
}


/*=============================================
	=    	   Toggle Active  	         =
=============================================*/
$('.cat-toggle').on('click', function () {
	$('.category-menu').slideToggle(500);
	return false;
});


/*=============================================
	=          Data Background               =
=============================================*/
$("[data-background]").each(function () {
	$(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
})


/*=============================================
	=          Header Search               =
=============================================*/
$('.header-search a').on('click', function () {
	$('.header-search a > .fa-search').toggleClass('fa-times');
});


/*=============================================
	=         Main Slider Active            =
=============================================*/

var slideWrapper = $(".main-slider"),
    iframes = slideWrapper.find('.embed-player'),
    lazyImages = slideWrapper.find('.slide-image'),
    lazyCounter = 0;

// POST commands to YouTube or Vimeo API
function postMessageToPlayer(player, command){
  if (player == null || command == null) return;
  player.contentWindow.postMessage(JSON.stringify(command), "*");
}

// When the slide is changing
function playPauseVideo(slick, control){
  var currentSlide, slideType, startTime, player, video;

  currentSlide = slick.find(".slick-current");
  slideType = currentSlide.attr("class").split(" ")[1];
  player = currentSlide.find("iframe").get(0);
  startTime = currentSlide.data("video-start");

  if (slideType === "vimeo") {
    switch (control) {
      case "play":
        if ((startTime != null && startTime > 0 ) && !currentSlide.hasClass('started')) {
          currentSlide.addClass('started');
          postMessageToPlayer(player, {
            "method": "setCurrentTime",
            "value" : startTime
          });
        }
        postMessageToPlayer(player, {
          "method": "play",
          "value" : 1
        });
        break;
      case "pause":
        postMessageToPlayer(player, {
          "method": "pause",
          "value": 1
        });
        break;
    }
  } else if (slideType === "youtube") {
    switch (control) {
      case "play":
        postMessageToPlayer(player, {
          "event": "command",
          "func": "mute"
        });
        postMessageToPlayer(player, {
          "event": "command",
          "func": "playVideo"
        });
        break;
      case "pause":
        postMessageToPlayer(player, {
          "event": "command",
          "func": "pauseVideo"
        });
        break;
    }
  } else if (slideType === "video") {
    video = currentSlide.children("video").get(0);
    if (video != null) {
      if (control === "play"){
        video.play();
      } else {
        video.pause();
      }
    }
  }
}

// Resize player
function resizePlayer(iframes, ratio) {
  if (!iframes[0]) return;
  var win = $(".main-slider"),
      width = win.width(),
      playerWidth,
      height = win.height(),
      playerHeight,
      ratio = ratio || 16/9;

  iframes.each(function(){
    var current = $(this);
    if (width / ratio < height) {
      playerWidth = Math.ceil(height * ratio);
      current.width(playerWidth).height(height).css({
        left: (width - playerWidth) / 2,
         top: 0
        });
    } else {
      playerHeight = Math.ceil(width / ratio);
      current.width(width).height(playerHeight).css({
        left: 0,
        top: (height - playerHeight) / 2
      });
    }
  });
}

// DOM Ready
$(function() {
  // Initialize
  slideWrapper.on("init", function(slick){
    slick = $(slick.currentTarget);
    setTimeout(function(){
      playPauseVideo(slick,"play");
    }, 1000);
    resizePlayer(iframes, 16/9);
  });
  slideWrapper.on("beforeChange", function(event, slick) {
    slick = $(slick.$slider);
    playPauseVideo(slick,"pause");
  });
  slideWrapper.on("afterChange", function(event, slick) {
    slick = $(slick.$slider);
    playPauseVideo(slick,"play");
  });
  slideWrapper.on("lazyLoaded", function(event, slick, image, imageSource) {
    lazyCounter++;
    if (lazyCounter === lazyImages.length){
      lazyImages.addClass('show');
      slideWrapper.slick("slickPlay");
    }
  });

  //start the slider
  slideWrapper.slick({
    fade:true,
    autoplaySpeed:5000,
    lazyLoad:"progressive",
    speed:600,
    arrows:false,
    dots:true,
    cssEase:"cubic-bezier(0.87, 0.03, 0.41, 0.9)"
  });
});


/*=============================================
	=        Third Slider Active		      =
=============================================*/
function thirdSlider() {
	$('.third-slider-active, .h7-slider-active').slick({
		autoplay: false,
		autoplaySpeed: 10000,
		dots: false,
		fade: true,
		arrows: false,
		responsive: [
			{ breakpoint: 767, settings: { dots: false, arrows: false } }
		]
	})
	.slickAnimation();
}


/*=============================================
	=        Third Slider Active		      =
=============================================*/
function h9Slider() {
	$('.h9-slider-active').slick({
		autoplay: false,
		autoplaySpeed: 10000,
		dots: false,
		fade: true,
		arrows: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
		responsive: [
			{ breakpoint: 1200, settings: { dots: false, arrows: false } }
		]
	})
	.slickAnimation();
}


/*=============================================
	=        Third Slider Active		      =
=============================================*/
$('.shoes-banner-active').slick({
	autoplay: false,
	autoplaySpeed: 10000,
	dots: true,
	arrows: false,
	responsive: [
		{ breakpoint: 767, settings: { dots: false, arrows: false } }
	]
})


/*=============================================
=           Features - Active                 =
=============================================*/
$('.ex-services-item').hover(function () {
	$(this).find('.content p').slideToggle(300);
	return false;
});


/*=============================================
	=    		Brand Active		      =
=============================================*/
$('.brand-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplay: true,
	autoplaySpeed: 3000,
	arrows: false,
	slidesToShow: 5,
	slidesToScroll: 2,
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=            Instagram Active          =
=============================================*/
$('.insta-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplay: true,
	autoplaySpeed: 4000,
	arrows: false,
	slidesToShow: 5,
	slidesToScroll: 2,
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 5,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=        Related Product Active          =
=============================================*/
$('.related-product-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplay: true,
	autoplaySpeed: 4000,
	arrows: false,
	slidesToShow: 4,
	slidesToScroll: 2,
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=        Features Product Active        =
=============================================*/
$('.features-product-active').slick({
	dots: true,
	infinite: true,
	speed: 1000,
	autoplaySpeed: 2000,
	autoplay: true,
	arrows: false,
	slidesToShow: 5,
	slidesToScroll: 2,
	responsive: [
		{
			breakpoint: 1500,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	$('.features-product-active, .trending-product-active').slick('setPosition');
})

/*=============================================
	=        Trending Product Active        =
=============================================*/
$('.trending-product-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplaySpeed: 5000,
	autoplay: false,
	arrows: false,
	slidesToShow: 3,
	slidesToScroll: 3,
	responsive: [
		{
			breakpoint: 1500,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});

/*=============================================
	=        Best Selling Active        =
=============================================*/
$('.best-selling-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplaySpeed: 5000,
	autoplay: false,
	arrows: false,
	slidesToShow: 5,
	slidesToScroll: 1,
	responsive: [
		{
			breakpoint: 1500,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=        Trending Product Active        =
=============================================*/
$('.slider-two-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplaySpeed: 5000,
	autoplay: false,
	arrows: true,
	prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>',
	nextArrow: '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
	slidesToShow: 3,
	slidesToScroll: 1,
	responsive: [
		{
			breakpoint: 1500,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				arrows: false,
				infinite: true,
			}
		},
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				infinite: true,
				arrows: false,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=       Product Tooltip Active        =
=============================================*/
const slider = $(".split-slider-active");
slider.slick({
		dots: true,
		infinite: false,
		arrows: false,
		speed: 1300,
		vertical: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		responsive: [
			{ breakpoint: 1200, settings: { dots: false, arrows: false } },
			{ breakpoint: 767, vertical: false, settings: { dots: false, arrows: false }},
		]
	})
	.slickAnimation();

slider.on('wheel', (function (e) {
	e.preventDefault();

	if (e.originalEvent.deltaY < 0) {
		$(this).slick('slickPrev');
	} else {
		$(this).slick('slickNext');
	}
}));


/*=============================================
	=       Product Tooltip Active        =
=============================================*/
$(".tooltip-btn").click(function () {
	$(".product-tooltip-item").removeClass("active"),
		$(this).next().addClass("active"),
		$(this).parents(".slider-two-item").addClass("active")
});
$(".product-tooltip-item .close-btn").click(function () {
	$(this).parent().removeClass("active")
});


/*=============================================
	=           DatePicker Active             =
=============================================*/
$(function () {
	$(".form-grp .date").datepicker({
		autoclose: true,
		todayHighlight: true
	}).datepicker('update', new Date());
});


/*=============================================
	=    		Magnific Popup		      =
=============================================*/
$('.popup-image').magnificPopup({
	type: 'image',
	gallery: {
		enabled: true
	}
});

/* magnificPopup video view */
$('.popup-video').magnificPopup({
	type: 'iframe'
});


/*=============================================
	=    	 Slider Range Active  	         =
=============================================*/
$("#slider-range").slider({
	range: true,
	min: 40,
	max: 700,
	values: [120, 570],
	slide: function (event, ui) {
		$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
	}
});
$("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));


/*=============================================
	=    		 Cart Active  	         =
=============================================*/
// OLD
$('.qtybutton-box span').click(function () {
	var $input = $(this).parents('.num-block').find('input.in-num');
	if ($(this).hasClass('minus')) {
		var count = parseFloat($input.val()) - 1;
		count = count < 1 ? 1 : count;
		if (count < 2) {
			$(this).addClass('dis');
		}
		else {
			$(this).removeClass('dis');
		}
		$input.val(count);
	}
	else {
		var count = parseFloat($input.val()) + 1
		$input.val(count);
		if (count > 1) {
			$(this).parents('.num-block').find(('.minus')).removeClass('dis');
		}
	}

	$input.change();
	return false;
});

// NEW Not working

$('.ProductForm_QuantitySelector span').click(function () {
	var $input = $(this).parents('.QuantitySelector').find('input.QuantitySelector_CurrentQuantity');
	if ($(this).hasClass('minus')) {
		var count = parseFloat($input.val()) - 1;
		count = count < 1 ? 1 : count;
		if (count < 2) {
			$(this).addClass('dis');
		}
		else {
			$(this).removeClass('dis');
		}
		$input.val(count);
	}
	else {
		var count = parseFloat($input.val()) + 1
		$input.val(count);
		if (count > 1) {
			$(this).parents('.QuantitySelector').find(('.minus')).removeClass('dis');
		}
	}

	$input.change();
	return false;
});


/*=============================================
	=    		 Wishlist Active  	         =
=============================================*/
$(".wish-plus-minus").append('<div class="dec qtybutton">-</div><div class="inc qtybutton">+</div>');
$(".qtybutton").on("click", function () {
	var $button = $(this);
	var oldValue = $button.parent().find("input").val();
	if ($button.text() == "+") {
		var newVal = parseFloat(oldValue) + 1;
	} else {
		// Don't allow decrementing below zero
		if (oldValue > 0) {
			var newVal = parseFloat(oldValue) - 1;
		} else {
			newVal = 0;
		}
	}
	$button.parent().find("input").val(newVal);
});

$('.qtybutton-box span').click(function () {
	var $input = $(this).parents('.num-block').find('input.in-num');
	if ($(this).hasClass('minus')) {
		var count = parseFloat($input.val()) - 1;
		count = count < 1 ? 1 : count;
		if (count < 2) {
			$(this).addClass('dis');
		}
		else {
			$(this).removeClass('dis');
		}
		$input.val(count);
	}
	else {
		var count = parseFloat($input.val()) + 1
		$input.val(count);
		if (count > 1) {
			$(this).parents('.num-block').find(('.minus')).removeClass('dis');
		}
	}

	$input.change();
	return false;
});


/*=============================================
	=    		Isotope	Active  	      =
=============================================*/
$('.new-arrival-active, .cosmetics-product-active').imagesLoaded(function () {
	// init Isotope
	var $grid = $('.new-arrival-active, .cosmetics-product-active').isotope({
		itemSelector: '.grid-item',
		percentPosition: true,
		masonry: {
			columnWidth: '.grid-sizer',
		}
	});
	// filter items on button click
	$('.new-arrival-nav').on('click', 'button', function () {
		var filterValue = $(this).attr('data-filter');
		$grid.isotope({ filter: filterValue });
	});

});
//for menu active class
$('.new-arrival-nav button').on('click', function (event) {
	$(this).siblings('.active').removeClass('active');
	$(this).addClass('active');
	event.preventDefault();
});


/*=============================================
	=    	  Countdown Active  	         =
=============================================*/
$('[data-countdown]').each(function () {
	var $this = $(this), finalDate = $(this).data('countdown');
	$this.countdown(finalDate, function (event) {
		$this.html(event.strftime('<div class="time-count day"><span>%D</span>Days</div><div class="time-count hour"><span>%H</span>Hours</div><div class="time-count min"><span>%M</span>Min</div><div class="time-count sec"><span>%S</span>Sec</div>'));
	});
});


/*=============================================
	=    		 Jarallax Active  	         =
=============================================*/
$('.jarallax').jarallax({
	speed: 0.2,
});


/*=============================================
	=    		 Wow Active  	         =
=============================================*/
function wowAnimation() {
	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		offset: 0,
		mobile: false,
		live: true
	});
	wow.init();
}

})(jQuery);


/*=============================================
	=    		 Js product single slider	         =
=============================================*/

$('.js-click-product').slick({
	slidesToShow: 5,
	slidesToScroll: 1,
	asNavFor: '.js-product-slider',
	dots: false,
	focusOnSelect: true,
	infinite: true,
	arrows: false,
	vertical: true,
	responsive: [

		{
			breakpoint: 1367,
			settings: {
				vertical: false
			}
		}
	]
});
$('.js-product-slider').slick({
	vertical: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	asNavFor: '.js-click-product'
});


/*=============================================
=        Searchbar     =
=============================================*/

$(document).ready(function(){
	var submitIcon = $('.searchbar-icon');
	var inputBox = $('.searchbar-input');
	var searchbar = $('.searchbar');
	var isOpen = false;
	submitIcon.click(function(){
		if(isOpen == false){
			searchbar.addClass('searchbar-open');
			inputBox.focus();
			isOpen = true;
		} else {
			searchbar.removeClass('searchbar-open');
			inputBox.focusout();
			isOpen = false;
		}
	});  
	 submitIcon.mouseup(function(){
			return false;
		});
	searchbar.mouseup(function(){
			return false;
		});
	$(document).mouseup(function(){
			if(isOpen == true){
				$('.searchbar-icon').css('display','block');
				submitIcon.click();
			}
		});
});
	function buttonUp(){
		var inputVal = $('.searchbar-input').val();
		inputVal = $.trim(inputVal).length;
		if( inputVal !== 0){
			$('.searchbar-icon').css('display','none');
		} else {
			$('.searchbar-input').val('');
			$('.searchbar-icon').css('display','block');
		}
	}



/*=============================================
	=    		 Image zoom 	         =
=============================================*/
// $(document).ready(function(){
//     $('#zm1').zoom();
//     $('#zm2').zoom();
//     $('#zm3').zoom();
//     $('#zm4').zoom();
//     $('#zm5').zoom();
// });

/*=============================================
  =          Login Page Animation         =
=============================================*/

// const loginText = document.querySelector(".title-text .login");
// const loginForm = document.querySelector("form.login");
// const loginBtn = document.querySelector("label.login");
// const signupBtn = document.querySelector("label.signup");
// const signupLink = document.querySelector("form .signup-link a");
// signupBtn.onclick = (()=>{
//   loginForm.style.marginLeft = "-50%";
//   loginText.style.marginLeft = "-50%";
// });
// loginBtn.onclick = (()=>{
//   loginForm.style.marginLeft = "0%";
//   loginText.style.marginLeft = "0%";
// });
// signupLink.onclick = (()=>{
//   signupBtn.click();
//   return false;
// });

/*=============================================
=        Toggle Show/Hide Password         =
=============================================*/

// const togglePassword = document.querySelector('#togglePassword');
// const password = document.querySelector('#id_password');

// togglePassword.addEventListener('click', function (e) {
// 	// toggle the type attribute
// 	const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
// 	password.setAttribute('type', type);
// 	// toggle the eye slash icon
// 	this.classList.toggle('fa-eye-slash');
// });

/*=============================================*/