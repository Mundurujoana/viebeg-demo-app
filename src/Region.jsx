import { useLocation } from 'react-router-dom';

const Region = () => {
  const location = useLocation();
  const customerData = location.state?.customerData;

  return (
    <div>
      {customerData && (
        <div className="customer-info">
          <h2>{customerData.customerName} Location Information</h2>
          <p>Location Country: {customerData.location_country}</p>
          <p>Location Province: {customerData.location_province}</p>
          <p>Location District: {customerData.location_district}</p>
          <p>Location Sector: {customerData.location_sector}</p>
          <p>Sector ID: {customerData.sector_id}</p>
          <p>Type: {customerData.type}</p>
        </div>
      )}
    </div>
  );
};

export default Region;
