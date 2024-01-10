import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import Papa from 'papaparse';
import Axios from 'axios';
import L, { LatLng } from 'leaflet';
import Search from 'react-leaflet-search';
import 'leaflet/dist/leaflet.css';

import { FaUpload } from 'react-icons/fa';
import classes from './map.module.css';

const MapComponent = () => {
  const center = [-1.9505012, 30.054957];
  const position = [-1.954680759129028, 30.103632436377925];
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get('http://localhost:5000/api/csv');
        setCsvData(response.data);
      } catch (error) {
        console.error('Error fetching CSV:', error);
      }
    };

    fetchData();
  }, [])

  const customMarker = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
  });

  const searchLayer = 

  return (
    <div className={classes.map_container}>
      <MapContainer center={center} zoom={8} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=F7824iHaxmUF3BBsvP59"
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />
        {csvData.length>0 && csvData.map(item=>{
          return <Marker
          position={[parseFloat(item.Latitude), parseFloat(item.Longitude)]}
          icon={L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [10, 41],
            popupAnchor: [2, -40],
          })}
        >
          <Popup>
            {/* Customize the popup content based on your CSV data */}
            <div>
              <p>Other information here</p>
            </div>
          </Popup>
        </Marker>
        })}
     
       
      </MapContainer>
    </div>
  );
};

export default MapComponent;
