function closePlumbox() {
	$('#plumbox-overlay').fadeOut(200);
	setTimeout(function() {
		$('#plumbox-overlay').hide();
		$('#plumbox').removeAttr('class style');
		$('.plumbox-content').remove();
	}, 201);
}

//array to store galleries so multiple ones can be built on same page
var plumGalleries = [];

var Plumgallery = function(elem, varname) {
	var self = this;
	this.el = elem;
	this.close = function() {
		$('#plumbox-overlay').hide(function() {
			$('#plumbox').removeAttr('class');
		});
	};
	this.currentItem = 0;
	this.length = elem.find('a').length;
	this.items = elem.find('a');
	elem.find('a').each(function(elem, index) {
		$(this).attr('data-order', index);
	}).on('click', function(e) {
		e.preventDefault();
		$(this).plumbox(varname);
		self.currentItem = parseInt($(this).attr('data-order'));
		return false;
	});
	
	$(document).on('keydown', function(e) {   
		if ($('.plumbox-content').length > 0) {
		    var code = (e.keyCode ? e.keyCode : e.which);
		    if(code == 39) {
				window[varname].moveItem('next');
			}
			else if (code == 37) {
				window[varname].moveItem('prev');
			}
			else if (code == 27) {
				closePlumbox();
			}
		}
	});

	this.moveItem = function(direction) {
		var shouldQuit = self.currentItem >= self.items.length -1,
			shouldDisable = self.currentItem === self.items.length - 2,
			iterate = function() {
				self.currentItem++;
			},
			moveclass = 'moveleft';
		if (direction == 'prev') {
			shouldQuit = self.currentItem === 0;
			shouldDisable = self.currentItem === 1;
			iterate = function() {
				self.currentItem--;
			};
			moveclass = 'moveright';
		}
		if (shouldQuit){
			return false;
		}
		self.clearAnimation();
		$('.plumbox-nav').removeClass('disabled');
		if (shouldDisable) {
			$('#plumbox-' + direction).addClass('disabled');
		}
		$('#plumbox').addClass(moveclass);
		setTimeout(function() {
			var ajaxTimer = setTimeout(function() { $('#plumbox-ajax').show(); }, 200);
			iterate();
			$('#plumbox-image img').attr('src', $(self.items[self.currentItem]).attr('href')+ '?' + new Date().getTime()).load(function() {
				clearTimeout(ajaxTimer);
				resizeImage($('#plumbox-image img'));
				$('#plumbox').addClass('pre-bounce');
				self.animation = setTimeout(function() { 
					$('#plumbox').removeClass(moveclass);
					self.animation = setTimeout(function() {
						$('#plumbox').removeClass('pre-bounce');
					}, 201);
				}, 1);
				return false;
			});
		}, 201);
		return false;	
	}

	this.clearAnimation = function() {
		clearTimeout(self.animation);
		$('#plumbox').removeClass('pre-bounce moveleft moveright');
	}
};

function resizeImage(img) {
	//reset before resize
	$('#plumbox').css('visibility','hidden').removeAttr('style');
	img.removeAttr('style');
	if (img.width() < img.height() || img.height() > $('#plumbox').height()) {
		var proportion = img.width() / img.height();
		$('#plumbox').css('max-width', $('#plumbox').height()*proportion + 'px');
	}
	$('#plumbox').css('margin-top', (($('#plumbox-overlay').height() - img.height()) / 2) - 16 + 'px');
	$('#plumbox-ajax').hide();
	$('#plumbox').css('visibility','visible');
};

$.ender({
	//gallery property is optional - define a gallery if the link is part of one
	plumbox: function(gallery) {
		var link = $(this).attr('href');
		var options = $(this).data();
		if ($('#plumbox-overlay').length <= 0) {
			var overlay = $('<div id="plumbox-overlay"></div>');
			overlay.css({
				'position' : 'fixed',
				'top' : '0',
				'left' : '0',
				'bottom' : '0',
				'right' : '0',
				'display' : 'none',
				'z-index' : '9998'
			});
			$('body').append(overlay);
			overlay.on('click', function(e) {
				console.log(e);
				closePlumbox();
			});
			overlay.append($('<div id="plumbox" tabindex="0"></div>')).append($('<a href="#" id="plumbox-close">close window</a>'));
			$('#plumbox-close').on('click touchstart', function(e) {
				e.preventDefault();
				closePlumbox();
			});
			$('#plumbox').on('click', function() {
				return false;
			});
			//add next/previous links and functionality
			if (gallery) {
				overlay.append($('<a href="#" id="plumbox-prev" class="plumbox-nav">previous</a><a href="#" id="plumbox-next" class="plumbox-nav">next</a>'));
				$('#plumbox-next').on('click touchstart', function(e) {
					e.stopPropagation();
					window[gallery].moveItem('next');
					e.preventDefault();
				});
				$('#plumbox-prev').on('click touchstart', function(e) {
					e.stopPropagation();
					window[gallery].moveItem('prev');
					e.preventDefault();
				});
				if (parseInt($(this).attr('data-order')) === 0) $('#plumbox-prev').addClass('disabled');
				else if (parseInt($(this).attr('data-order')) === window[gallery].length-1) $('#plumbox-next').addClass('disabled');
				overlay.on('swipeleft', function(e) {
					if ($('.plumbox-content').length > 0) window[gallery].moveItem('next');
				}).on('swiperight', function(e) {
					if ($('.plumbox-content').length > 0) window[gallery].moveItem('prev');
				});
			}
			initMaxWidth = $('#plumbox').css('max-width');
			//TODO - debounce that ho
			$(window).on('resize', function() {
				if ($('#plumbox-image').length > 0) {
					resizeImage($('#plumbox-image img'));
				}
			});
		}
		//empty existing content, if content exists
		$('#plumbox').css('max-width', initMaxWidth);
		switch (options.plumboxType) {
			case "iframe":
				var content = $('<iframe id="plumbox-iframe" class="plumbox-content" frameborder="0" src="'+content+'"><a href="'+content+'">Your browser does not support iframes. Click to view content.</a></iframe>');
				$('#plumbox').addClass(options.plumboxType).append(content);
				break;
			case "youtube":
				var content = $('<div id="plumbox-youtube" class="plumbox-content"><iframe class="plumbox-content" frameborder="0" src="'+content+'"><a href="'+content+'">Your browser does not support iframes. Click to view video.</a></iframe></div>');
				$('#plumbox').addClass(options.plumboxType).append(content);
				break;
			case "image":
				if ($('#plumbox-ajax').length <= 0) $('#plumbox-overlay').append($('<div id="plumbox-ajax"></div>'));
				$('#plumbox').css('visibility','hidden');
				var contentImg = new Image();
				contentImg.src = link + "?" + new Date().getTime();
				contentImg.alt = $(this).children('img').attr('alt');
				$(contentImg).load(function() {
					resizeImage($(this));
				});
				var content = $('<div id="plumbox-image" class="plumbox-content"></div>').append(contentImg);
				$('#plumbox').addClass(options.plumboxType).append(content);
				break;
		}
		
		$('#plumbox-overlay').show().fadeIn();
	},
	plumgallery: function() {
		var count = plumGalleries.length;
		window['gallery'+count] = new Plumgallery($(this), 'gallery'+count);
		plumGalleries.push(window['gallery'+count]);
	}
}, true);
if ($('*[data-plumbox]').length) {
	$('*[data-plumbox]').plumbox();
}
if ($('*[data-plumgallery]').length) {
	$('*[data-plumgallery]').plumgallery();	
}