/* Map Interfaces 2012 – FH Potsdam
 * 
 * Basic Leaflet Setup als Beispielprojekt
 * 
 * @author	Marcus Paeschke
 * @licence	cc-by-sa
 */

$(document).ready(function () {
	


	/**
 * Step 1: Zuerst muss Leaflet initialisiert werden, der Einfachheit halber speichern wir das Objekt in der Variable "map"
 */
	var map = L.map('map', {
		center : [52.52, 13.4],
		zoom : 13
	});


	/**
 * Step 2: Im Beispiel verwenden wir als Quelle für unseren TileLayer eine CloudMade Karte.
 * 
 * L.tileLayer('url', { options }) erzeugt einen neuen TileLayer
 * .addTo(Objekt) fügt den neuen Layer unserer Karte hinzu, im Beispiel "map"
 * 
 */

	L.tileLayer('http://{s}.tile.cloudmade.com/5c5f709891f240bbba32d5f42f1926ec/997/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	}).addTo(map);


	/**
 * Step 3: Im folgenden Beispiel wollen wir eine kleine App bauen, die es mir ermöglicht einen der Berliner Bezirke auszuwählen und alle Haltestellen des öffentlichen Nahverkehrs in diesem Bezirk anzusehen.
 * 
 * Dazu bereiten wir uns zuerst ein paar Variablen für Leaflet-Ebenen vor.
 * Die Variable layer.bezirk soll später den GeoJSON-Layer mit dem Umriss des Bezirks enthalten
 * Die Variable layer.stops wird eine FeatureGroup, wo wir alle Marker zu den Haltestellen zwischenspeichern
 */
	
	var layer = {
		bezirk : null,
		stops : L.featureGroup()
	}


	/**
 * Step 4: Hier arbeiten wir nun mit selbstgebauten API Anfragen und der CartoDB-SQL-API
 * 
 * Als erstes lassen wir uns eine Liste der Berliner Bezirke ausgeben.
 * Wir werden die Liste nutzen, um eine vorher im HTML Dokument hinzugefügte SELECT-Box mit Inhalten zu befüllen.
 * 
 * Die Anfragen an die CartoDB-SQL-API werden logischerweise auch in der SQL-Syntax geschrieben. (SQL ist eine eigene Sprache zur Datenbank-Abfrage)
 * Im Beispiel rufen wir die Spalten "cartodb_id" und "name" aus der Tabelle "berlin_bezirke" ab und ordnen das Ergebnis alphabetisch nach der Spalte "name".
 * Die Formulierung dieser Datenbank-Abfrage speichern wir zunächst in einer Variable, ohne die Anfrage sofort auszuführen.
 */

	var query = 'SELECT cartodb_id, name FROM berlin_bezirke ORDER BY name';
	
	/**
 * Step 5: Jetzt wo die Anfrage formuliert ist, werden wir jQuery benutzen um die Anfrage an die Datenbank zu schicken und das Ergebnis abzuwarten.
 * 
 * Wichtig ist, dass die Abfrage an die richtige URL geschickt wird, und damit die Anfrage lesbar ankommt, muss sie noch so kodiert werden, dass sie URL-Kompatibel ist.
 * Dazu benutzen wir encodeURIComponent um das eigentliche "query" zu kodieren.
 * 
 * An der Stelle "function (response) {}" übergeben wir eine sogenannte Callback-Funktion, die aufgerufen wird, sobald die Antwort vom Datenbank-Server eingetroffen ist.
 */

	$.getJSON('http://marcus.maps-fhp.de:8080/api/v1/sql?q='+ encodeURIComponent(query), function(response) {
		$select = $("#select-bezirk");
		// Für jeden Bezirk den wir in der Antwort vorfinden, fügen wir der Select-Box eine neue Option hinzu
		$.each(response.rows, function (index, obj) {
			$select.append('<option value="' + obj.cartodb_id + '">' + obj.name + '</option>');
		});
		// Hier definieren wir einen Event-Handler (wieder eine Callback-Funktion) die immer dann aufgerufen wird, wenn der Benutzer die Auswahl in der Select-Box verändert.
		$select.change(updateMap);

	});
	
	// Diese Funktion ist unser Eevent-Handler (ausgelöst durch eine Auswahl in der Select-Box)
	var updateMap = function (event) {
		// Zuerst lesen wir aus dem Event, welchen Bezirk der Benutzer ausgewählt hat
		var cartodb_id_bezirk = event.target.value;
		
		// dann überprüfen wir, ob die Auswahl auch Sinn macht.
		if(cartodb_id_bezirk != "") {
		
			// Mit dem Bezirk rufen wir jetzt alle vorhandenen Daten (inkl. der Geometrie) zu dem ausgewählten Bezirk ab.
			// man beachte das angehängte &format=geojson in der URL
			// man beachte außerdem die Verwendung von PostGIS-Funktionen (ST_...) innerhalb des SQL-Queries
			// mit der Funktion ST_Centroid berechnen wir die geometrische Mitte des Bezirks
			$.getJSON('http://marcus.maps-fhp.de:8080/api/v1/sql?q='+ encodeURIComponent("SELECT *, ST_X(ST_Centroid(the_geom)) AS center_x, ST_Y(ST_Centroid(the_geom)) AS center_y FROM berlin_bezirke WHERE cartodb_id = '" + cartodb_id_bezirk + "'") + "&format=geojson", function(response) {
				if(response && response.features && response.features[0]) {
					// wurde vorher bereits ein Bezirk angezeigt, entfernen wir den zunächst von der Karte
					layer.bezirk && map.removeLayer(layer.bezirk);
					// jetzt erzeugen wir einen neuen GeoJSON Layer mit dem Umriss des Bezirks
					layer.bezirk = L.geoJson(response.features[0]);
					// anschließend wird der Bezirk der Karte hinzugefügt (damit er auch angezeigt wird)
					layer.bezirk.addTo(map);
					// hier suchen wir uns die Mitte des Bezirks heraus und verschieben die Karte zum neuen Mittelpunkt (damit der Benutzer auch sieht, was er ausgewählt hat)
					var props = response.features[0].properties;
					map.panTo([props.center_y, props.center_x]);				
				
				} else {
					console.log('Error loading shape from Bezirk');
				}
			});
		
			// Mit einer 2. Abfrage lesen wir alle Haltestellen innerhalb des Bezirks aus
			// dieses SQL-Query ist schon relativ komplex - hier werden die Daten aus der einen Tabelle genommen und mit den Daten aus der anderen Tabelle verschnitten
			// wie suchen uns also zuerst die Umrisse des Bezirks heraus und laden dann alle Haltestellen herunter die innerhalb dieser Umrisse sind (ST_Contains)
			$.getJSON('http://marcus.maps-fhp.de:8080/api/v1/sql?q='+ encodeURIComponent("SELECT t2.* FROM berlin_bezirke AS t1, vbb_stops AS t2 WHERE t1.cartodb_id = '" + cartodb_id_bezirk + "' AND ST_Contains(t1.the_geom, t2.the_geom)") + "&format=geojson", function(response) {			
				map.removeLayer(layer.stops);
				if(response && response.features) {
					// Bevor wir die neuen Haltestellen anzeigen, entfernen wir die alten aus der FeatureGroup
					layer.stops.clearLayers();
					// Jetzt erzeugen wir für jede Haltestelle eine Markierung, inklusive PopUp mit dem Namen der Haltestelle
					$.each(response.features, function(index, feature) {
						var lnglat = feature.geometry.coordinates;
						var marker = L.marker([lnglat[1], lnglat[0]]);
						marker.bindPopup('<h2>' + feature.properties.stop_name + '</h2>');
						// hier wird der Marker der FeatureGroup hinzugefügt
						layer.stops.addLayer(marker);
					})
				}			
				// am Ende müssen wir die FeatureGroup wieder auf der Karte anzeigen
				layer.stops.addTo(map);
			});
		} else {
			// hat der Nutzer keinen Bezirk ausgewählt, entfernen wir die zuletzt angezeigten Layer wieder
			map.removeLayer(layer.bezirk);
			map.removeLayer(layer.stops);
		}
	}
});