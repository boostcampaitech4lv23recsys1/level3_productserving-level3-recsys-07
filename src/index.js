import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';
import { TimelineMax, TweenMax, Power2, Expo, Elastic } from "gsap/all";
import $ from "jquery";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(sendToVercelAnalytics);


// ===== Open Nav =====
$( ".burger-wrapper" ).click(function() {
	
	// ===== If Nav is not open	
	if($('.nav').css("display") === "none"){
		TweenMax.to(".dim", 0.5, {opacity: 1, display: 'block', ease: Power2.easeInOut});
		TweenMax.fromTo(".nav", 0.5, {xPercent: -100}, 
									{xPercent: 0, display: 'block', ease: Expo.easeOut});
		TweenMax.staggerFrom('.nav li', 0.5, {opacity:0, y: 20, ease: Power2.easeInOut}, 0.1);
		
		// TweenMax.to(".logo-text", 0.5, {xPercent: -200, ease: Expo.easeIn});
		// $('.logo-text').css({'opacity': '0', 'display': 'none'});
}
	// ===== If Nav is open	and in Curation page
	else if($('.nav').css("display") === "block" && $('#curator').css("display") === "block"){
		TweenMax.to(".dim", 0.5, {opacity: 0, display: 'none', ease: Power2.easeInOut});
		TweenMax.to(".nav", 0.5, {xPercent: -100, display:'none', ease: Expo.easeOut});
		// $('.logo-text').css({'opacity': '1', 'display': 'block'});
}
	
	else {
		TweenMax.to(".dim", 0.5, {opacity: 0, display: 'none', ease: Power2.easeInOut});
		TweenMax.to(".nav", 0.5, {xPercent: -100, display:'none', ease: Expo.easeOut});
		// $('.logo-text').css({'opacity': '1', 'display': 'block'});
		// TweenMax.to(".logo-text", 0.5, {x: 250, ease: Expo.easeOut});
	}

});


// ===== Open Player + dim on =====
$( ".btn-open-player, .track_info" ).click(function() {
	TweenMax.to(".dim", 0.5, {opacity: 1, display: 'block', ease: Power2.easeInOut});
	TweenMax.fromTo("#player", 0.5, {xPercent: 100}, 
									{xPercent: 0, display: 'block', ease: Expo.easeOut});
	TweenMax.to(".mini-player", 0.5, {x: 50, ease: Expo.easeOut});
});

$('.dim').click(function() {
	TweenMax.to(".dim", 0.5, {opacity: 0, display: 'none', ease: Power2.easeInOut});
	TweenMax.to("#player", 0.5, {xPercent: 100, display: 'none', ease: Expo.easeOut});
	TweenMax.to(".nav", 0.5, {xPercent: -100, display: 'none', ease: Power2.easeInOut})
	TweenMax.to(".mini-player", 0.5, {x: 0, ease: Expo.easeOut});
	// $('.logo-text').css({'opacity': '1', 'display': 'block'});
	// TweenMax.to(".logo-text", 0.5, {x: 250, ease: Expo.easeOut});

});

// ===== Mini Player - Play/Pause Switch =====

$('.btn-play').click(function(){
	TweenMax.to($('.btn-play'), 0.2, {x: 20, opacity: 0, scale: 0.3,  display: 'none', ease: Power2.easeInOut});
	TweenMax.fromTo($('.btn-pause'), 0.2, {x: -20, opacity: 0, scale: 0.3, display: 'none'},
								{x: 0, opacity: 1, scale: 1, display: 'block', ease: Power2.easeInOut});
});

$('.btn-pause').click(function(){
	TweenMax.to($('.btn-pause'), 0.2, {x: 20, opacity: 0, display: 'none', scale: 0.3, ease: Power2.easeInOut});
	TweenMax.fromTo($('.btn-play'), 0.2, {x: -20, opacity: 0, scale: 0.3, display: 'none'},
								{x: 0, opacity: 1, display: 'block', scale: 1, ease: Power2.easeInOut});
});

// ===== HoverIn/HoverOut Flash Effect =====

$('.track_info').hover(function(){
	
	TweenMax.fromTo($(this), 0.5, {opacity: 0.5, ease: Power2.easeInOut},
								{opacity: 1})},
	function(){
		$(this).css("opacity", "1");
});

$('.burger-wrapper, .logo-text, .back_btn').hover(function(){
	
	TweenMax.fromTo($(this), 0.5, {opacity: 0.5, ease: Power2.easeInOut},
								{opacity: 1})},
	function(){
		$(this).css("opacity", "1")
});

$('.btn-open-player').hover(function(){
	
	TweenMax.fromTo($(this), 0.5, {opacity: 0.5, ease: Power2.easeInOut},
								{opacity: 1})},
	function(){
		$(this).css("opacity", "1")
});

