import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerList from './CustomerList'; // Make sure the path is correct
import Region from './Region'; // Make sure the path is correct
import HealthFacility from './HealthFacility';
import Dashboard from './Dashboard';
import ViebegDashboard from './ViebegDashboard';



function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
          <Route path="/" exact element={<CustomerList/>} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
