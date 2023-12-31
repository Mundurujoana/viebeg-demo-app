
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faChevronDown, faArrowRightFromBracket, faBuilding, faTemperatureThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import logo from './viebeg-logo.png';
import { BsHospitalFill, BsTools, BsThermometerHigh, BsPinMapFill } from "react-icons/bs";
import defaultProfileImage from './doc.jpg';
import './viebeg-dashboard.css';

library.add(faCog, faChevronDown, faBuilding, faTemperatureThreeQuarters);

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

  const apiUrl = 'https://kap-viebeg-server.onrender.com';


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
              const response = await fetch(`${apiUrl}/api/facility-types`);
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
        

  // Function to toggle the visibility of the dropdown
  const toggleSettingDropdown = () => {
    setSettingDropdown(!isSettingDropdown);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown(!isProfileDropdown);
  };

  return (
    <div>
      <div className="viebeg-dashboard-navbar">
        {/* Navbar Logo */}
        <div className="viebeg-dashboard-navbar-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* Navbar content goes here */}
        <div className="navbar-content">
          {/* Settings Icon with Dropdown Arrow */}
          <div className="settings-dropdown">
            <div className="icon-container">
              <FontAwesomeIcon
                icon={['fas', 'cog']} // Updated to use 'fas' prefix for solid icons
                className="settings-icon"
                onClick={toggleSettingDropdown} // Added onClick to toggle the dropdown
              />
              <div
                className={`dropdown-arrow ${isSettingDropdown ? 'up' : ''}`}
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
      
      <div className="dashboard-container">
      <div className="viebeg-dashboard-sidebar">
        <div className="sidebar-header">
          <p className="sidebar-filters">FILTERS</p>
          <p className="sidebar-filters">3000/3000</p>
          <button className="reset-button">Reset</button>
        </div>
        <div className="sidebar-inputs">
          {/* Search Input */}
          <input type="text" placeholder="Search..." className="search-input" />

          {/* Dropdown Select Fields */}
          <div className="select-container">
            <BsPinMapFill className="select-icon" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="sidebar-input"
            >
              <option value="">Select Sector</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div className="select-container">
            <BsThermometerHigh className="select-icon" />
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="sidebar-input"
            >
              <option value="">Disease</option>
              {diseases.map((disease) => (
                <option key={disease} value={disease}>
                  {disease}
                </option>
              ))}
            </select>
          </div>

          <div className="select-container">
            <BsHospitalFill className="select-icon" />
            <select
              value={selectedFacilityType}
              onChange={(e) => setSelectedFacilityType(e.target.value)}
              className="sidebar-input"
            >
              <option value=""> Facility Type </option>
              {facilityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="select-container">
  <BsTools className="select-icon" />
  <select
    value={selectedEquipment}
    onChange={(e) => setSelectedEquipment(e.target.value)}
    className="sidebar-input"
  >
    <option value="">Equipment</option>
    {equipments && equipments.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>
</div>


        </div>
      </div>


      <div className="viebeg-dashboard-main-content">
  {/* Main content of the dashboard goes here */}
  <h1 className="dashboard-title">Viebeg Health Assessment and Capacity Evaluation Tool (HACET)</h1>
  <p className="dashboard-description">Explore and manage your healthcare data with ease.</p>

  <hr className="divider" />



          {selectedSector && (
            <div className="selected-item-heading">
              <h2>Selected Sector:</h2> <p>{selectedSector} Sector</p>
            </div>
          )}

<div>
 {/* Display heading based on the selected disease */}
 {selectedDisease && (
            <div className="selected-item-heading">
              <h2>Selected Disease:</h2> <p>{selectedDisease}</p>
            </div>
          )}
          
   {selectedFacilityType && (
            <div className="selected-item-heading">
              <h2>Selected Facility Type:</h2> <p>{selectedFacilityType}</p>
            </div>
          )}

{selectedEquipment && (
            <div className="selected-item-heading">
              <h2>Selected Equipment:</h2> <p>{selectedEquipment}</p>
            </div>
          )}

          </div>

          </div>

      </div>
    </div>
  );
};

export default ViebegDashboard;