$('.nav a').hover(function(){
	
	TweenMax.fromTo($(this), 0.5, {opacity: 0.5, ease: Power2.easeInOut},
								{opacity: 1})},
	function(){
		$(this).css("opacity", "1")
});

// ===== Player - List Items =====
$('.list_item').click(function() {
	$('.list_item').removeClass('selected');
	$(this).addClass('selected');
});


// ===== Main Play Button - Hover =====
	
$('.text-wrap .text').hover(function(){
	TweenMax.to($('.main-btn_wrapper'), 0.5, {opacity: 1, display: 'block', position: 'absolute', scale: 1, ease: Elastic.easeOut.config(1, 0.75)});
	TweenMax.to($('.line'), 0.5, {css: { scaleY: 0.6, transformOrigin: "center center" }, ease: Expo.easeOut})},
								
	function(){
		TweenMax.to($('.main-btn_wrapper'), 0.5, {opacity: 0, display: 'none', scale: 0, ease: Elastic.easeOut.config(1, 0.75)});
		TweenMax.to($('.line'), 0.5, {css: { scaleY: 1, transformOrigin: "center center" }, ease: Expo.easeOut})
});


// ===== Curation Page  =====
// ===== List  =====
$('.item').hover(function(){
	TweenMax.to($(this), 0.5, {y: -30, ease: Power2.easeInOut});
	$(this).children('.thumb').addClass('shadow');
	$(this).children('.connect_btn').addClass('shadow');
		
	TweenMax.to($(this).children('.info'), 0.5, {opacity: 1, ease: Power2.easeInOut})
	},
								
	function(){
		TweenMax.to($(this), 0.5, {y: 0, ease: Power2.easeInOut});
		$(this).children('.thumb').removeClass('shadow');
		$(this).children('.connect_btn').removeClass('shadow');
			
		TweenMax.to($(this).children('.info'), 0.5, {opacity: 0, ease: Power2.easeInOut});
});


// ===== Home Page to Curation Page Transition  =====
// ===== Main Play Button Activate =====

$('.text-wrap .text').click(function(){
	
	var homeToMain = new TimelineMax({});
	
	// Hide
	// $('.logo-text').css('display', 'none');
	homeToMain.to($('.line, .text-wrap'), 0.5, {display: 'none', opacity: 0, y: -20, ease: Power2.easeInOut}, 0);
	
	// Background down
	homeToMain.to($('.wave-container'), 1, {yPercent: 30, ease: Power2.easeInOut}, 0);
		
	// Show
	$('#curator').css('display', 'block');
	homeToMain.fromTo($('.back_btn'), 0.8, {x: 15},
										{display: 'flex', opacity: 1, x: 0, ease: Power2.easeInOut}, 1);
		
	homeToMain.fromTo($('.curator_title_wrapper'), 0.8, {opacity: 0, x: 30},
										{opacity: 1, x: 0, ease: Power2.easeInOut}, 1);
		
	homeToMain.fromTo($('.curator_list'), 0.8, {opacity: 0, display: 'none', x: 30},
									{opacity: 1, x: 0, display: 'block', ease: Power2.easeInOut}, 1.2);
	
});


// ===== Curation Page to Playlist Page Transition  =====
// ===== Item Activate =====
$('.item').click(function(){
	var mainToPlaylist = new TimelineMax({});
	
	// Hide
	mainToPlaylist.to($('#curator'), 0.8, {display: 'none', opacity: 0, scale: 1.1, ease: Power2.easeInOut}, 0);
			
	mainToPlaylist.fromTo($('.curator_list'), 0.5, {opacity: 1, display: 'block', x: 0},
										{opacity: 0, x: 30, display: 'none', ease: Power2.easeInOut}, 0.5);

	//playList										
	mainToPlaylist.fromTo($('.curator_playlist'), 0.8, {opacity: 0, display: 'none', x: 30},
										{opacity: 1, x: 0, display: 'block', ease: Power2.easeInOut}, 1.2);


	mainToPlaylist.fromTo($('.playlist_cls'), 0.8, {x: 15},
										{display: 'flex', opacity: 1, x: 0, ease: Power2.easeInOut}, 1);
	
});

// ===== Back Button Activate =====

