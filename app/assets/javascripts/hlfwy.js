var map;
var geoloc;
var markers = [];
var addresses = [];
var search;

$(function() {
  $('#number').on('change', change_form);
  $('#enter').click(collect_addresses);
  $('#fetch').click(yelp_search);
  $('#new_search').click(reset_all);
});

function reset_all() {
  $('.results_row').remove();
  $('#results').hide();
  $('#new_search').hide();
  $('#enter').hide();
  $('#address_form').show();
  clear_markers();
}

function change_form() {
  $('#enter').show();
  var num = parseInt($('#number').val());
  $('.address, .address_label').remove();
  for(var i = 0; i < num; i++) {
    var address_label = $("<label for='address' class='address_label'>");
    var address_field = $("<textarea class='address' name='address'>");
    address_label.text('Address ' + (i + 1));
    $('#enter').before([address_label, address_field]);
  }
  $('.address').first().focus();
}

function collect_addresses(x) {
  x.preventDefault();
  _.each($('.address'), add_address_to_array);
  clear_address_form();
  geocode();
}

function add_address_to_array(address) {
  addresses.push($(address).val());
}

function clear_address_form() {
  $('.address, .address_label').remove();
  $('#number').val("");
  $('#address_form').hide();
  $('#search_form').show();
  $('#search').focus();
}

function geocode() {
  var token = $('#address_form input[name=authenticity_token]').val();
  $.ajax({
      dataType: 'json',
      type: 'get',
      url: '/home/geocode',
      data: { authenticity_token:token, addresses:addresses }
    }).done(process_location);

  return false;
}

function process_location(loc) {
  geoloc = loc;
  display_map(geoloc[0], geoloc[1], 13);
  add_marker(geoloc[0], geoloc[1], 'hlfwy');
}

function yelp_search(x) {
  x.preventDefault();
  var token = $('#search_form input[name=authenticity_token]').val();
  search = $('#search').val();
  $('#search').val('');
  $.ajax({
      dataType: 'json',
      type: "get",
      url: "/home/search_yelp",
      data: { authenticity_token:token, 'search[search]':search, 'search[location]':geoloc }
    }).done(process_results);
  return false;
}

function process_results(result) {
  _.each(result.businesses, show_results);
}

function show_results(business) {
  $('#search_form').hide();
  $('#results').show();
  $('#new_search').show();
  var row = $("<tr class='results_row'>");
  var td1 = $('<td>');
  var td2 = $('<td>');
  var td3 = $('<td>');
  var td4 = $('<td>');
  var td5 = $('<td>');
  var link = $('<a>');

  var name = business.name;
  var url = business.url;
  var phone = business.display_phone;
  var rating = business.rating;
  var category = business.categories[0][0];
  var address = business.location.address[0];

  link.text(name);
  link.attr('href', url);
  link.attr('target', '_blank');

  td1.append(link);
  td2.text(category);
  td3.text(rating);
  td4.text(phone);
  td5.text(address);
  row.append([td1, td2, td3, td4, td5]);
  $('#results').append(row);
}