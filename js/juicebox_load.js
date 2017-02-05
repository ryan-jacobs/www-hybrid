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