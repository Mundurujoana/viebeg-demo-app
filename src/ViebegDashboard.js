
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faChevronDown, faArrowRightFromBracket, faBuilding, faTemperatureThreeQuarters, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from './viebeg-logo.png';
import { BsHospitalFill, BsTools, BsThermometerHigh, BsPinMapFill , BsArrowRight} from "react-icons/bs";
import defaultProfileImage from './doc.jpg';
import './viebeg-dashboard.css';
import Map from './components/MapComponent';
import MapComponent from './components/MapComponent';

library.add(faCog, faChevronDown, faBuilding, faTemperatureThreeQuarters, faBars, faTimes);

const ViebegDashboard = () => {
  // State to manage the visibility of the settings dropdown
  const [isSettingDropdown, setSettingDropdown] = useState(false);
  const [isProfileDropdown, setProfileDropdown] = useState(false);

  // Static arrays for dropdown options

  const [selectedSector, setSelectedSector] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [selectedFacilityType, setSelectedFacilityType] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const [sectors, setSectors] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [equipments, setEquipments] = useState([]);

  // const apiUrl = 'https://kap-viebeg-server.onrender.com';

  const apiUrl = "http://localhost:5000"

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    setOverlayVisible(isMobileMenuOpen);
  }, [isMobileMenuOpen]);


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSettingDropdown = () => {
    setSettingDropdown(!isSettingDropdown);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown(!isProfileDropdown);
  };

  
  
  
  useEffect(() => {
          // Fetch data for sectors
          fetch(`${apiUrl}/api/sectors`)
            .then(response => response.json())
            .then(data => setSectors(data))
            .catch(error => console.error('Error fetching sectors:', error));
        
          // Fetch data for diseases
          fetch(`${apiUrl}/api/diseases`)
            .then(response => response.json())
            .then(data => setDiseases(data))
            .catch(error => console.error('Error fetching diseases:', error));
        
        }, []);
        
        useEffect(() => {
          // Fetch Facility Types
          const fetchFacilityTypes = async () => {
            try {
              const response = await fetch(`${apiUrl}/api/facilities`);
              const data = await response.json();
              setFacilityTypes(data);
            } catch (error) {
              console.error('Error fetching facility types:', error);
            }
          };
        
          fetchFacilityTypes();
        }, []); 
        
        useEffect(() => {
          // Fetch Equipment
          const fetchEquipments = async () => {
            try {
              const response = await fetch(`${apiUrl}/api/equipments`);
              const data = await response.json();
              setEquipments(data);
            } catch (error) {
              console.error('Error fetching equipment data:', error);
            }
          };
        
          fetchEquipments();
        }, []); 
        

 
        const [selectedSectors, setSelectedSectors] = useState([]);
        const [isDropdownOpen, setDropdownOpen] = useState(false);
      
        // ... (other state variables and useEffect hooks)
      
        // Function to handle the selection of sectors
        const handleSelectSector = (sector) => {
          // Check if the sector is already selected
          if (selectedSectors.includes(sector)) {
            // If selected, remove it
            setSelectedSectors((prevSelectedSectors) =>
              prevSelectedSectors.filter((selectedSector) => selectedSector !== sector)
            );
          } else {
            // If not selected, add it
            setSelectedSectors((prevSelectedSectors) => [...prevSelectedSectors, sector]);
          }
        };

        // New state variables and handlers for diseases
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [isDiseaseDropdownOpen, setDiseaseDropdownOpen] = useState(false);

  const handleSelectDisease = (disease) => {
    if (selectedDiseases.includes(disease)) {
      setSelectedDiseases((prevSelectedDiseases) =>
        prevSelectedDiseases.filter((selectedDisease) => selectedDisease !== disease)
      );
    } else {
      setSelectedDiseases((prevSelectedDiseases) => [...prevSelectedDiseases, disease]);
    }
  };

  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [isEquipmentDropdownOpen, setEquipmentDropdownOpen] = useState(false);

  const handleSelectEquipment = (equipment) => {
    if (selectedEquipments.includes(equipment)) {
      setSelectedEquipments((prevSelectedEquipments) =>
        prevSelectedEquipments.filter((selectedEquipment) => selectedEquipment !== equipment)
      );
    } else {
      setSelectedEquipments((prevSelectedEquipments) => [...prevSelectedEquipments, equipment]);
    }
  };

  const [isFacilityTypeDropdownOpen, setFacilityTypeDropdownOpen] = useState(false);
const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);

const handleSelectFacilityType = (type) => {
  if (selectedFacilityTypes.includes(type)) {
    setSelectedFacilityTypes((prevSelectedFacilityTypes) =>
      prevSelectedFacilityTypes.filter((selectedType) => selectedType !== type)
    );
  } else {
    setSelectedFacilityTypes((prevSelectedFacilityTypes) => [...prevSelectedFacilityTypes, type]);
  }
};

