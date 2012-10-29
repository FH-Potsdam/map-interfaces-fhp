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
 * Im Beispiel verwenden wir als Quelle für unseren TileLayer eine CloudMade Karte.
 * 
 * L.tileLayer('url', { options }) erzeugt einen neuen TileLayer
 * .addTo(Objekt) fügt den neuen Layer unserer Karte hinzu, im Beispiel "map"
 * 
 */

L.tileLayer('http://{s}.tile.cloudmade.com/5c5f709891f240bbba32d5f42f1926ec/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);


/**
 * Step 3: Zu unserer eben hinzugefügten Karten wird nun ein Marker ergänzt
 * L.marker([Latitude, Longitude], [options]) erstellt einen Marker an der Position Latitude/Longitude.
 * mit addMap(map) wird dieser Marker dann zu unserer Karte hinzugefügt.
 * Mit customIcon können wir dem Marker ein eigenes Aussehen verleihen.
 * Hierzu müssen wir ein L.Icon Objekt anlegen und Bilder für Icon und Shadow 
 * definieren sowie die dazugehörigen Ankerpunkte.
 */

var customIcon = new L.Icon( {
	iconUrl: '../img/burger-marker.png',
    iconSize: [53, 51],
    iconAnchor: [27, 51],
    popupAnchor: [0, 0],
    shadowUrl: '../img/burger-shadow.png',
    shadowSize: [83, 51],
    shadowAnchor: [27, 51]
});

L.marker([52.52, 13.4], {icon: customIcon }).addTo(map);