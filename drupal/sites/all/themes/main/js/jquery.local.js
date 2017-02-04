// Local theme-specific jQuery-based customizations

// Activate lightbox if viewport is wide enough and browser is supported
(function($) {
  var shadowBufferInner = 20;
  var shadowBufferOuter = 100;
  var shadowBufferAll = shadowBufferInner + shadowBufferOuter;
  var minHeight = 500;
  var breakPoints = { 
    none: 0,
    small: 740 + shadowBufferAll,
    med: 980 + shadowBufferAll,
    large: 1220 + shadowBufferAll
  };
  // Checks if our lightbox "mode" has changed and triggers DOM update if so.
  checkMakeShadow = function() {
    var oldShadowMode = window.ShadowMode;
    var newShadowMode = getShadowMode();
    if (newShadowMode != oldShadowMode) {
      //alert('mode changed to ' + newShadowMode + ', which was triggered by a width greater than ' + breakPoints[newShadowMode]);
      window.ShadowMode = newShadowMode;
      doMakeShadow(newShadowMode);
    }
  }
  // Detects the appropriate lightbox "mode" based on current viewport details.
  getShadowMode = function() {
    var workingShadowMode = 'none';
    if ($(window).height() > minHeight && !unhappyBrowser()) {
      $.each(breakPoints, function(index, value) {
        if ($(window).width() > value) {
          workingShadowMode = index;
        }
      });     
    }
    return workingShadowMode;
  }
  // If our lightbox mode has changed we modify the DOM so that targeted
  // links are turned into lighboxes.
  doMakeShadow = function(shadowMode) {
    // Some shadowbox reset tasks don't seem to work until the window is loaded.
    // If it's not we don't want to do anything to avoid errors.
    if (window.loaded) {
      i = 0;
      if (shadowMode != 'none') {
        var shadowWidth = breakPoints[shadowMode] - shadowBufferOuter
        var shadowHeight = $(window).height() - shadowBufferOuter;
        $("a.make-shadow").each(function() {
          i++;
          var classes = {};
          $($(this).attr('class').split(' ')).each(function(index, value) { 
            if (this !== '') {
              classes[index] = this;
            }    
          });
          var group = '';
          if (typeof classes[1] !== 'undefined') {
            group = '[' + classes[1] + ']';
          }
          $(this).attr('rel', 'shadowbox' + group + ';width=' + shadowWidth + ';height=' + shadowHeight);
          $(this).addClass('shadow-active');
          var uri = $(this).attr('href');
          uri = updateQueryStringParameter(uri, 'pc', '1');
          $(this).attr('href', uri);
        });
      }
      else {
        $("a.make-shadow").each(function() {  
          i++;
          $(this).attr('rel', '');
          $(this).removeClass('shadow-active');
          var uri = $(this).attr('href');
          uri = updateQueryStringParameter(uri, 'pc', '');
          $(this).attr('href', uri);
        });
      }
      // Trigger sahdowbox's own reset logic, but only if there were links
      // found that could need attention.
      if (i > 0) {
        resetShadowbox();
      }
    }
  }
  resetShadowbox = function() {
    if (typeof Shadowbox !== 'undefined') {
      Shadowbox.clearCache();
      Shadowbox.setup();
    }
  }
  $(window).load(function() {
    // When the window load we do a initial check.
    window.loaded = true;
    window.ShadowMode = 'none';
    checkMakeShadow();
    // Once the window is loaded we can also detect any Juicebox instances. If
    // we find any then we also set an shadobox check event that's specific to
    // Juicebox.
    if (typeof juicebox_instances !== 'undefined') {
      // drupal_jb = juicebox_instances[0];
      // If we have a Juicebox we also force a re-scan of the dom for potential
      // shadowbox links. We don't do a checkMakeShadow as it only triggers the
      // re-scan when the viewport changes, instead we do a direct
      // drupal_jb.onImageChange = function(e) {
      //   doMakeShadow(window.ShadowMode);
      // };
    }
  });
  // When the window resizes we do a re-check.
  $(window).resize(debouncer(function() {
    checkMakeShadow();
  }, 500)); 
})(jQuery);


// Fade in/out our menu background when the menu itself is "sticky". This
// function is called wenever an element is made sticky or unsticky via the 
// sticky plugin below.
(function($) {
  stickMore = function(state,stickDiv) {
    if (stickDiv.attr("id") == "region-menu") {
      if (state == 'unstick') {
        $("#dyn-menu-back").fadeOut(600);
      }
      if (state == 'stick') {     
        $("#dyn-menu-back").fadeIn(600);
      }
    }
  }
})(jQuery);


