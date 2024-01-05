import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import classes from "./map.module.css";
const MapComponent = () => {
  const center = [-1.9505012, 30.054957];
  return (
    <div className={classes.map_container}>
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
    
  </MapContainer>
  </div>
  )
}

export default MapComponent;
