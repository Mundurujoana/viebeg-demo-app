import { MapContainer, TileLayer, Polygon, Marker, Popup, Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { polyData } from "./data/polygon";
import { lineData } from "./data/line";
import classes from "./map.module.css";
import L from 'leaflet';

const MapComponent = () => {
  const center = [-1.9505012, 30.054957];
  // const center = [39.8283, -98.5795];
  const position = [-1.954680759129028, 30.103632436377925];

  const customMarker = new L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40]
  });
  return (
    <div className={classes.map_container}>
      <MapContainer center={center} zoom={8} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=F7824iHaxmUF3BBsvP59"
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />
        {lineData.features.map((district, index) => {
          if (district.geometry.type === "LineString") {
            const coordinates = district.geometry.coordinates.map(item => [item[1], item[0]]);
            
            return (
              <Polyline
                key={index}
                pathOptions={{
                  color: "#FD8D2C",
                  weight: 2,
                  opacity: 1,
                  dashArray: 3,
                }}
                positions={coordinates}
                eventHandlers={{
                  mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      weight: 5,
                      dashArray: "",
                      color: "#666",
                    });
                  },
                  mouseout: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      weight: 2,
                      dashArray: 3,
                      color: "#FD8D2C",
                    });
                  },
                  click: (e) => {
                    const layer = e.target;
                    console.log("Clicked on:", layer);
                  }
                }}
              />
            );
          }
          
          // Handle other geometry types if needed
        
          return null;
        })}
        <Marker position={position}>
        <Popup icon={customMarker}>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