// Sticky Plugin
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function($) {
    var defaults = {
            topSpacing: 0,
            bottomSpacing: 0,
            className: 'is-sticky',
            wrapperClassName: 'sticky-wrapper'
        },
        $window = $(window),
        $document = $(document),
        sticked = [],
        windowHeight = $window.height(),
        scroller = function() {
            var scrollTop = $window.scrollTop(),
                documentHeight = $document.height(),
                dwh = documentHeight - windowHeight,
                extra = (scrollTop > dwh) ? dwh - scrollTop : 0;
            for (var i = 0; i < sticked.length; i++) {
                var s = sticked[i],
                    elementTop = s.stickyWrapper.offset().top,
                    etse = elementTop - s.topSpacing - extra;
                if (scrollTop <= etse) {
                    if (s.currentTop !== null) {
                        s.stickyElement
                            .css('position', '')
                            .css('top', '')
                            .removeClass(s.className);
                        s.stickyElement.parent().removeClass(s.className);
                        s.currentTop = null;
                        stickMore('unstick',s.stickyElement);
                    }
                }
                else {
                    var newTop = documentHeight - s.stickyElement.outerHeight()
                        - s.topSpacing - s.bottomSpacing - scrollTop - extra;
                    if (newTop < 0) {
                        newTop = newTop + s.topSpacing;
                    } else {
                        newTop = s.topSpacing;
                    }
                    if (s.currentTop != newTop) {
                        s.stickyElement
                            .css('position', 'fixed')
                            .css('top', newTop)
                            .addClass(s.className);
                        s.stickyElement.parent().addClass(s.className);
                        s.currentTop = newTop;
                        stickMore('stick',s.stickyElement);
                    }
                }
            }
        },
        resizer = function() {
            windowHeight = $window.height();
        },
        methods = {
            init: function(options) {
                var o = $.extend(defaults, options);
                return this.each(function() {
                    var stickyElement = $(this);

                    stickyId = stickyElement.attr('id');
                    wrapper = $('<div></div>')
                        .attr('id', stickyId + '-sticky-wrapper')
                        .addClass(o.wrapperClassName);
                    stickyElement.wrapAll(wrapper);
                    var stickyWrapper = stickyElement.parent();
                    stickyWrapper.css('height', stickyElement.outerHeight());
                    sticked.push({
                        topSpacing: o.topSpacing,
                        bottomSpacing: o.bottomSpacing,
                        stickyElement: stickyElement,
                        currentTop: null,
                        stickyWrapper: stickyWrapper,
                        className: o.className
                    });
                });
            },
            update: scroller
        };

    // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
    if (window.addEventListener) {
        window.addEventListener('scroll', scroller, false);
        window.addEventListener('resize', resizer, false);
    } else if (window.attachEvent) {
        window.attachEvent('onscroll', scroller);
        window.attachEvent('onresize', resizer);
    }

    $.fn.sticky = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.sticky');
        }
    };
    $(function() {
        setTimeout(scroller, 0);
    });
})(jQuery);


// Load sticky div for sidebar
(function($) {
  $(window).load(function(){
    if ($(window).width() > 760 && $(window).height() > 500 && !unhappyBrowser()) {
      $('#region-sidebar-second .region-inner').sticky({ topSpacing: 75, bottomSpacing: 150, wrapperClassName: 'sticky-menu-wrapper' });
      $('#region-menu').sticky({ topSpacing: 10, wrapperClassName: 'sticky-main-menu-wrapper' });
    }
  });
})(jQuery);


// Helper to wrap a given function with a timeout that ensures it can only
// fire under a controlled frequency (independed of how often this helper is
// called).
function debouncer( func , timeout ) {
   var timeoutID , timeout = timeout || 200;
   return function () {
      var scope = this , args = arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
          func.apply( scope , Array.prototype.slice.call( args ) );
      } , timeout );
   }
}


// Helper to make sure we are not using an unhappy browser (<IE8)
function unhappyBrowser() {
  var rv = 0;
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  // If we are at IE 9 or higher, then we are not unhappy
  if ( rv >= 9.0 || rv == 0 )
    return 0;
  // If not, we are unhappy and return the version number
  else
    return rv;
}


// Helper to manipulate query strings.
function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
  separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    if (value == '') {
      return uri.replace(re, '');
    }
    else {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
  }
  else {
    return uri + separator + key + "=" + value;
  }
}
