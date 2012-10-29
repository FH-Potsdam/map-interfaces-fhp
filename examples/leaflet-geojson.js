/* Map Interfaces 2012 – FH Potsdam
 * 
 * Basic Leaflet Setup als Beispielprojekt
 * 
 * @author	Marcus Paeschke
 * @licence	cc-by-sa
 */

var cartodb_apikey = "f909b68fa06f5aad09cddb976eeda7eddedee8a6";


/**
 * Step 1: Zuerst muss Leaflet initialisiert werden, der Einfachheit halber speichern wir das Objekt in der Variable "map"
 * 
 * L.map('container-id', { options }) erzeugt ein neues Kartenobjekt und injiziert es in das DOM-Element mit der ID "container-id", 
 * bzw. im Beispiel in unseren DIV-Container mit der ID "map"
 * 
 * Optional kann man den Kartenausschnitt auch später mit .setView verändern.
 * .setView([x,y], zoom) zentriert unsere neue Karte an den angegebenen X-Y-Koordinaten mit der Zoomstufe 13
 */
var map = L.map('map', {
	center : [52.4125, 13.051],
	zoom : 17
});


var layer = {
	basemap : L.tileLayer('http://{s}.tile.cloudmade.com/5c5f709891f240bbba32d5f42f1926ec/997/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	}),
	geojson : L.geoJson()
}

layer.basemap.addTo(map);
layer.geojson.addTo(map);


/**
 * Using jQuery to load GeoJSON data
 */

$(document).ready(function () {
	var query = 'SELECT * FROM fhpinfrastructure';
	$.getJSON('http://marcus.maps-fhp.de:8080/api/v1/sql?format=GeoJSON&q=' + encodeURIComponent(query), function (data) {
		layer.geojson.addData(data);
	});	
});