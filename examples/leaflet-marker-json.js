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
 * iconSize definiert die Größe von Schatten und Marker
 * iconAnchor definiert der Punkt an dem das ganze an der GPS-Koordination angelegt wird ausgehend von links oben.
 */

$(document).ready(function() {
    var markerList = jQuery.parseJSON('[{"name":"CineStar | EVENT Cinema","lon":"13.373483419418","lat":"52.509874323036","details":"4adcda8bf964a520c84921e3"},{"name":"CineStar | Cubix Filmpalast","lon":"13.411903381348","lat":"52.520320816535","details":"4b153c62f964a520aba923e3"},{"name":"Hackesche Höfe Kino","lon":"13.402075612587","lat":"52.524090458692","details":"4b747f3cf964a52029e02de3"},{"name":"Central","lon":"13.401989936829","lat":"52.524433441895","details":"4b0722d6f964a520f8f722e3"},{"name":"Zeughauskino","lon":"13.402313999774","lat":"52.522743503705","details":"4f3f96cae4b0ac94163ef922"},{"name":"Freiluftkino Mitte","lon":"13.401446170977","lat":"52.524906768114","details":"4c44a6fbdd1f2d7f782880f9"},{"name":"Zeughaus Kino","lon":"13.39744083","lat":"52.518479","details":"4adcda8bf964a520004a21e3"},{"name":"Hoefekino","lon":"13.403800227244","lat":"52.525569777774","details":"4ec57da8f5b9b3184020f32b"},{"name":"Balázs","lon":"13.4057412","lat":"52.5206294","details":"4adcda89f964a520ac4921e3"},{"name":"Campingplatzkino","lon":"13.40650677681","lat":"52.521332688644","details":"4e4e16b1922e474439c1d4fc"},{"name":"Babylon","lon":"13.41155510866","lat":"52.525927729496","details":"4b068a02f964a520deec22e3"},{"name":"HODL /Cinema","lon":"13.409965","lat":"52.526717","details":"50202403e4b0e467b674a593"},{"name":"Alextreff Cubix","lon":"13.411769270897","lat":"52.520637437088","details":"4eaf08ebb634097eca118778"},{"name":"99Fire-Films Award","lon":"13.389097","lat":"52.521047","details":"4d5d0f1e9ac9a09365e67694"},{"name":"acud","lon":"13.395913124084","lat":"52.53084564209","details":"5065f561e4b0b313ab382770"},{"name":"Show-Palace-Catering im Friedrichstadtpalast","lon":"13.387825012207","lat":"52.52352142334","details":"4d27045eec272d43f189334c"},{"name":"High End 54","lon":"13.389005","lat":"52.526275","details":"4b7f05a3f964a520eb1030e3"},{"name":"Nickelodeon","lon":"13.3890233","lat":"52.5275199","details":"4adcda8bf964a520d94921e3"},{"name":"Acud Kino","lon":"13.400808154765","lat":"52.533695997468","details":"4adcda89f964a520ab4921e3"},{"name":"Berlinized","lon":"13.406274","lat":"52.532138","details":"4e7f3fc89adf50130f22d4e1"},{"name":"Arri Directors Party","lon":"13.38657","lat":"52.513384","details":"4d5b092a61393704b3d5cdc6"},{"name":"CinemaxX","lon":"13.373797237873","lat":"52.508556909168","details":"4af588c7f964a520aaf921e3"},{"name":"Soho House Screening Room","lon":"13.415681","lat":"52.527233","details":"4e70da2b1838f0daa0c02ab3"},{"name":"Lichtblick-Kino","lon":"13.40764","lat":"52.536667","details":"4bbb932351b89c743d64862a"},{"name":"Cloud Atlas / Art Dept. TT","lon":"13.40733863","lat":"52.53595066","details":"4e6e667445dd293273dc1bf0"},{"name":"Kino in der Kulturbrauerei","lon":"13.413630342441","lat":"52.5386805"}]');
    for(i=0;i<markerList.length;i++){
        L.marker([markerList[i].lon,markerList[i].lat]).addTo(map);
    }
});