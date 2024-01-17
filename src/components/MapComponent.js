import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, GeoJSON, Tooltip, Popup  } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import Axios from 'axios';
import { polyData } from "./data/polygon";
import classes from "./map.module.css";

const MapComponent = () => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [districtData, setDistrictData] = useState('');
  const [isOnHover, setIsOnHover] = useState(false);
  const [isOnClick, setIsOnClick] = useState(false);
  const center = [-1.9505012, 30.054957];
  // const center = [39.8283, -98.5795];

  const onDistrictClick = async(event) => {
    const properties = event.target.feature.properties;
    const districtName = properties ? properties.Name : 'Unknown District';
    setIsOnClick(prev=>!prev);
    console.log(districtName);
    try {
      const response = await Axios.get('https://viebeg-server-xfg4.onrender.com/api/data');
      console.log(response.data);
      setDistrictData(response.data.districtData1)
      // setCsvData(response.data);
    } catch (error) {
      console.error('Error fetching CSV:', error);
    }
    // setDistrictName(districtName);
  };

  const onDistrictMouseOver = (event) => {
    setIsOnHover(true);
    event.target.setStyle({
      fillColor: "#FD8D2C",
      fillOpacity: 0.6,
      weight: 2,
      opacity: 1,
      dashArray: 3,
      color: "white",
    });
    setTooltipContent(event.target.feature.properties.Name || 'Unknown District');
  };

  const onDistrictMouseOut = (event) => {
    setIsOnHover(false);
    event.target.setStyle({
      fillColor: "#FD8D2C",
      fillOpacity: 0.8,
      weight: 2,
      opacity: 1,
      dashArray: 3,
      color: "white",
    });
    setTooltipContent('');
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
          fillOpacity: 0.8,
          weight: 2,
          opacity: 1,
          dashArray: 3,
          color: "white",
        })}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: onDistrictClick,
            mouseover: onDistrictMouseOver,
            mouseout: onDistrictMouseOut,
          });
        }}
        >
        <Tooltip>{tooltipContent}</Tooltip>

        <Popup>
              <table>
                <tbody>
                  <tr>
                    <td>Province</td>
                    <td>districtData.Province</td>
                  </tr>
                  <tr>
                  <td>Sectors</td>
                  <td>{districtData.sectors}</td>
                </tr>
                </tbody>
              </table>
            </Popup>
          )}
        </GeoJSON>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
