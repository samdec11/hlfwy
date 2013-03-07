function display_map(lat, longi, zoom) {
  var mapOptions = {
    center: new google.maps.LatLng(lat, longi),
    zoom: zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var canvas = $('#map_canvas')[0];
  map = new google.maps.Map(canvas, mapOptions);
}

function add_marker(lat, longi, title) {
  var latlng = new google.maps.LatLng(lat, longi);
  var marker = new google.maps.Marker({position: latlng, map: map, title: title});
  markers.push(marker);
}

function clear_markers() {
  _.each(markers, function(m){m.setMap(null);});
  markers = [];
}