$('.back_btn').click(function(){
// ===== From Playlist(3) to Main(2)
	if($('.curator_playlist').css("display") !== "none"){
		var playlistToMain = new TimelineMax({});
	
		// hide playlist
		playlistToMain.to($('.curator_playlist'), 0.8, {display: 'none', opacity: 0, scale: 1.1, ease: Power2.easeInOut}, 0);

		// show curator list
		playlistToMain.fromTo($('#curator'), 0.8, {display: 'none', opacity: 0, scale: 1.1}, 
											{display: 'block', opacity: 1, scale: 1, ease: Power2.easeInOut}, 0)

		playlistToMain.fromTo($('.curator_list'), 0.8, {display: 'none', opacity: 0, scale: 1.1}, 
											{display: 'block', opacity: 1, scale: 1, ease: Power2.easeInOut}, 0)

	}

	// Search Page에서 Home으로
	else if($('#search_container').css('display') !== "none"){
		var searchToHome = new TimelineMax({});

		// Hide
		searchToHome.fromTo($('#search_container'), 0.5, {opacity: 1, display: 'flex', x: 0},
											{opacity: 0, x: 30, display: 'none', ease: Power2.easeInOut}, 0.5);


		searchToHome.to($('.back_btn'), 0.5, {display: 'none', opacity: 0, x: 15, ease: Power2.easeInOut}, 0.5);
		searchToHome.to($('#curator'), 0, {display: 'none', ease: Power2.easeInOut}, 1);

		// Background Up
		searchToHome.to($('.wave-container'), 1, {yPercent: 0, ease: Power2.easeInOut}, 1);

		// 	Show
		searchToHome.to($('.text-wrap'), 0.5, {display: 'flex', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);		
	}

	// start_input to Home
	else if($('#start_input_container').css('display') !== "none"){
		var startInputToHome = new TimelineMax({});

		// Hide 
		startInputToHome.to($('#start_input_container'), 0.8, {display: 'none', opacity: 0, scale: 1.1, ease: Power2.easeInOut}, 0);
		startInputToHome.to($('#handleurl_container'), 0.8, {display: 'none', opacity: 0, scale: 1.1, ease: Power2.easeInOut}, 0);
		startInputToHome.to($('#select_container'), 0.8, {display: 'none', opacity: 0, scale: 1.1, ease: Power2.easeInOut}, 0);

		// Background Up
		startInputToHome.to($('.wave-container'), 1, {yPercent: 0, ease: Power2.easeInOut}, 1);

		// 	Show
		startInputToHome.to($('.text-wrap'), 0.5, {display: 'flex', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);

		// startInputToHome.to($('.logo-text, .line'), 0.5, {display: 'block', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);

		// 	Force to redraw by using y translate
		startInputToHome.fromTo($('.text-wrap .text'), 0.1, {y: 0.1, position: 'absolute'},
											{y: 0, position: 'relative', ease: Power2.easeInOut}, 1.3);
	}

	// playlist_url to start_input
	else if($("#handleurl_container").css('display') !== "none"){
		var playlistUrlToStartInput = new TimelineMax({});

		// Hide
		playlistUrlToStartInput.to($('#handleurl_container'), 0.8, {display: 'none', opacity: 0, scale: 1.1, ease: Power2.easeInOut}, 0);

		// Show
		playlistUrlToStartInput.to($('#start_input_container'), 0.5, {display: 'flex', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);
		playlistUrlToStartInput.to($('#playlist_url'), 0.5, {display: 'flex', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);
		playlistUrlToStartInput.to($('#playlist_select'), 0.5, {display: 'flex', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);

	}
	
	// From Main(2) to Home(1)
	else{
		var mainToHome = new TimelineMax({});
		// Hide
		mainToHome.fromTo($('.curator_title_wrapper'), 0.5, {opacity: 1, x: 0},
											{opacity: 0, x: 30, ease: Power2.easeInOut}, 0.2);

		mainToHome.fromTo($('.curator_list'), 0.5, {opacity: 1, display: 'block', x: 0},
											{opacity: 0, x: 30, display: 'none', ease: Power2.easeInOut}, 0.5);


		mainToHome.to($('.back_btn'), 0.5, {display: 'none', opacity: 0, x: 15, ease: Power2.easeInOut}, 0.5);

		mainToHome.to($('#curator'), 0, {display: 'none', ease: Power2.easeInOut}, 1);

		// Background Up
		mainToHome.to($('.wave-container'), 1, {yPercent: 0, ease: Power2.easeInOut}, 1);

		// 	Show
		mainToHome.to($('.text-wrap'), 0.5, {display: 'flex', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);

		// mainToHome.to($('.logo-text, .line'), 0.5, {display: 'block', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);

		// 	Force to redraw by using y translate
		mainToHome.fromTo($('.text-wrap .text'), 0.1, {y: 0.1, position: 'absolute'},
											{y: 0, position: 'relative', ease: Power2.easeInOut}, 1.3);
		// $('.text-wrap .text').css('position', 'relative');
	}
});


// ===== Home Page Click =====
$("#home_page").click(function(){

	$('#start_input_container').hide();
	$('#handleurl_container').hide()
	$('#select_container').hide()
	$('#curator').hide()
	$('#back_btn').hide()

	var mainToHome = new TimelineMax({});
	// Hide
	// mainToHome.fromTo($('.select_search_submit_button'), 0.5, {opacity: 1, display: 'block', x: 0},
	// 									{opacity: 0, x: 30, display: 'none', ease: Power2.easeInOut}, 0.5);

	
	TweenMax.to(".dim", 0.5, {opacity: 0, display: 'none', ease: Power2.easeInOut});
	TweenMax.to(".nav", 0.5, {xPercent: -100, display:'none', ease: Expo.easeOut});
	// TweenMax.to(".logo-text", 0.5, {x: 250, ease: Expo.easeOut});
	

	// submit_buttom -> select_search_submit_button으로 바꿈
	mainToHome.to($('.select_search_submit_button'), 0.5, {display: 'none', opacity: 0, x: 15, ease: Power2.easeInOut}, 0.5);										

	mainToHome.to($('.list_box'), 0.5, {display: 'none', opacity: 0, x: 15, ease: Power2.easeInOut}, 0.5);

	mainToHome.to($('#drop_down'), 0, {display: 'none', ease: Power2.easeInOut}, 1);


	// Background Up
	mainToHome.to($('.wave-container'), 1, {yPercent: 0, ease: Power2.easeInOut}, 1);

	// 	Show
	mainToHome.to($('.text-wrap'), 0.5, {display: 'flex', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);

	// mainToHome.to($('.logo-text, .line'), 0.5, {display: 'block', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);

	// 	Force to redraw by using y translate
	mainToHome.fromTo($('.text-wrap .text'), 0.1, {y: 0.1, position: 'absolute'},
										{y: 0, position: 'relative', ease: Power2.easeInOut}, 1.3);							
		
});

// ===== Search page  =====
$('#search_music_page').click(function(){
	// $("#search_container").show();

	$('#handleurl_container').hide();
	$("#search_container").hide();
	$('#select_container').hide();
	$('#curator').hide();

	var mainToSearch = new TimelineMax({});

	// Hide
	mainToSearch.to($('.text-wrap'), 0.5, {display: 'none', opacity: 0, y: -20, ease: Power2.easeInOut}, 0);
	
	// Background down
	mainToSearch.to($('.wave-container'), 1, {yPercent: 30, ease: Power2.easeInOut}, 0);	

	TweenMax.to(".dim", 0.5, {opacity: 0, display: 'none', ease: Power2.easeInOut});
	TweenMax.to(".nav", 0.5, {xPercent: -100, display:'none', ease: Expo.easeOut});


	mainToSearch.fromTo($('#search_container'), 0.8, {x: 15},
		{display: 'flex', opacity: 1, x: 0, ease: Power2.easeInOut}, 1);

	mainToSearch.fromTo($('.back_btn'), 0.8, {x: 15},
		{display: 'flex', opacity: 1, x: 0, ease: Power2.easeInOut}, 1);

})


// ===== Start input page for input url and select your own  =====
// ===== main to input =====
$("#start_input_page").click(function(){

	$('#start_input_container').show()
	$('#playlist_url').show()
	$('#playlist_select').show()

	$('#handleurl_container').hide()
	$("#search_container").hide()
	$('#select_container').hide()
	$('#curator').hide()


	var mainToInput = new TimelineMax({});
 
	// Hide
	mainToInput.to($('.text-wrap'), 0.5, {display: 'none', opacity: 0, y: -20, ease: Power2.easeInOut}, 0);
	
	// Background down
	mainToInput.to($('.wave-container'), 1, {yPercent: 30, ease: Power2.easeInOut}, 0);

	// Show
	// mainToInput.to($('.logo-text, .line'), 0.5, {display: 'block', opacity: 1, y: 0, ease: Power2.easeInOut}, 1.2);

	TweenMax.to(".dim", 0.5, {opacity: 0, display: 'none', ease: Power2.easeInOut});
	TweenMax.to(".nav", 0.5, {xPercent: -100, display:'none', ease: Expo.easeOut});


	mainToInput.fromTo($('.back_btn'), 0.8, {x: 15},
		{display: 'flex', opacity: 1, x: 0, ease: Power2.easeInOut}, 1);
	
});


$("#playlist_url").click(function(){
	$('#start_input_container').hide()
	$('#handleurl_container').css('display', 'flex')
	
});

$("#playlist_select").click(function(){
	$('#start_input_container').hide()
	$('#select_container').css('display', 'flex')
});


// select에서 playlist를 가져오기 위한 버튼 클릭
$(".submit-playlist").click(function(){
	$('#select_container').hide()
	$('#playList').css('display', 'flex')

})


// 클래스명 변경
// ===== Playlist_url에서 Playlist page
$(".hadleurl_contents .submit_button").click(function(){
	$('.hadleurl_contents').css('display', 'none')
	$('.output_playlist').css('display', 'flex');
})


