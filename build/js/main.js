var player;
function onYouTubePlayerAPIReady() {
	if ($('#youtube').length > 0) {
    	player = new YT.Player('youtube', {
			width: '100%',
			height: '100%',
			videoId: 'ZpjTZ8MRSew',
			playerVars: { 'wmode': 'transparent' },
			events: {
				'onReady': onPlayerReady
			}
    	});
	}
}
function onPlayerReady() {
	$('#drive .tab2').removeClass('loading');
}
(function(){
	var faderClasses = 'fader150 fader200';
	$.ender({
	  ariaHide: function () {
	    return this.attr({
	    	'aria-hidden': 'true',
	    	'aria-expanded': 'false'
	    });
	  },
	  ariaShow: function () {
	    return this.attr({
	    	'aria-hidden': 'false',
	    	'aria-expanded': 'true'
	    });
	  },
	  clone: function() {
	  	return this[0].cloneNode(true);
	  },
	  fadeIn: function(speed) {
	  	if (speed != 150 && speed != 200) speed = 200;
	  	var elem = this;
	  	return (function() {
	  		elem.removeClass(faderClasses);
	  		elem.addClass('fader' + speed);
	  		elem.removeClass('fadeOut').addClass('fadeIn');
	  	})();
	  },
	  fadeOut: function(speed) {
	  	if (speed != 150 && speed != 200) speed = 200;
	  	var elem = this;
	  	return (function() {
	  		elem.removeClass(faderClasses);
	  		elem.addClass('fader' + speed);
	  		elem.removeClass('fadeIn').addClass('fadeOut');
	  	})();
	  },
	  draggable: function(args) {
	  	if (this.length == 0) return false;
	  	if (typeof args != 'object') args = {};
	  	this.each(function(elem, index) {
	  		var drag = elem;
	  		var container = $('main > div')[0];
	  		if (args.handle) {
	  			var handle = drag.getElementsByClassName(args.handle)[0]
	  			draggable(drag, handle, container);
	  		}
	  		else {
	  			draggable(drag);
	  		}
	  		drag.whenDragStops(function() {
	  			moveWindows(drag, container);
	  		});
	  	});
	  },
	    removeDraggable: function() {
	    	this.each(function(elem, index) {
		  		if (elem.length == 0) return false;
		  		if (typeof elem['draggableListeners'] != 'undefined') {
		  			elem.removeAttribute('style');
		  			return false;
		  		}
		  	});
	  	},
	  	smartresize: function(fn) {
	  		this.on('resize', debounce(fn));
	  	}
	}, true);

	var mq = window.matchMedia("(min-width: 800px)");
	mq.addListener(resize);

	function debounce(func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }

	function moveWindows(drag, container) {
		var rect = drag.getBoundingClientRect();
	  	var bounds = container.getBoundingClientRect();
	  	if(rect.bottom > bounds.bottom + rect.height-20) $(drag).css('top', bounds.bottom-20);
	  	if(rect.right > bounds.right + rect.width + bounds.left-20) $(drag).css('left', bounds.right-20);
	  	if(rect.top < bounds.top) $(drag).css('top', document.getElementsByTagName('header')[0].getBoundingClientRect().height);
	  	if(rect.left < bounds.left - (rect.width - 20)) $(drag).css('left', 0-rect.width + 20);
	}

	//returns object with string for display of hours, minutes, and am/pm
	function parseTime(date) {
		var hour = date.getHours();
		var ampm = "AM";
		if (hour > 11) ampm = "PM";
		if (hour === 0) var displayHour = 12;
		else if (hour > 12) var displayHour = hour-12;
		else displayHour = hour;
		var minute = date.getMinutes();
		if (minute < 10) minute = "0"+minute;
		return {'displayHour': displayHour, 'militaryHour': hour, 'minute' : minute, 'ampm' : ampm };
	}

	//clock
	function setClock() {
		var date = parseTime(new Date());
		//for clock
		$('#clock').text(date.displayHour+":"+date.minute+" "+date.ampm);
		
		//for date on about page
		if ($('#about-version').length > 0) {
			var year = new Date().getFullYear().toString().slice(2,4);
			$('#about-version span').html('Version 2.6.'+year);
		}
		
		//for number of months at current job on resume page
		if ($('#drive #counter').length > 0) {
			var tmpStart = new Date(2015, 0, 26);
			var months = Math.ceil((new Date() - tmpStart)/(1000*60*60*24*30));
			var years = 0;
			if (months >= 12) {
				years = Math.floor(months/12);
				months = months%12;
			}
			if(typeof(years)==='undefined'||years===0){ yText = ''; }
		    else if (years === 1) { yText = years + ' year '; }
		    else { yText = years + ' years '; }

		    if (months === 0) { mText = ''; }
		    else if (months === 1) { mText = months + ' month'; }
		    else { mText = months + ' months'; }
			$('#drive #counter').html('('+yText + mText+')');
		}
	};

	//dates/times on portfolio page
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
	function setHistory() {
		var hDate = new Date();
		var day = days[hDate.getDay()];
		var dateNum = hDate.getDate();
		var month = months[hDate.getMonth()];
		var year = hDate.getFullYear();
		//set dateNum suffix - get last digit of number 
		var endDateNum = parseInt(dateNum.toString().split().pop());
		if (endDateNum === 1) var dateSuffix = 'st';
		else if (endDateNum === 2) var dateSuffix = 'nd';
		else if (endDateNum === 3) var dateSuffix = 'rd';
		else dateSuffix = 'th';
		$('#history-date').html(day + ' ' + month + ' ' + dateNum + dateSuffix + ' ' + year).addClass('loaded');
		
		//for list items
		var startTime = new Date();
		$('.time').each(function(elem, index) {
			var time = parseTime(new Date(startTime - (15*60000*index)));
			//to handle switches of times at even number breaks and changes at midnight and noon
			if (parseInt(time.minute) > 52 && time.displayHour !== 12) {
				if (time.displayHour === 11 && time.militaryHour === 11) time.ampm = 'PM';
				else if (time.displayHour === 11 && time.militaryHour === 23) time.ampm = 'AM';
				time.displayHour++;
			}
			else if (parseInt(time.minute) > 52 && time.displayHour === 12) time.displayHour = 1;
			//round to nearest quarter hour
			time.minute = (((parseInt(time.minute) + 7.5)/15 | 0)*15) % 60;
			if (time.minute === 0) time.minute = '00';
			$(this).html(time.displayHour+':'+time.minute+' '+time.ampm);
		});	
	}

	//ui popups
	var audio;

	wifiDrop = '<ul class="utility-content wifi">'
		+'<li>Wi-Fi: Looking for Networks...</li>'
		+'<li>optimumwifi</li>'
		+'<li>HOME-A113</li>'
		+'<li>FBI Surveillance Van</li>'
		+'<li>Sean\'s WiFi</li>'
		+'<li>Virus Machine</li>'
		+'<li>Virus Machine 5</li>'
		+'<li>CableWiFi</li>'
		+'<li>FBI Surveillance Van Guest</li>'
		+'</ul>';
		
	soundDrop = '<div class="utility-content sound">'
		+'<input type="range" min="0.0" max="1.0" step=".01"/>'
	    +'</div>';

	batteryDrop = '<p class="utility-content battery">42% (3:45 remaining)<br/>Power Source: Battery</p>';

	function bringToFront(target, type) {
		$(type).css('z-index','1').removeClass('top-window');
		target.css('z-index','2').addClass('top-window');
	}

	function resize() {
		//remove faded classes
		$('*[class^="fader"]').removeClass(faderClasses + " fadeOut fadeIn");
		
		//for screens larger than 800px
		if (mq.matches) {
			//duplicate menu on top bar
			if ($('header #main-nav-top').length <= 0) {
				var topNav = $('#main-nav').clone();
				$(topNav).attr('id','main-nav-top').insertAfter($('header h1'));
			}
			
			//to bring clicked window to the front of the screen, and hide any open features
			$('section').on('mousedown', function() {
				bringToFront($(this), 'section');
			});
		}
		//for screens smaller than 800px
		else {
			$('section[data-draggable="true"]').removeDraggable();
			//for battery status indicator
			$('#battery-status').html(Math.floor(Math.random()*100)+'%');
		}
	}

	//features in top right corner - focus and onclick actions
	$('#features a').on('focus', function() {
		$(this).parent('li').addClass('focused');
	}).on('blur',function() {
		$(this).parent('li').removeClass('focused');
	});
	$('main, footer, section').on('click', function() {
		if (audio !== undefined) audio.pause();
		$('#features li').removeClass('focused active');
		$('.utility-content').hide().ariaHide();
	});
	$('#features a').on('click',function(e) {
		e.preventDefault();
		if(mq.matches) {
			$('#features li').removeClass('focused');
			var isOpen = $(this).parent('li').hasClass('active');
			$('#features li').removeClass('active');
			$('.utility-content').fadeOut();
			$('.utility-content').hide().ariaHide();
			if (audio !== undefined) audio.pause();
			var id = $(this).attr('id');
			if (!isOpen) {
				$(this).parent('li').addClass('active');
				if ($('.utility-content.'+id).length == 0) $(this).parent('li').append(window[id+'Drop']);
				else {
					$('.utility-content.'+id).fadeIn();
					$('.utility-content.'+id).show().ariaShow();
				}
				switch(id) {
					case "sound":
						if ($('#yakety').length <= 0) {
							audio = document.createElement('audio');
							audio.id="yakety";
							audio.loop="loop";
							audio.volume = $('.utility-content.sound input').val();
							var source= document.createElement('source');
							source.type= 'audio/ogg';
							source.src= 'audio/yakety.ogg';
							audio.appendChild(source);
							source= document.createElement('source');
							source.type= 'audio/mpeg';
							source.src= '/audio/yakety.mp3';
							audio.appendChild(source);
							$('body').append(audio);
						}
						audio.play();
						$('.utility-content.sound input').change(function() {
							audio.volume = $(this).val();
						});
						break;
					case "battery":
						var minutes = Math.floor(Math.random()*60);
						if (minutes < 10) minutes = '0'+minutes;
						$('.utility-content.battery').html((Math.floor(Math.random()*100))+'% ('+Math.floor(Math.random()*7)+':'+minutes+') remaining<br/>Power Source: Battery');
						break;
				}
			}
			else {
				$(this).parent('li').removeClass('active');
				$(this).next('.utility-content').fadeOut(150);
				$(this).next('.utility-content').ariaHide();
			}
		}
		return false;
	});

	//for battery status indicator
	$('#battery').parent('li').append('<div id="battery-status"></div>');
	setClock();
	setInterval(setClock, 30000);

	//to switch z-index on focus
	$('section a').on('focus', function() {
		if (!$($(this).parents('section')[0]).hasClass('top-window')) bringToFront($($(this).parents('section')[0]), 'section');	
	});
	
	//portfolio page date function
	if ($('#history-date').length > 0) setHistory();
	
	//resume page expandables
	$('.more').ariaHide();
	
	$('#drive .toggle').on('click touchstart', function(e) {
		e.preventDefault();
		if (!$(this).hasClass('expanded')) {
			$(this).addClass('expanded');
			$($(this).attr('href')).show().ariaShow();
		}
		else {
			$(this).removeClass('expanded');
			$($(this).attr('href')).hide().ariaHide();
		}
		return false;
	});
	
	//resume page youtube modal
	if ($('#drive .tab2').length > 0) {			
		$('#drive .ui a').on('click', function() {
			if (!$(this).hasClass('active')) {
				$('#drive .ui a').removeClass('active');
				$(this).addClass('active');
			}
			return false;
		});
		
		$('#drive .tab2').on('click', function(e) {
			e.preventDefault();
			//create youtube video if it does not already exist
			if ($('#youtube-wrapper').length <= 0) {
				$(this).addClass('loading');
				$('#drive').append('<div id="youtube-wrapper"><div id="youtube"></div></div>');
			    var tag = document.createElement('script');
			    tag.src = "http://www.youtube.com/player_api";
			    $('body').append(tag);
			}
			else {
				$('#youtube-wrapper').show().ariaShow();
			}
			$('#drive>h1:not(#youtube-wrapper), #drive>div:not(#youtube-wrapper)').hide().ariaHide();
			return false;
		});
		
		$('#drive .tab1').on('click', function(e) {
			e.preventDefault();
			player.pauseVideo();
			$('#drive>h1:not(#youtube-wrapper), #drive>div:not(#youtube-wrapper)').show().ariaShow();
			$('#youtube-wrapper').hide().ariaHide();
			return false;
		});
	}	
	
	//critical dinosaur functionality
	$(document).on('keydown', function(e) { 
	    var code = (e.keyCode ? e.keyCode : e.which);
	    if(code == 68) {
	        if ($("#dinoBox").length <= 0){
				var dinoBox = new Image();
				dinoBox.src = '/img/dino.png';
				dinoBox.id = 'dinoBox';
	            dinoBox.alt = "Happy now, Sam?"
				$(dinoBox).appendTo(document.body);
	        }
			else {
				 $('#dinoBox').remove();
			}
	    }
	});

	//web standards update to current URL - get past 6 full months of data
	var statsLink = $('#standards [data-url]');
	if (statsLink.length > 0) {
		var today = new Date();
		var endDate = today.getFullYear() + (today.getMonth() < 10 ? "0" : "") + today.getMonth();
		today.setMonth(today.getMonth()-6)
		var startDate = today.getFullYear() + (today.getMonth() < 10 ? "0" : "") + today.getMonth();
		statsLink.attr('href', statsLink.attr('data-url').replace('{0}', startDate).replace('{1}', endDate));
	}

	$(window).smartresize(function() {
		if (mq.matches) {
			$('section').each(function() {
				moveWindows(this, $('main > div')[0]);
			});
		}
	}, 500);
	
	resize();
	if (mq.matches) {
		$('section[data-draggable="true"]').draggable({
			handle: 'ui'
		});
	}
})();