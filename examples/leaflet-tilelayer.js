/* Map Interfaces 2012 – FH Potsdam
 * 
 * Leaflet Marker Setup als Beispielprojekt
 * 
 * @author	Sebastian Meier
 * @licence	cc-by-sa
 */


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
	center : [52.52, 13.4],
	zoom : 13
});


/**
 * Step 2: Wir haben nun ein leeres Kartenobjekt und müssen eine Karte hinzufügen. 
 * Da Karten im Internet in der Regel in kleine Schnipsel, sogenannte "Tiles" (von Kacheln), 
 * aufgeteilt sind, erzeugen wir zuerst einen TileLayer.
 * 
 * In diesem Beispiel werden wir für verschiedene Kartenanbieter Layer anlegen durch die wir 
 * später über ein "Control" durchwechseln können.
 * 
 * L.tileLayer('url', { options }) erzeugt einen neuen TileLayer
 * 
 */

//Cloudmade
var clm = L.tileLayer('http://{s}.tile.cloudmade.com/5c5f709891f240bbba32d5f42f1926ec/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
});

//OpenStreetMap
var osm = new L.TileLayer('http://{s}.tile.osmosnimki.ru/kosmo/{z}/{x}/{y}.png');

//OpenStreetmap
var mpn = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

//MapQuest
var qst = new L.TileLayer('http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {attribution:'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'});

//Scanex
var wms = new L.TileLayer.WMS('http://wms.latlon.org/', {layers:'irs', crs: L.CRS.EPSG4326});

//Google-Roadmap
var gmr = new L.Google("ROADMAP");

//Google-Satellite
var gms = new L.Google("SATELLITE");

//Google-Hybrid
var gmh = new L.Google("HYBRID");

//Stamen: Toner
var sto = new L.StamenTileLayer("toner");

//Stamen: Terrain
var ste = new L.StamenTileLayer("terrain");

//Stamen: WaterColor
var stw = new L.StamenTileLayer("watercolor");

//TileMill via MapBox
var tml = new wax.leaf.connector({'http://a.tiles.mapbox.com/v3/juli84.map-xf9ni6a1.jsonp'});

/**
 * Die einzelnen Layer werden in Variablen gespeichert und später über die "Control" automatisch
 * zur Karte hinzugefügt, damit zu beginn ein Layer angezeigt wird fügen wir eine der Karten
 * mit "addLayer([Layer-Variable]) der Karte hinzu."
 */

map.addLayer(osm);

map.addControl(new L.Control.Layers({'TileMill-via-MapBox':tml, 'CloudMade':clm, 'OSM':osm, 'Mapnik':mpn, 'MapQuest':qst, 'Scanex':wms, 'Google-Hybrid':gmh, 'Google-Satellite':gms, 'Google-Roadmap':gmr, 'Stamen-Toner':sto, 'Stamen-Terrain':ste, 'Stamen-Watercolor':stw}));
