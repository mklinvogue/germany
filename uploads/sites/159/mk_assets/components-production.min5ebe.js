 /* mk_button */  
  /* mk_audio */  
 (function( $ ) {
    'use strict';

    // If we want to get access to API of already initilised component we run a regular new conctructor.
    // When instance is discovered in cache object then we return exisiting instance.
    // 
    // TODO move it to core functions and run logic on init
    var _instancesCollection = {};

    MK.component.SwipeSlideshow = function( el ) {
        var $this = $( el );
        var id = $this.parent().attr('id');

        this.el = el;
        this.id = id;
        this.config = $this.data( 'swipeslideshow-config' );
        if( this.config ) this.config.hasPagination = false;
    };

    MK.component.SwipeSlideshow.prototype = {
        init : function() {
            var slider = new MK.ui.Slider( this.el, this.config );
            slider.init();

            _instancesCollection[ this.id ] = slider;
        }
    };


    // Additional nav
    // Mostly for thumbs in woocommerce
    MK.component.SwipeSlideshowExtraNav = function( el ) {
        this.el = el;
    };

    MK.component.SwipeSlideshowExtraNav.prototype = {
        init : function init() {
            this.cacheElements();
            this.bindEvents();
        },

        cacheElements : function cacheElements() {
            var $this = $( this.el );

            this.sliderId = $this.data( 'gallery' );
            this.slider = _instancesCollection[this.sliderId]; 
            this.$thumbs = $( '#' + this.sliderId ).find( '.thumbnails a');
        },

        bindEvents : function bindEvents() {
            this.$thumbs.on( 'click', this.clickThumb.bind( this ) );
        },

        clickThumb : function clickThumb( e ) {
            e.preventDefault();
            var $this = $( e.currentTarget ),
                id = $this.index();

            this.slider.goTo( id );
        }
    };


    // Mostly for switcher in woocommerce
    MK.utils.eventManager.subscribe('gallery-update', function(e, config) {
        if(typeof _instancesCollection[config.id] === 'undefined') return;
        _instancesCollection[config.id].reset();
    });

})( jQuery ); 
 (function($) {
  'use strict';

  /* Page Section Intro Effects */
  /* -------------------------------------------------------------------- */

  function mk_section_intro_effects() {
    if (!MK.utils.isMobile()) {
      if (!$.exists('.mk-page-section.intro-true')) return;

      $('.mk-page-section.intro-true').each(function() {
        var that = this;
        MK.core.loadDependencies([ MK.core.path.plugins + 'jquery.sectiontrans.js', MK.core.path.plugins + 'tweenmax.js' ], function() {
          var $this = $(that),
            $pageCnt = $this.parent().nextAll('div'),
            windowHeight = $(window).height(),
            effectName = $this.attr('data-intro-effect'),
            $header = $('.mk-header');

          var effect = {
            fade: new TimelineLite({paused: true})
              .set($pageCnt, { opacity: 0, y: windowHeight * 0.3 })
              .to($this, 1, { opacity: 0, ease:Power2.easeInOut })
              .to($pageCnt, 1, { opacity: 1, y: 0, ease:Power2.easeInOut}, "-=.7")
              .set($this, { zIndex: '-1'}),

            zoom_out: new TimelineLite({paused: true})
              .set($pageCnt, { opacity: 0, y: windowHeight * 0.3})
              .to($this, 1.5, { opacity: .8, scale: 0.8, y: -windowHeight - 100, ease:Strong.easeInOut })
              .to($pageCnt, 1.5, { opacity: 1, y:  0, ease:Strong.easeInOut}, "-=1.3"),

            shuffle: new TimelineLite({paused: true})
              .to($this, 1.5, { y: -windowHeight/2, ease:Strong.easeInOut })
              .to($pageCnt.first(), 1.5, { paddingTop: windowHeight/2, ease:Strong.easeInOut }, "-=1.3")
          };

          console.log($pageCnt);
        

          $this.sectiontrans({
            effect: effectName
          });

          if($this.hasClass('shuffled')) {
            TweenLite.set($this, { y: -windowHeight/2 });
            TweenLite.set($this.nextAll('div').first(), { paddingTop: windowHeight/2 });
          }

          $('body').on('page_intro', function() {
            MK.utils.scroll.disable();
            $(this).data('intro', true);
            effect[effectName].play();
            setTimeout(function() {
              $header.addClass('pre-sticky');
              $header.addClass('a-sticky');
              $('.mk-header-padding-wrapper').addClass('enable-padding');
              $('body').data('intro', false);
              if(effectName === 'shuffle') $this.addClass('shuffled');
            }, 1000);

            setTimeout(MK.utils.scroll.enable, 1500);
          });

          $('body').on('page_outro', function() {
            MK.utils.scroll.disable();
            $(this).data('intro', true);
            effect[effectName].reverse();
            setTimeout(function() {
              $header.removeClass('pre-sticky');
              $header.removeClass('a-sticky');
              $('.mk-header-padding-wrapper').removeClass('enable-padding');
              $('body').data('intro', false);
              if($this.hasClass('shuffled')) $this.removeClass('shuffled');
            }, 1000);
            
            setTimeout(MK.utils.scroll.enable, 1500);
          });
        });
      });

    } else {
      $('.mk-page-section.intro-true').each(function() {
        $(this).attr('data-intro-effect', '');
      });
    }
  }

  mk_section_intro_effects();

  var debounceResize = null;
  $(window).on("resize", function() {
    if( debounceResize !== null ) { clearTimeout( debounceResize ); }
    debounceResize = setTimeout( mk_section_intro_effects, 300 );
  });
  
  /* Page Section Adaptive Height */
  /* -------------------------------------------------------------------- */
    
    function mk_section_adaptive_height() {
        $( ".mk-page-section.mk-adaptive-height" ).each( function() {
            var imageHeight = $( this ).find( ".mk-adaptive-image" ).height();
            $( this ).css( "height", imageHeight );
        });
    }
    
    $( window ).on( "load resize", mk_section_adaptive_height );

}(jQuery)); 
  /* vc_column */  
  /* mk_image */  
 (function ($) {
	'use strict';  

	function dynamicHeight() {
		var $this = $( this );

		$this.height( 'auto' );

		if( window.matchMedia( '(max-width: 768px)' ).matches ) {
			return;
		} 
		 
		$this.height( $this.height() );
	}


	var $window = $( window );
	var container = document.getElementById( 'mk-theme-container' );

	$( '.equal-columns' ).each( function() { 
		dynamicHeight.bind( this );
	    $window.on( 'load', dynamicHeight.bind( this ) );
	    $window.on( 'resize', dynamicHeight.bind( this ) );
	    window.addResizeListener( container, dynamicHeight.bind( this ) );
	});

}( jQuery )); 
  /* mk_padding_divider */  
  /* mk_fancy_title */  
  /* vc_column_text */  
  /* vc_row_inner */  
  /* mk_divider */  
  /* mk_portfolio */  
  /* mk_dropcaps */  
  /* mk_blockquote */  
 (function($) {
    'use strict';

    var zIndex = 0;

    $('.mk-newspaper-wrapper').on('click', '.blog-loop-comments', function (event) {
        event.preventDefault();

        var $this = $(event.currentTarget);
        var $parent = $this.parents('.mk-blog-newspaper-item');

        $parent.css('z-index', ++zIndex);
        $this.parents('.newspaper-item-footer').find('.newspaper-social-share').slideUp(200).end().find('.newspaper-comments-list').slideDown(200);
        setTimeout( function() {
          MK.utils.eventManager.publish('item-expanded');
        }, 300);
    });

    $('.mk-newspaper-wrapper').on('click', '.newspaper-item-share', function (event) {
        event.preventDefault();

        var $this = $(event.currentTarget);
        var $parent = $this.parents('.mk-blog-newspaper-item');

        $parent.css('z-index', ++zIndex);
        $this.parents('.newspaper-item-footer').find('.newspaper-comments-list').slideUp(200).end().find('.newspaper-social-share').slideDown(200);
        setTimeout( function() {
          MK.utils.eventManager.publish('item-expanded');
        }, 300);
    });

}(jQuery)); 
 