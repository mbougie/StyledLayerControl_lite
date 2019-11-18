// var map = new L.Map('map', {
//     'center': [0, 0],
//     'zoom': 0

// });


//// baselayers
var satellite = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var topo_map = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}');
var dark_map = new L.TileLayer('https://{s}.baseLayers.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png');

//// layers


lsl_url = 'https://storage.googleapis.com/www.mattbougie.com/marginal_lsl_orange/{z}/{x}/{y}'
var lsl = new L.tileLayer(url_obj.lsl.url);

ral_url = 'https://storage.googleapis.com/www.mattbougie.com/s35_abandonment_final/{z}/{x}/{y}'
var ral = new L.tileLayer(url_obj.ral.url);

hal_url = 'https://storage.googleapis.com/www.mattbougie.com/marginal_ral_blue/{z}/{x}/{y}'
var hal = new L.tileLayer(url_obj.hal.url);



// console.log(url_obj)
// for (var key in url_obj) {
// 	console.log(key);
//     console.log(url_obj[key]);
// }



var bounds = [
    [0, -180], // Southwest coordinates
    [75, 10]  // Northeast coordinates
];

var map = L.map('map', {
	center: [36.0902, -95.7129],
	layers: [topo_map, lsl],
	zoom: 5,
	minZoom: 5,
	maxZoom: 12,
	maxBounds: bounds
});


var baseLayers = [
                 {
				    groupName : "Base Maps",
				    expanded : false,
					layers    : {
						'Satellite imagery' : satellite,
						"Reference map" : topo_map,
						"Dark map": dark_map
					}
                }							
];
		
var overlays = [
				 {
					groupName : "Marginal Land Data",
					expanded : true,
					layers    : { 
						'<span>Low capability land</span><span class = "download"><span class = "info_circle" id="lsl"></span>': lsl,
						'<span>Recently abandoned land</span><span class = "download"><span class = "info_circle" id="ral"></span>': ral,
						'<span>Formerly irrigated land</span><span class = "download"><span class = "info_circle" id="ral"></span>': hal
					}	
                 }						 
];


var options = {
	container_width 	: "250px",
	group_maxHeight     : "80px",
	collapsed			: false,
	exclusive       	: true
};


var control = L.Control.styledLayerControl(baseLayers, overlays, options);
map.addControl(control);







////// new stuff ////////////////////////////////
var customControl = L.Control.extend({
 
  options: {
    position: 'topleft' 
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },
 
onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom yo');
    container.style.backgroundColor = 'white';
    container.style.width = '35px';
    container.style.height = '35px';
 
    container.onclick = function(){
    $('#mymodal').modal('show');
    }
    return container;
  }
 
});	

map.addControl(new customControl());


//// create a click event for the icon in layer control
$(".info_circle, .download").click(function(){
	///open modal
   $('#mymodal').modal('show');

   	///remove the label click checkbox ability so clicking on icon doesn't check the box.
   	return false; 
   
});	