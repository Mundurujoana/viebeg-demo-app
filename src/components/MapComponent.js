import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { polyData } from "./data/polygon";
import classes from "./map.module.css";

const MapComponent = () => {
  const center = [-1.9505012, 30.054957];
  // const center = [39.8283, -98.5795];

  return (
    <div className={classes.map_container}>
      <MapContainer center={center} zoom={8} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=F7824iHaxmUF3BBsvP59"
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />
        {polyData.features.map((district, index) => {
          const coordinates = district.geometry.coordinates[0].map(item => [item[1], item[0]]);
          return (
            <Polygon
              key={index}
              pathOptions={{
                fillColor: "#FD8D2C",
                fillOpacity: 0.7,
                weight: 2,
                opacity: 1,
                dashArray: 3,
                color: "white",
              }}
              positions={coordinates}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
