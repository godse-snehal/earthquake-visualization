function getColor(d) {
  // Numbers must be in descending order
  return d >= 5 ? "#B22222" : 
    d >= 4 ? "#DC143C" :
    d >= 3 ? "#FF4500" :
    d >= 2 ? "#FFA500" :
    d >= 1 ? "#FFFF00" :
    d >= 0 ? "#ADFF2F" :
    'grey';
}

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(response) {

  dataArray = response['features'];
  console.log(dataArray);
  var locationMarkers = [];

  for (var i = 0; i < dataArray.length; i++) {

    coordinates = dataArray[i].geometry.coordinates;
    latlng = coordinates.slice(0, 2);
    latlng = [latlng[1],latlng[0]];

    magnitude = dataArray[i].properties.mag;
    
    locationMarkers.push(
      L.circle(latlng, {
        stroke: true,
        fillOpacity: 0.75,
        weight: 0.2,
        color: 'black',
        fillColor: getColor(magnitude),
        radius: magnitude * 10000
      }).bindPopup(dataArray[i].properties.title)
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
      39.742043, -104.991531
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Create a legend to display information about our map
  var Legend = L.Control.extend({  
    options: {
      position: 'bottomright'
    },
    onAdd: function (map) {
      // Insert a div with the class of "legend"
      var legend = L.DomUtil.create('div', 'info legend', L.DomUtil.get('map'));
  
      // Add legend elements
      labels = ["0", "1", "2", "3", "4", "5"];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < labels.length; i++) {
        legend.innerHTML += '<i style="background:' + getColor(labels[i]) + '"></i> ' +
                            labels[i] + (labels[i + 1] ? '&ndash;' + labels[i + 1] + '<br>' : '+');
        }
  
      return legend;
    }
  });
  
  
  myMap.addControl(new Legend());

}

