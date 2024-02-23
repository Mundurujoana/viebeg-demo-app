
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faChevronDown, faArrowRightFromBracket, faBuilding, faTemperatureThreeQuarters, faBars, faTimes , faSearch} from '@fortawesome/free-solid-svg-icons';
import logo from './viebeg-logo.png';
import { BsHospitalFill, BsTools, BsThermometerHigh, BsPinMapFill , BsArrowRight} from "react-icons/bs";
import defaultProfileImage from './doc.jpg';
import './viebeg-dashboard.css';
import Map from './components/MapComponent';
import MapComponent from './components/MapComponent';
import 'react-tagsinput/react-tagsinput.css';
import TagsInput from 'react-tagsinput';
import Select from 'react-select';


library.add(faCog, faChevronDown, faBuilding, faTemperatureThreeQuarters, faBars, faTimes);

const ViebegDashboard = () => {
  // State to manage the visibility of the settings dropdown
  const [isSettingDropdown, setSettingDropdown] = useState(false);
  const [isProfileDropdown, setProfileDropdown] = useState(false);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [selectedFacilityType, setSelectedFacilityType] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [sectors, setSectors] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
  const [selectedSectorsData, setSelectedSectorsData] = useState([]);
  const [selectedSectorsBalance, setSelectedSectorsBalance] = useState([]);
  const [selectedSectorsSales, setSelectedSectorsSales] = useState([]);
  const [selectedSectorsCreditScore, setSelectedSectorsCreditScore] = useState([]);
  const apiUrl = "http://localhost:5000";

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
    fetch(`${apiUrl}/api/sectors`)
      .then(response => response.json())
      .then(data => setSectors(data))
      .catch(error => console.error('Error fetching sectors:', error));

    fetch(`${apiUrl}/api/diseases`)
      .then(response => response.json())
      .then(data => setDiseases(data))
      .catch(error => console.error('Error fetching diseases:', error));

    fetch(`${apiUrl}/api/health_facilities`)
      .then(response => response.json())
      .then(data => setHealthFacilities(data))
      .catch(error => console.error('Error fetching health facilities:', error));
  }, []);

  useEffect(() => {
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

  useFetchData('/api/calculate-sums', setSelectedSectorsData);
  useFetchData('/api/calculate-balance', setSelectedSectorsBalance);
  useFetchData('/api/calculate-financials', (data) => {
    setSelectedSectorsSales(data.map(sector => ({ Sector: sector.Sector, totalSales: sector.total_sales || 0 })));
    setSelectedSectorsCreditScore(data.map(sector => ({ Sector: sector.Sector, totalCreditScore: sector.total_credit_score || 0 })));
  });

  const [selectedSectorOptions, setSelectedSectorOptions] = useState([]);
  const sectorOptions = sectors.map(sector => ({
    value: sector,
    label: sector
  }));

  const diseaseOptions = diseases.map((disease) => ({
    value: disease,
    label: disease,
  }));

  const facilityTypeOptions = facilityTypes.map((type) => ({
    value: type,
    label: type,
  }));

  const [selectedHealthFacilities, setSelectedHealthFacilities] = useState([]);
  const healthFacilityOptions = healthFacilities.map(facility => ({
    value: facility,
    label: facility
  }));

  const equipmentOptions = equipments.map((equipment) => ({
    value: equipment,
    label: equipment,
  }));

  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedSector, setSearchedSector] = useState('');

  const handleSearchChange = (event) => {
    const inputValue = event.target.value || '';
    setSearchValue(inputValue);
    if (inputValue !== '') {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    const filteredSectors = selectedSectors.filter(sector =>
      sector.includes(inputValue)
    );

    setSelectedSectorsData(filteredSectors);

    // Update the content of the element displaying the searched sector
    setSearchedSector(filteredSectors.length > 0 ? filteredSectors[0] : '');
  };
  const clearSearch = () => {
    setSearchValue('');
    setIsSearching(false);
  };




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

<div className="selected-disease">
    <p className="selected-disease-heading">Selected Disease:</p>
    <p className="selected-disease-value"> {selectedDisease} </p>
  </div>
  
  {/* Select Diseases */}
  <div className="search-sector">
    <p>Select Disease:</p>
    <Select
  options={diseaseOptions}
  value={selectedDisease ? { value: selectedDisease, label: selectedDisease } : null}
  isMulti={false} // Set to false to allow only one selection
  onChange={(selectedOption) => {
    const selectedDisease = selectedOption ? selectedOption.value : ''; // Get the value of the selected disease
    setSelectedDisease(selectedDisease);
  }}
  className="multi-select"  placeholder="Select disease..."
/>
  </div>


  <div className='search-sector'>
<p>Select Sector:</p>
        <Select
          options={sectorOptions}
          value={selectedSectors.map(sector => ({ value: sector, label: sector }))}
          isMulti
          onChange={(selectedOptions) => {
            const selectedSectors = selectedOptions.map(option => option.value);
            setSelectedSectors(selectedSectors);
          }}
          className="multi-select"
      placeholder="Select sector..."
          />
      </div>
    


  {/* Select Facility Types */}
  <div className="search-sector">
    <p>Select Facility Type:</p>
    <Select
      options={facilityTypeOptions}
      value={selectedFacilityTypes.map((type) => ({ value: type, label: type }))}
      isMulti
      onChange={(selectedOptions) => {
        const selectedFacilityTypes = selectedOptions.map((option) => option.value);
        setSelectedFacilityTypes(selectedFacilityTypes);
      }}
      className="multi-select"
      placeholder="Select facility types..."
    />
  </div>

  {/* Select Equipments */}
  <div className="search-sector">
    <p>Select Equipment:</p>
    <Select
      options={equipmentOptions}
      value={selectedEquipments.map((equipment) => ({ value: equipment, label: equipment }))}
      isMulti
      onChange={(selectedOptions) => {
        const selectedEquipments = selectedOptions.map((option) => option.value);
        setSelectedEquipments(selectedEquipments);
      }}
      className="multi-select"
      placeholder="Select equipment..."
    />
  </div>

  {/* Select Health Facilities */}
  <div className="search-sector">
    <p>Select Health Facility:</p>
    <Select
      options={healthFacilityOptions}
      value={selectedHealthFacilities.map((facility) => ({ value: facility, label: facility }))}
      isMulti
      onChange={(selectedOptions) => {
        const selectedFacilities = selectedOptions.map((option) => option.value);
        setSelectedHealthFacilities(selectedFacilities);
      }}
      className="multi-select"
      placeholder="Select health facilities..."
    />
  </div>
</div>

<p>Search Sector: {searchedSector}</p>



      </div>

      <div className="viebeg-dashboard-main-content">
      <div className="selected-elements-display">
  {selectedSectors.length > 0 && <p className="title">Sectors: {selectedSectors.join(', ')}</p>}

  {selectedSectorsData.length > 0 && (
    <>
      <p className="title">TOTAL NURSES <span className="value">{selectedSectorsData.reduce((acc, sector) => acc + parseInt(sector.total_nurses || 0), 0)}</span></p>
      <p className="title">TOTAL DOCTORS <span className="value">{selectedSectorsData.reduce((acc, sector) => acc + parseInt(sector.total_doctors || 0), 0)}</span></p>
      <p className="title">TOTAL PATIENTS/MONTH <span className="value">{selectedSectorsData.reduce((acc, sector) => acc + parseInt(sector.total_patients_permonth || 0), 0)}</span></p>
      <p className="title">TOTAL PATIENTS/DAY</p>
      <p className="title">EQUIPMENT AVAILABLE </p>
      <p className="title">EQUIPMENT SUPPLIED </p>
      <p className="title">TOTAL SALES <span className="value">{selectedSectorsSales.reduce((acc, sector) => acc + parseInt(sector.totalSales || 0), 0)}</span></p>
      <p className="title">TOTAL BALANCE <span className="value">{selectedSectorsBalance.reduce((acc, sector) => acc + parseInt(sector.total_balance || 0), 0)}</span></p>
      <p className="title">TOTAL CREDIT SCORE <span className="value">{selectedSectorsCreditScore.reduce((acc, sector) => acc + parseInt(sector.totalCreditScore || 0), 0)}</span></p>
    </>
  )}
</div>

  {/* <h2 className="title-heading">Health Assessment and Capacity Evaluation Tool (HACET)</h2>

  <div className="selected-disease">
    <p className="selected-disease-heading">Selected Disease:</p>
    <p className="selected-disease-value">{selectedDiseases.join(', ')}</p>
  </div>

  <div className='search-sector'>
        <Select
          options={sectorOptions}
          value={selectedSectors.map(sector => ({ value: sector, label: sector }))}
          isMulti
          onChange={(selectedOptions) => {
            const selectedSectors = selectedOptions.map(option => option.value);
            setSelectedSectors(selectedSectors);
          }}
          styles={{
            control: provided => ({
              ...provided,
              textAlign: 'left',
              width: '500px', // Adjust the width as needed
            }),
            menu: provided => ({
              ...provided,
              textAlign: 'left',
              width: '500px', // Set the width of the menu
              position: 'absolute', // Set the position to absolute
              top: 'calc(100% + 10px)', // Position above the map menu
              zIndex: 9999, // Ensure it's above other elements on the map
              fontSize: '12px',
            }),
            placeholder: provided => ({
              ...provided,
              textAlign: 'left',
              marginLeft: '5px', // Add left margin to adjust the position
              fontSize: '12px',
            })
          }}
          placeholder='Choose an option...'
        />
        </div> */}

<div className="custom-search-input-container">
  <input
    type="text"
    value={searchValue}
    onChange={handleSearchChange}
    className="custom-search-input"
    placeholder="Search..."
  />
  {isSearching ? (
    <FontAwesomeIcon
      icon={faTimes}
      className="search-icon clear-icon"
      onClick={clearSearch}
    />
  ) : (
    <FontAwesomeIcon icon={faSearch} className="search-icon" />
  )}
</div>


        


        {/* Map Component */}
        <MapComponent />
      </div>
    </div>
  </div>
);
};

export default ViebegDashboard;