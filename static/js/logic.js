var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(response) {

  dataArray = response['features'];

  var locationMarkers = [];

  for (var i = 0; i < dataArray.length; i++) {

    coordinates = dataArray[i].geometry.coordinates;
    latlng = coordinates.slice(0, 2);
    
    locationMarkers.push(
      L.circle(latlng, {
        stroke: false,
        fillOpacity: 0.75,
        color: "yellow",
        fillColor: "yellow",
        radius: dataArray[i].properties.mag
      })
    );
  
  }
  var earthquakeLayer = L.layerGroup(locationMarkers);
  createMap(earthquakeLayer);

});

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1Ijoic2dvZHNlMyIsImEiOiJjazBla3ZxMTIwajZqM2xxZWZ4MmJhNTljIn0.X1WDErGoWe-vwP5-it40pA"
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: "pk.eyJ1Ijoic2dvZHNlMyIsImEiOiJjazBla3ZxMTIwajZqM2xxZWZ4MmJhNTljIn0.X1WDErGoWe-vwP5-it40pA"
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  console.log(earthquakes);

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}