const [selectedSectorsData, setSelectedSectorsData] = useState([]);
const [selectedSectorsBalance, setSelectedSectorsBalance] = useState([]);
const [selectedSectorsSales, setSelectedSectorsSales] = useState([]);
const [selectedSectorsCreditScore, setSelectedSectorsCreditScore] = useState([]);


const useFetchData = (endpoint, setSelectedState) => {
  useEffect(() => {
    if (selectedSectors.length > 0) {
      fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedSectors }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(`Data for ${endpoint}:`, data);
          setSelectedState(data);
        })
        .catch(error => console.error(`Error fetching ${endpoint} data:`, error));
    }
  }, [selectedSectors]);
};

// Usage
useFetchData('/api/calculate-sums', setSelectedSectorsData);
useFetchData('/api/calculate-balance', setSelectedSectorsBalance);
useFetchData('/api/calculate-financials', (data) => {
  setSelectedSectorsSales(data.map(sector => ({ Sector: sector.Sector, totalSales: sector.total_sales || 0 })));
  setSelectedSectorsCreditScore(data.map(sector => ({ Sector: sector.Sector, totalCreditScore: sector.total_credit_score || 0 })));
});


  return (
    <div>
   <div className='viebeg-dashboard-navbar'>
    {/* Navbar Logo */}
    <div className="viebeg-dashboard-navbar-logo">
      <img src={logo} alt="Logo" className="logo" />
    </div>



    <div className="hamburger-menu" onClick={toggleMobileMenu}>
  <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="hamburger-icon" />
</div>





    {/* Navbar content goes here */}
      <div className={`navbar-content ${isMobileMenuOpen ? 'open' : 'closed'}`}>
      {/* Settings Icon with Dropdown Arrow */}
      <div className="settings-dropdown">
        <div className="icon-container">
          <FontAwesomeIcon
            icon={['fas', 'cog']}
            className="settings-icon"
            onClick={toggleSettingDropdown}
          />
          <div
            className={`set-dropdown-arrow ${isSettingDropdown ? 'up' : ''}`}
            onClick={toggleSettingDropdown}
          >
            <FontAwesomeIcon icon={['fas', 'chevron-down']} />
          </div>
        </div>


            {/* Dropdown content */}
            {isSettingDropdown && (
              <div className="dropdown-content">
                {/* Add your dropdown menu items here */}
                <div className="active">Map Settings</div>
                <div> Import/Export Data </div>
                <div> Add a New Health Facility </div>
              </div>
            )}

            <div className="profile-info">
              <div className="profile-icon" onClick={toggleProfileDropdown}>
                <img src={defaultProfileImage} alt="Profile" />
              </div>
              <div className="profile-text">
                <div className="profile-name">Joana M</div>
                <div className="profile-email">Joana@example.com</div>
              </div>
              <div
                className={`dropdown-arrow ${isProfileDropdown ? 'up' : ''}`}
                onClick={toggleProfileDropdown}
              >
                <FontAwesomeIcon icon={['fas', 'chevron-down']} />
              </div>
            </div>

            {isProfileDropdown && (
              <div className="dropdown-profile-content">
                {/* Add your profile dropdown menu items here */}
                <div className="active">Profile</div>
                <div> Analytics </div>
                <div> Stock Management </div>
                <div> Subscription </div>
                <div className="logout-item">
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    style={{ fontWeight: 'thin' }}
                    className="logout-icon"
                  />
                  <span className="logout-text">Log out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className={`overlay ${isMobileMenuOpen ? 'open' : ''}`} />


      <div className={`dashboard-container ${isOverlayVisible ? 'overlay-open' : ''}`}>
      <div className="viebeg-dashboard-sidebar">
        <div className="sidebar-header">
          <p className="sidebar-filters">FILTERS</p>
          <p className="sidebar-filters">3000/3000</p>
          <button className="reset-button">Reset</button>
        </div>

        <div className="sidebar-inputs">
          {/* Search Input */}
          <input type="text" placeholder="Search..." className="search-input" />

 

          <div className="select-container">
      <div className="dropdown-header" onClick={() => setDropdownOpen(!isDropdownOpen)}>
          <BsPinMapFill className="select-icon" />
          <div className="selected-element">
    {selectedSectors.length > 0 && (
      <span className="count-badge">{selectedSectors.length}</span>
    )}
    {selectedSectors.length > 0 ? ' Sectors' : ' Sector'}
  
  </div>
    <div className={`dropdown-arrow ${isDropdownOpen ? 'up' : ''}`}>
      <FontAwesomeIcon icon={['fas', 'chevron-down']} />
    </div>
        </div>
        {isDropdownOpen && (
          <div className="dropdown-options">
            {sectors.map((sector) => (
              <label key={sector} className="option-label">
                <input
                  type="checkbox"
                  value={sector}
                  checked={selectedSectors.includes(sector)}
                  onChange={() => handleSelectSector(sector)}
                />
                {sector}
              </label>
            ))}
          </div>
        )}
      </div>

      

      <div className="select-container">
      <div className="dropdown-header" onClick={() => setDiseaseDropdownOpen(!isDiseaseDropdownOpen)}>
  <BsThermometerHigh className="select-icon" />
  <div className="selected-element">
    {selectedDiseases.length > 0 && (
      <span className="count-badge">{selectedDiseases.length}</span>
    )}
    {selectedDiseases.length > 0 ? ' Diseases' : ' Disease'}
  </div>
  <div className={`dropdown-arrow ${isDiseaseDropdownOpen ? 'up' : ''}`}>
    <FontAwesomeIcon icon={['fas', 'chevron-down']} />
  </div>
</div>
{isDiseaseDropdownOpen && (
  <div className="dropdown-options">
    {diseases.map((disease) => (
      <label key={disease} className="option-label">
        <input
          type="checkbox"
          value={disease}
          checked={selectedDiseases.includes(disease)}
          onChange={() => handleSelectDisease(disease)}
        />
        {disease}
        </label>
            ))}
          </div>
        )}
      </div>


      <div className="select-container">
        <div
          className="dropdown-header"
          onClick={() => setFacilityTypeDropdownOpen(!isFacilityTypeDropdownOpen)}
        >
          <BsHospitalFill className="select-icon" />
          <div className="selected-element">
            {/* Use selectedFacilityTypes instead of selectedFacilityType */}
            {selectedFacilityTypes.length > 0 && (
              <span className="count-badge">{selectedFacilityTypes.length}</span>
            )}
            {selectedFacilityTypes.length > 0 ? ' Facility Types' : ' Facility Type'}
          </div>
          <div className={`dropdown-arrow ${isFacilityTypeDropdownOpen ? 'up' : ''}`}>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        {isFacilityTypeDropdownOpen && (
          <div className="dropdown-options">
            {facilityTypes.map((type) => (
              <label key={type} className="option-label">
                <input
                  type="checkbox"
                  value={type}
                  checked={selectedFacilityTypes.includes(type)}
                  onChange={() => handleSelectFacilityType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        )}
      </div>


      <div className="select-container">
      <div className="dropdown-header" onClick={() => setEquipmentDropdownOpen(!isEquipmentDropdownOpen)}>
  <BsTools className="select-icon" />
  <div className="selected-element">
    {selectedEquipments.length > 0 && (
      <span className="count-badge">{selectedEquipments.length}</span>
    )}
    {selectedEquipments.length > 0 ? ' Equipments' : ' Equipment'}
  </div>
  <div className={`dropdown-arrow ${isEquipmentDropdownOpen ? 'up' : ''}`}>
    <FontAwesomeIcon icon={['fas', 'chevron-down']} />
  </div>
</div>
{isEquipmentDropdownOpen && (
  <div className="dropdown-options">
    {equipments.map((equipment) => (
      <label key={equipment} className="option-label">
        <input
          type="checkbox"
          value={equipment}
          checked={selectedEquipments.includes(equipment)}
          onChange={() => handleSelectEquipment(equipment)}
        />
        {equipment}
        </label>
            ))}
          </div>
        )}
      </div>



        </div>
      </div>

     


      <div className="viebeg-dashboard-main-content">
      <div className="selected-elements-display">
  {selectedSectors.length > 0 && <p>Sectors: {selectedSectors.join(', ')}</p>}

  {selectedSectorsData.length > 0 && (
    <>
      <p>TOTAL NURSES {selectedSectorsData.reduce((acc, sector) => acc + parseInt(sector.total_nurses || 0), 0)}</p>
      <p>TOTAL DOCTORS {selectedSectorsData.reduce((acc, sector) => acc + parseInt(sector.total_doctors || 0), 0)}</p>
      <p>TOTAL PATIENTS/MONTH {selectedSectorsData.reduce((acc, sector) => acc + parseInt(sector.total_patients_permonth || 0), 0)}</p>
      <p>TOTAL PATIENTS/DAY</p>
      <p>EQUIPMENT AVAILABLE </p>
      <p>EQUIPMENT SUPPLIED </p>
      <p>TOTAL SALES {selectedSectorsSales.reduce((acc, sector) => acc + parseInt(sector.totalSales || 0), 0)}</p>
      <p>TOTAL BALANCE {selectedSectorsBalance.reduce((acc, sector) => acc + parseInt(sector.total_balance || 0), 0)}</p>
      <p>TOTAL CREDIT SCORE {selectedSectorsCreditScore.reduce((acc, sector) => acc + parseInt(sector.totalCreditScore || 0), 0)}</p>
    </>
  )}
</div>


        {/* Render the MapComponent */}
        <MapComponent />
      </div>

      </div>


    </div>
  );
};

export default ViebegDashboard;