import { MapContainer, TileLayer, Polygon, GeoJSON } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { polyData } from "./data/polygon";
import classes from "./map.module.css";

const MapComponent = () => {
  const center = [-1.9505012, 30.054957];
  // const center = [39.8283, -98.5795];

  const onDistrictClick = (event) => {
    const properties = event.target.feature.properties;
    // const districtName = properties ? properties.Name : 'Unknown District';
    console.log(properties);
    // setDistrictName(districtName);
  };

  return (
    <div className={classes.map_container}>
      <MapContainer center={center} zoom={8.5} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=F7824iHaxmUF3BBsvP59"
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />
        <GeoJSON
        data={polyData}
        style={() => ({
          fillColor: "#FD8D2C",
          fillOpacity: 0.7,
          weight: 2,
          opacity: 1,
          dashArray: 3,
          color: "white",
        })}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: onDistrictClick,
          });
        }}
      />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
