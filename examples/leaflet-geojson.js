/* Map Interfaces 2012 – FH Potsdam
 * 
 * Basic Leaflet Setup als Beispielprojekt
 * 
 * @author	Marcus Paeschke
 * @licence	cc-by-sa
 */

var cartodb_apikey = "f909b68fa06f5aad09cddb976eeda7eddedee8a6";


/**
 * Step 1: Konfiguration unserer Karten-Layer
 */

var onEachFeature = function (feature, layer) {
	// Hier können wir eingreifen und Interaktionen hinzufügen, beispielsweise Popups
	if (feature.properties && feature.properties.name) {
		layer.bindPopup(feature.properties.name);
	}
}


var layer = {
	basemap1 : L.tileLayer('http://{s}.tile.cloudmade.com/5c5f709891f240bbba32d5f42f1926ec/997/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	}),
	basemap2 : L.tileLayer('http://{s}.tile.cloudmade.com/5c5f709891f240bbba32d5f42f1926ec/999/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	}),
	tiles : L.tileLayer('http://marcus.maps-fhp.de:8181/tiles/fhpinfrastructure/{z}/{x}/{y}.png?map_key=' + cartodb_apikey),
	geojson : L.geoJson(),
	geojsonInteractive : L.geoJson(null, {
		onEachFeature : onEachFeature
	})
}


/**
 * Step 2: Zuerst muss Leaflet initialisiert werden, der Einfachheit halber speichern wir das Objekt in der Variable "map"
 */
var map = L.map('map', {
	center : [52.4125, 13.051],
	zoom : 17,
	layers : [layer.basemap1, layer.geojson]
});

/**
 * Step 3: LayerSwitch, erst Konfiguration und dann das Objekt erstellen und der Karte hinzufügen
 */

layer.config = {
	base : {
		"Roadmap" : layer.basemap1,
		"Midnight" : layer.basemap2			
	},
	overlay : {
		"Simple GeoJSON" : layer.geojson,
		"Interactive GeoJSON": layer.geojsonInteractive,
		"Tiles" : layer.tiles
	}	
}

var layerswitch = L.control.layers(layer.config.base, layer.config.overlay).addTo(map);


/**
 * Using jQuery to load GeoJSON data
 */

$(document).ready(function () {
	var query = 'SELECT * FROM fhpinfrastructure';
	$.getJSON('http://marcus.maps-fhp.de:8080/api/v1/sql?format=GeoJSON&q=' + encodeURIComponent(query), function (data) {
		layer.geojson.addData(data);
		layer.geojsonInteractive.addData(data);
	});	
});