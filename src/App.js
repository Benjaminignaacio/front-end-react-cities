import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Crear un componente Sidebar
import StreetForm from './components/StreetForm';
import StreetsTable from './components/StreetsTable';
import RegionsTable from './components/RegionsTable';
const App = () => {
  return (
    <Router>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Routes>
              <Route path="/" element={<StreetForm />} />
              <Route path="/streets" element={<StreetsTable />} />
              <Route path="/regions" element={<RegionsTable />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
