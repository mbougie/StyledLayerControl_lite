///// !!! before we begin //////////////////////
///// You can reference the code on my github repo mbougie/StyledLayerControl_lite on the glue_leaflet_discussion branch


//// baselayers
var satellite = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var topo_map = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}');


//// !!------layers------!!
//// these tiles are created in google earth engine and store in a bucket on google cloud platform
//// https://console.cloud.google.com/storage/browser/www.mattbougie.com/marginal_lsl_orange/?project=glue-222822
lsl_url = 'https://storage.googleapis.com/www.mattbougie.com/marginal_lsl_orange/{z}/{x}/{y}'
var lsl = new L.tileLayer(url_obj.lsl.url);

ral_url = 'https://storage.googleapis.com/www.mattbougie.com/s35_abandonment_final/{z}/{x}/{y}'
var ral = new L.tileLayer(url_obj.ral.url);

hal_url = 'https://storage.googleapis.com/www.mattbougie.com/marginal_ral_blue/{z}/{x}/{y}'
var hal = new L.tileLayer(url_obj.hal.url);



var bounds = [
    [0, -180], // Southwest coordinates
    [75, 10]  // Northeast coordinates
];


/// !!------Instantiates a map object given an instance of a <div> HTML element------!!
/// take a look at the class = "leaflet-control-container" in the browser
var map = L.map('map', {
	center: [36.0902, -95.7129],
	layers: [topo_map, lsl],
	zoom: 5,
	minZoom: 5,
	maxZoom: 12,
	maxBounds: bounds
});

console.log('map------------------------------------', map)


//// !! layer control (native) !! ////////////////////////
//// create a Layers Control and add it to the map

////--- uncomment below ----------------------------------
// var baseLayers = {
//     "Reference map" : topo_map
// };

// var overlays = {
//     "Low capability land": lsl
// };


// var control = L.control.layers(baseLayers, overlays);
// console.log('control ------------------------------------', control)

// var control_and_map = L.control.layers(baseLayers, overlays).addTo(map);
// console.log('control_and_map ------------------------------------', control_and_map)

/////////////////////////////////////////////////////////////




//// !! layer control !! //////////////////////////////////

//--- uncomment below ----------------------------------
// var baseLayers = [
//                  {
// 				    groupName : "Base Maps",
// 				    expanded : false,
// 					layers    : {
// 						'Satellite imagery' : satellite,
// 						"Reference map" : topo_map
// 					}
//                 }							
// ];

// var overlays = [
// 				 {
// 					groupName : "Marginal Land Data",
// 					expanded : true,
// 					layers    : { 
// 						'Low capability land': lsl,
// 						'Recently abandoned land': ral,
// 						'Formerly irrigated land': hal
// 					}	
//                  }						 
// ];


// var options = {
// 	container_width 	: "250px",
// 	group_maxHeight     : "80px",
// 	collapsed			: false,
// 	exclusive       	: true
// };


////--- comment/uncomment below ----------------------------------

/// take a look at the map object before control is added
// console.log('map object BEFORE control added to map object ------------------------------------', map)
// console.log('map._controlContainer ------------------------------------', map._controlContainer)

// //////////// **** control from plugin **** /////////////////////////////////

///// create the control object from the plugin script
var control = L.Control.styledLayerControl(baseLayers, overlays, options);
console.log('control------------------------------------', control)

//add control object to map
map.addControl(control);
console.log('map object AFTER control added to map object ------------------------------------', map)
console.log('map._controlContainer ------------------------------------', map._controlContainer)


/////////////// **** control from modified plugin **** /////////////////////////////////
////NOTE: need to change the css and js reference files !!!




