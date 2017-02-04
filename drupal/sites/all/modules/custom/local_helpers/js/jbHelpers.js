// See that we have a juicebox instance to work with (get the first if there are
// multiple)
(function($) {
  $(document).ready(function() {
    var drupal_jb = window.juicebox_instances[0];
    // Check that we have Juicebox and Analytics data loaded.
    if (typeof drupal_jb !== 'undefined' && typeof ga !== 'undefined') {
      drupal_jb.onImageChange = function(e){
        var jb_info = this.getImageInfo(e.id);
        // _gaq.push(['_trackEvent', 'Juicebox', 'View', jb_info.title]);
        ga('send', 'event', 'Juicebox', 'View', jb_info.title);
      };
    }
  });
})(jQuery);