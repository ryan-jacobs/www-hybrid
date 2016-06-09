// Collapse the navbar on scroll
function collapseNavbar() {
  if ($(".navbar").offset().top > 50) {
    $(".navbar-fixed-top").addClass("top-nav-collapse");
  }
  else {
    $(".navbar-fixed-top").removeClass("top-nav-collapse");
  }
}
$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

// The intro height is set to 100% in CSS. This can cause some "jumpy" issus for
// browsers that dynamically add/remove navigation bars that change the window
// height (based on scroll speed and position - e.g. Android Firefox). This
// seems to be due to conflicts with the fixed navbar, and can be eliminated by
// ensuring that the intro div has a specific px (non %) height.
$(function() {
  $('header.intro').css('height', $(window).height());
});
// Since we are setting an specific px height for the intro, we also need to
// recalculate it during a window resize, but only if the aspect ratio changes
// (triggering this logic on a simple height change only propogates the initial
// problem).
var width = $(window).width();
$(window).resize(function() {
  if ($(this).width() != width) {
    width = $(this).width();
    $('header.intro').css('height', $(window).height());
  }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      var href = $anchor.attr('href');
      // Globally store our target hash value so that we can access it after the
      // animation is complete and set the hash in the URL.
      window.targetHash = href.substring(href.indexOf('#'));
      $('html, body').stop().animate({
          scrollTop: $(href).offset().top
      }, 1500, 'easeInOutExpo', function() {window.location.hash = window.targetHash});
      event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  if ($(this).attr('class') != 'dropdown-toggle active' && $(this).attr('class') != 'dropdown-toggle') {
    $('.navbar-toggle:visible').click();
  }
});

// Custom additions.
$(function() { 
  // Manually launch the fancybox with our own click event so that we can ensure
  // it's only triggered on large-width breakpoints.
  $(".fancybox").click(function() {
    // Make sure that our test div, which has classes to tie its visibility to
    // specific bootstrap breakpoints, is visible.
    if (!isMobile()) {
      var href = $(this).attr('href');
      $.fancybox.open(
        [{
          href: href,
          type: 'iframe',
        },
        ], {
          padding: 0,
          width: "90%",
          height: "90%",
          helpers: {
            overlay: {
              locked: false
            }
          }
        }
      );
      return false;
    }
  });
});

// Helper to test for width <= mobile breakpoint.
function isMobile() {
  return $('#mobileTest').is(':hidden');
}

// Special handeling for tabs associated with fragments.
$(function(){
  // If we load a page with a fragment representing a tab, open that tab and
  // scroll to the section it's in.
  var hash = window.location.hash;
  if (hash && $('ul.nav-tabs a[href="' + hash + '"]').length) {
    var element = $('ul.nav-tabs a[href="' + hash + '"]');
    var jumpto = element.closest('section');
    element.tab('show')
    $('html,body').animate({scrollTop: jumpto.offset().top});
  }
  // If a user clicks on a tab be sure to set the hash in the URL without
  // triggering any scrolling.
  $('.nav-tabs a').click(function (e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop() || $('html').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});

var map = AmCharts.makeChart( "chartdiv", {
  type: "map",
  "theme": "light",
  colorSteps: 10,
  dataProvider: {
    map: "usaLow",
    areas: [ {
      id: "US-AL",
      value: 4447100
    }, {
      id: "US-AK",
      value: 626932
    }, {
      id: "US-AZ",
      value: 5130632
    }, {
      id: "US-AR",
      value: 2673400
    }, {
      id: "US-CA",
      value: 33871648
    }, {
      id: "US-CO",
      value: 4301261
    }, {
      id: "US-CT",
      value: 3405565
    }, {
      id: "US-DE",
      value: 783600
    }, {
      id: "US-FL",
      value: 15982378
    }, {
      id: "US-GA",
      value: 8186453
    }, {
      id: "US-HI",
      value: 1211537
    }, {
      id: "US-ID",
      value: 1293953
    }, {
      id: "US-IL",
      value: 12419293,
      selectable: true,
      href: 'http://www.ryan-jacobs.net/photos/albums/Nature'
    }, {
      id: "US-IN",
      value: 6080485
    }, {
      id: "US-IA",
      value: 2926324
    }, {
      id: "US-KS",
      value: 2688418
    }, {
      id: "US-KY",
      value: 4041769
    }, {
      id: "US-LA",
      value: 4468976
    }, {
      id: "US-ME",
      value: 1274923
    }, {
      id: "US-MD",
      value: 5296486
    }, {
      id: "US-MA",
      value: 6349097
    }, {
      id: "US-MI",
      value: 9938444
    }, {
      id: "US-MN",
      value: 4919479
    }, {
      id: "US-MS",
      value: 2844658
    }, {
      id: "US-MO",
      value: 5595211
    }, {
      id: "US-MT",
      value: 902195
    }, {
      id: "US-NE",
      value: 1711263
    }, {
      id: "US-NV",
      value: 1998257
    }, {
      id: "US-NH",
      value: 1235786
    }, {
      id: "US-NJ",
      value: 8414350
    }, {
      id: "US-NM",
      value: 1819046
    }, {
      id: "US-NY",
      value: 18976457
    }, {
      id: "US-NC",
      value: 8049313
    }, {
      id: "US-ND",
      value: 642200
    }, {
      id: "US-OH",
      value: 11353140
    }, {
      id: "US-OK",
      value: 3450654
    }, {
      id: "US-OR",
      value: 3421399
    }, {
      id: "US-PA",
      value: 12281054
    }, {
      id: "US-RI",
      value: 1048319
    }, {
      id: "US-SC",
      value: 4012012
    }, {
      id: "US-SD",
      value: 754844
    }, {
      id: "US-TN",
      value: 5689283
    }, {
      id: "US-TX",
      value: 20851820
    }, {
      id: "US-UT",
      value: 2233169
    }, {
      id: "US-VT",
      value: 608827
    }, {
      id: "US-VA",
      value: 7078515
    }, {
      id: "US-WA",
      value: 5894121
    }, {
      id: "US-WV",
      value: 1808344
    }, {
      id: "US-WI",
      value: 5363675
    }, {
      id: "US-WY",
      value: 493782
    } ]
  },

  areasSettings: {
    autoZoom: false
  },

  valueLegend: {
    right: 10,
    minValue: "little",
    maxValue: "a lot!"
  },

  "export": {
    "enabled": true
  }

} );

map.addListener("clickMapObject", function (event) {
  var href = event.mapObject.href;
  if (!isMobile()) {
    $.fancybox.open(
      [{
        href: href,
        type: 'iframe',
      },
      ], {
        padding: 2,
        width: "90%",
        height: "90%",
        helpers: {
          overlay: {
            locked: false
          }
        }
      }
    );
    return false;
  }
  else {
    window.location.href = href;
  }
});