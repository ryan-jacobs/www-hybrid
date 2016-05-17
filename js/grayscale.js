/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
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
$(document).ready(function() { 
  // Manually launch the fancybox with our own click event so that we can ensure
  // it's only triggered on large-width breakpoints.
  $(".fancybox").click(function() {
    // Make sure that our test div, which has classes to tie its visibility to
    // specific bootstrap breakpoints, is visible.
    if (!$('#desktopTest').is(':hidden')) {
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
