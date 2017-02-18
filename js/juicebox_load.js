// Main gallery loading logic.
$(function(){
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  new juicebox({
    containerId: "juicebox-container",
    configUrl: vars['conf'] + '?v=1',
    galleryWidth: "100%",
    galleryHeight: "100%",
    backgroundColor: "#555"
  });
});

// Gallery image click tracking.
$(function(){
  $(document).ready(function() {
    var jb = window.juicebox_instances[0];
    // Check that we have Juicebox and Analytics data loaded.
    if (typeof jb !== 'undefined' && typeof ga !== 'undefined') {
      jb.onImageChange = function(e){
        var jb_info = this.getImageInfo(e.id);
        // _gaq.push(['_trackEvent', 'Juicebox', 'View', jb_info.title]);
        ga('send', 'event', 'Juicebox', 'View', jb_info.title);
      };
    }
  });
});
