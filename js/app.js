function init(){
  var map = L.map('map').setView([46.2, 2], 5);
  
  var CM = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
	  key: "xxxxxxxxxxxx",
	  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
	  contributors, &copy <a href="http://cloudmade.com/">CloudMade</a>',
	  styleId: 22677
	}).addTo(map);
}
