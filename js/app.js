function init(){
  //var map = L.map('map').setView([46.2, 2], 5);
  //
	//
	//var MapQuestOpen_OSM = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
		//attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		//subdomains: '1234'}).addTo(map);
		//
		

	// MapBox
	var mapbox   = L.tileLayer('https://b.tiles.mapbox.com/v3/examples.c7d2024a/{z}/{x}/{y}.png', {
	attribution: 'Map tiles by <a href="http://www.mapbox.com/">MapBox</a> &mdash; Map data &copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});

	//Stamen
	var stamen = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	subdomains: 'abcd',	minZoom: 0,	maxZoom: 20	});

	//MapQuest
	var MapQuestOpen_OSM = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	subdomains: '1234'});

	//OSM
	var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});

	//
	var googleLayer_Plan = new L.Google('ROADMAP');
	var googleLayer_Satellite = new L.Google('SATELLITE');
	

	// On ajoute le fond de carte.
	var caueUrl = 'http://{s}.livembtiles.makina-corpus.net/caue24/CAUE/{z}/{x}/{y}.png';
	var caueAttrib = 'Données cartographiques fournies par le CAUE24';
	//L.tileLayer(caueUrl, {minZoom: 8, maxZoom: 11, attribution: caueAttrib, subDomains: 'abcdefgh'}).addTo(map);
	var caueLayer = L.tileLayer(caueUrl, {
	attribution: caueAttrib});

	var baseMap = {
		"CAUE24" : caueLayer,
		"Google Plan" : googleLayer_Plan,
		"Google Satellite" : googleLayer_Satellite,
		"Mapbox": mapbox,
		"Mapnik": OpenStreetMap_Mapnik,
		"MapQuest": MapQuestOpen_OSM,
		"Stamen Toner": stamen
	};

	//----------------------------------------------------------------------------------------------------------------

	var myIcon = L.icon({
		iconUrl: 'http://www.igeo.fr/map-icons/pins/32/pin2.png',
		iconSize: [24, 24],
		iconAnchor: [12, 24]
	});

	//----------------------------------------------------------------------------------------------------------------
	
	coords = []; //define an array to store coordinates
	
	$.getJSON('data/20140702_exploitants.geojson', function(data) {
		var drone = L.geoJson(data, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup('<b>'+feature.properties.NOM +'</b><br>'+ feature.properties.ADRESSE+'<br>'+ feature.properties.VILLE+'<br>'+ feature.properties.PAYS+'<br><a>Site web :</a> <a href=" ' + feature.properties.WEB + '">'+feature.properties.WEB +'</a><br><a style="color:red;"> Vérifié le : </a><a style="color:red;">'+feature.properties.VERIFICATION +'</a>');
				layer.setIcon (layer.options.icon =myIcon);
				coords.push(L.GeoJSON.coordsToLatLng(feature.geometry.coordinates));
			}
		});
	
	//----------------------------------------------------------------------------------------------------------------

	var markers = L.markerClusterGroup({
		spiderfyOnMaxZoom: false,
		showCoverageOnHover: true,
		zoomToBoundsOnClick: true,
		disableClusteringAtZoom: 13
	});
	markers.addLayer(drone);

//----------------------------------------------------------------------------------------------------------------

	var heat = L.heatLayer(
		coords,
		{
			maxZoom: 9,
			max:1, 
			radius: 15,
			blur: 15, 
			gradient: {
				0.0: "rgba(000,000,255,0)",
		        0.2: "rgba(000,000,255,1)",
		        0.4: "rgba(000,255,255,1)",
		        0.6: "rgba(000,255,000,1)",
		        0.8: "rgba(255,255,000,1)",
		        1.0: "rgba(255,000,000,1)"
	        }
		}
	);


//----------------------------------------------------------------------------------------------------------------

	var overlays = {
		"Exploitants en activités particulières<br>au moyen d'aéronefs télé-pilotés 02/07/2014 <br>-> <a href =http://www.developpement-durable.gouv.fr/Quelle-place-pour-les-drones-dans.html>Pour en savoir plus</a>": markers,
		"Heatmap des exploitants en activités <br>particulières au moyen d'aéronefs télé-pilotés<br><br>-> <a href =https://github.com/igeofr/igeofr.github.io/edit/master/map_drones/>Contribuer et maintenir le fichier</a> <br>-> <a href =https://twitter.com/iGeoFlo>Signaler une erreur</a>":heat 
	};

//----------------------------------------------------------------------------------------------------------------

	// Construct a bounding box for this map that the user cannot
	// move out of
	var southWest = L.latLng(39,-11),
	    northEast = L.latLng(53,12),
	    bounds = L.latLngBounds(southWest, northEast);
    
    
	var map = new L.Map('map',
		{
			center: [46.18390, -0.12640],
			//center: new L.Point(-0.12640, 46.18390),
			zoom: 8,
			//crs: L.CRS.EPSG3857,
			//crs: L.CRS.EPSG3857,
			maxBounds: bounds, 
			maxZoom: 12,
		    minZoom: 6,
			layers: [googleLayer_Plan,markers]
		}
	);
	
	// Zoom sur l'étendu de la carte
	//map.fitBounds(bounds);

	L.control.layers(baseMap,overlays,{ collapsed: true }).addTo(map);
 


//----------------------------------------------------------------------------------------------------------------

		//Mini Map
		var mapbox2 = new L.TileLayer('https://b.tiles.mapbox.com/v3/examples.c7d2024a/{z}/{x}/{y}.png');
		var miniMap = new L.Control.MiniMap(mapbox2, { toggleDisplay: true}).addTo(map);

//----------------------------------------------------------------------------------------------------------------

		//Mouse Position
		L.control.mousePosition().addTo(map);

//----------------------------------------------------------------------------------------------------------------

		//Scale
		L.control.scale({ position: 'bottomleft'}).addTo(map);

//----------------------------------------------------------------------------------------------------------------

		// GeoRecherche
		new L.Control.GeoSearch({
		    provider: new L.GeoSearch.Provider.OpenStreetMap(),
		    position: 'topcenter',
		    showMarker: false
		}).addTo(map);
//----------------------------------------------------------------------------------------------------------------

});


}


