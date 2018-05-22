var App = window.App || {};

App = (function($) {
	
	'use strict';
	
	// MEDIA QUERIES
	var handleDesktopWidthChange = (function() {
		var _$navLinks = $('.main-nav .main-nav-item-parent .main-nav-link');
		var _handleWidthChange = function(mqlVal) {
			if (mqlVal.matches) {
				_$navLinks.on('click', function(e) {
					e.preventDefault();
					$(this).parent().toggleClass('selected').siblings().removeClass('selected');
				});
			} else {
				_$navLinks.off('click');
			}
		}
		var init = function() {
			if (window.matchMedia) {
				var mql = window.matchMedia('(max-width: 1199px)');
				mql.addListener(_handleWidthChange);
				_handleWidthChange(mql);
			}
		}
		return {
			init: init
		}
	})();
	
	// SLIDESHOW
	var slideshow = (function() {
		var _$el = $('.owl-carousel');
		var _config = {
			items: 1,
			loop: true,
			nav: true,
			navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
			autoplay: true,
			autoplayTimeout: 10000,
			autoplayHoverPause: true,
			onInitialized: function(event) {
				var element = event.target;
				if (!$(element).find('.owl-dots').hasClass('disabled')) {
					$(element).addClass('owl-dots-enabled');
				}
			}
		};
		var init = function() {
			_$el.each(function() {
				var	self = $(this);
				var settings = self.data('slideshow-settings');
				self.owlCarousel($.extend(Object.create(_config), settings));
			});
		}
		return {
			init: init
		}
	})();
	
	// COUNTDOWN
	var countdown = (function() {
		var _$el = $('.countdown');
		var init = function() {
			_$el.each(function() {
				var $this = $(this);
				var finalDate = $(this).data('countdown');
				$this.countdown(finalDate, function(event) {
					$this.html(event.strftime('<span class="countdown-inner"><span class="countdown-value">%D</span> <small>Days</small></span>'
					+ '<span class="countdown-inner"><span class="countdown-value">%H</span> <small>Hr</small></span>'
					+ '<span class="countdown-inner"><span class="countdown-value">%M</span> <small>Min</small></span>'
					+ '<span class="countdown-inner"><span class="countdown-value">%S</span> <small>Sec</small></span>'));
				});
			});
		}
		return {
			init: init
		}
	})();
	
	// BOOTSTRAP TOOLTIPS
	var tooltip = (function() {
		var _$el = $('[data-toggle="tooltip"]');
		var init = function() {
			_$el.tooltip();
		}
		return {
			init: init
		}
	})();
	
	// POPUPS
	var popup = (function() {
		var _$popupBtn = $('.btn-popup');
		var _popupConfig = {
			removalDelay: 300
		};
		var init = function() {
			_$popupBtn.magnificPopup(_popupConfig);
		}
		return {
			init: init
		}
	})();
	
	// INPUT SPINNER
	var spinner = (function() {
		var _$el = $('.input-group-spinner');
		var init = function() {
			_$el.each(function() {
				var self = $(this);
				var $minus = self.find('.input-group-btn:first-of-type .btn');
				var $plus = self.find('.input-group-btn:last-of-type .btn');
				var $input = self.find('input');
				var inputVal = parseInt($input.val(), 10);
				$minus.on('click', function() {
					if ($input.val() > 1) {
						$input.val(--inputVal);
					}
				});
				$plus.on('click', function() {
					$input.val(++inputVal);
				});
				$input.on('blur', function() {
					if (!$input.val()) {
						$input.val(1);
					}
				});
			});
		}
		return {
			init: init
		}
	})();
	
	// PRICE SLIDER
	var priceSlider = (function() {
		var _el = document.getElementById('price-slider');
		var _priceMinInput = document.getElementById('price-min');
		var _priceMaxInput = document.getElementById('price-max');
		var _prices = [_priceMinInput, _priceMaxInput];
		var _config = {
			start: [100, 500],
			connect: true,
			step: 10,
			range: {
				'min': 0,
				'max': 1000
			}
		}
		function setSliderHandle(i, value) {
			var r = [null,null];
			r[i] = value;
			_el.noUiSlider.set(r);
		}
		var init = function() {
			if (_el) {
				noUiSlider.create(_el, _config);
				_el.noUiSlider.on('update', function(values, handle) {
					_prices[handle].value = values[handle];
				});
				_prices.forEach(function(input, handle) {
					input.addEventListener('change', function(){
						setSliderHandle(handle, this.value);
					});
					input.addEventListener('keydown', function( e ) {
						var values = _el.noUiSlider.get();
						var value = Number(values[handle]);
						var steps = _el.noUiSlider.steps();
						var step = steps[handle];
						var position;
						switch ( e.which ) {
							case 13:
							setSliderHandle(handle, this.value);
							break;
							case 38:
							position = step[1];
							if ( position === false ) {
								position = 1;
							}
							if ( position !== null ) {
								setSliderHandle(handle, value + position);
							}
							break;
							case 40:
							position = step[0];
							if ( position === false ) {
								position = 1;
							}
							if ( position !== null ) {
								setSliderHandle(handle, value - position);
							}
							break;
						}
					});
				});
			}
		}
		return {
			init: init
		}
	})();
	
	// VALIDATION
	var validation = (function() {
		var _$el = $('form');
		var _config = {
			errorPlacement: function() {}
		}
		var init = function() {
			_$el.each(function() {
				$(this).validate(_config);
			});
		}
		return {
			init: init
		}
	})();
	
	// SEARCH
	var toggleSearchForm = (function() {
		var _$el = $('.site-search');
		var _$elTrigger = $('.user-nav-search-link');
		var _$elClose = $('.site-search-close-btn');
		var init = function() {
			_$elTrigger.on('click', function() {
				_$el.addClass('is-visible');
			});
			_$elClose.on('click', function() {
				_$el.removeClass('is-visible');
			});
		}
		return {
			init: init
		}
	})();
	
	// DONATION FORM
	var donationForm = (function() {
		var _$el = $('.donation-form');
		var _$elPaymentOnline = _$el.find('#payment-method-online');
		var _$elPaymentOffline = _$el.find('#payment-method-offline');
		var _$elRecurranceGroup = _$el.find('#recurrance-group');
		var init = function() {
			_$elPaymentOnline.on('click', function() {
				_$elRecurranceGroup.show();
			});
			_$elPaymentOffline.on('click', function() {
				_$elRecurranceGroup.hide();
			});
		}
		return {
			init: init
		}
	})();
	
	// CHECKOUT FORM
	var checkoutForm = (function() {
		var _$el = $('.checkout-form');
		var _$elAccountInput = _$el.find('#create-account');
		var _$elPasswordGroup = _$el.find('#password-group');
		var init = function() {
			_$elAccountInput.on('click', function() {
				_$elPasswordGroup.toggle();
			});
		}
		return {
			init: init
		}
	})();
	
	// CONTACT FORM
	var contactForm = (function() {
		var _$el = $('.contact-form');
		var _$elSubmit = _$el.find('[type="submit"]');
		var init = function() {
			_$el.submit(function(e){
				e.preventDefault();
				_$el.find('.loader').remove();
				if(_$el.valid()){
					var dataString = _$el.serialize();
					_$elSubmit.after('<div class="loader"></div>');
					$.ajax({
						type: _$el.attr('method'),
						url: _$el.attr('action'),
						data: dataString
					}).done(function() {
						_$elSubmit.parent().after('<div class="alert alert-success">Your message was sent successfully!</div>');
					}).fail(function() {
						_$elSubmit.parent().after('<div class="alert alert-danger">Your message wasn\'t sent, please try again.</div>');
					}).always(function() {
						_$el.find('.loader').remove();
						_$el.find('.alert').fadeIn();
						setTimeout(function() {
							_$el.find('.alert').fadeOut(function() {
								$(this).remove();
							});
						}, 5000);
					});
				}
			});
		}
		return {
			init: init
		}
	})();
	
	// MAP
	var contactsMap = (function() {
		var _$el = document.getElementById('map');
		var _markerUrl = 'images/map-marker.png';
		var _markerWidth = 42;
		var _markerHeight = 42;
		var _config = {
			el: _$el,
			scrollwheel: false,
			streetViewControl: false,
			mapTypeControl: false,
			zoomControl: true,
			zoomControlOptions: {
				position: google.maps.ControlPosition.RIGHT_BOTTOM
			},
			fullscreenControl: true,
			fullscreenControlOptions: {
				position: google.maps.ControlPosition.LEFT_BOTTOM
			}
		};
		var map;
		var mapStyles = [
			{
				'featureType': 'administrative',
				'elementType': 'geometry',
				'stylers': [
					{ 'visibility': 'off' }
				]
			},
			{
				'featureType': 'all',
				'elementType': 'all',
				'stylers': [
					{
						'saturation': -100
					},
					{
						'gamma': 1
					}
				]
			}
		];
		var init = function() {
			if (_$el) {
				map = new GMaps(_config);
				var markers_data = [];
				if (mapObjectsData.length > 0) {
					for (var i = 0, l = mapObjectsData.length; i < l; i++) {
						var item = mapObjectsData[i];
						if (item.lat != undefined && item.lng != undefined) {
							markers_data.push({
								lat: item.lat,
								lng: item.lng,
								title: item.title,
								icon: {
									scaledSize: new google.maps.Size(_markerWidth, _markerHeight),
									url: _markerUrl
								},
								infoWindow: {
									content: '<div class="map-popup"><h3>' + item.title + '</h3>' +
									'<p>' + item.description + '</p>' +
									'<address>' + item.address + '</address>',
									maxWidth: 300
								}
							});
						}
					}
				}
				map.addStyle({
					styledMapName: 'Styled Map',
					styles: mapStyles,
					mapTypeId: 'map_style'
				});
				map.setStyle('map_style');
				map.on('marker_added', function (marker) {
					var index = map.markers.indexOf(marker);
					if (index == map.markers.length - 1) {
						map.fitZoom();
					}
				});
				map.addMarkers(markers_data);
			}
		}
		return {
			init: init
		}
	})();
	
	// TOGGLE MAIN NAV
	var toggleMainNav = (function() {
		var _$el = $('.main-nav');
		var _$elToggle = $('.main-nav-toggle-btn');
		var init = function() {
			_$elToggle.on('click', function() {
				_$el.toggleClass('is-visible');
			});
		}
		return {
			init: init
		}
	})();
	
	// TOGGLE USER NAV
	var toggleUserNav = (function() {
		var _$el = $('.user-nav');
		var _$elToggle = $('.user-nav-toggle-btn');
		var init = function() {
			_$elToggle.on('click', function() {
				_$el.toggleClass('is-visible');
				_$elToggle.toggleClass('is-active');
			});
		}
		return {
			init: init
		}
	})();
	
	// PROGRESS BARS
	var progress = (function() {
		var _$el = $('.progress');
		var _$tooltip = _$el.find('[data-toggle="progress-tooltip"]');
		var init = function() {
			_$el.each(function() {
				var self = $(this);
				var _$elProgress = self.find('.progress-bar');
				var val = _$elProgress.attr('aria-valuenow');
				_$elProgress.width(val + '%');
				setTimeout(function() {
					_$tooltip.tooltip({
						trigger: 'manual'
					}).tooltip('show');
				}, 600);
			});
		}
		return {
			init: init
		}
	})();
	
	return {
		init: function() {
			slideshow.init();
			countdown.init();
			tooltip.init();
			popup.init();
			spinner.init();
			priceSlider.init();
			toggleSearchForm.init();
			validation.init();
			donationForm.init();
			checkoutForm.init();
			contactForm.init();
			contactsMap.init();
			toggleMainNav.init();
			toggleUserNav.init();
			handleDesktopWidthChange.init();
			progress.init();
		}
	}
	
}(jQuery));

jQuery(function() {
	'use strict';
	App.init();
});