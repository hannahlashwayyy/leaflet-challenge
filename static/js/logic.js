function markerSize(magnitude) {
    return magnitude * 4;  // Adjust this factor if needed
}

function chooseColor(depth) {
    let color = "black";

    if (depth <= 10){
        color = "#FEA837";
    }else if (depth <= 30){
        color = "#DE741C";
    }else if (depth <= 50){
        color = "#B85B56";
    }else if (depth <= 70){
        color = "#84495F";
    }else if (depth <= 90){
        color = "#662549";        
    }else {
        color = "#451952";
    }

    return (color);
}

function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}

function createMap(data) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let myMap = L.map("map", {
        center: [40.7, -94.5],
        zoom: 3,
        layers: [street]
    });

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place
            );
        }
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");

        let legendInfo = "<h4>Legend</h4>"
        legendInfo += "<i style='background: #FEA837'></i>-10-10<br/>";
        legendInfo += "<i style='background: #DE741C'></i>10-30<br/>";
        legendInfo += "<i style='background: #B85B56'></i>30-50<br/>";
        legendInfo += "<i style='background: #84495F'></i>50-70<br/>";
        legendInfo += "<i style='background: #662549'></i>70-90<br/>";
        legendInfo += "<i style='background: #451952'></i>90+";
        

        div.innerHTML = legendInfo;
        return div;
    };

    legend.addTo(myMap);
}
        
function doWork() {
    let baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
    d3.json(baseURL).then(function (data){
        let data_rows = data.features;
        createMap(data_rows);
    });
}

doWork();
