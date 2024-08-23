import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 


const Sidebar = () => {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <div className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">DASHBOARD</div>
      </div>

      <hr className="sidebar-divider my-0" />

      <li className="nav-item active">
        <Link className="nav-link" to="/">
          <i className="fas fa-fw fa-plus"></i>
          <span>Ingresar Calles</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />

      <li className="nav-item">
        <Link className="nav-link" to="/streets">
          <i className="fas fa-fw fa-map-marker-alt"></i> 
          <span>Calles</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/regions">
          <i className="fas fa-fw fa-globe"></i> 
          <span>Regiones</span>
        </Link>
      </li>

      <hr className="sidebar-divider d-none d-md-block" />
      
   
      <li className="nav-item">
        <div className="text-center">
          <button className="btn btn-primary rounded-circle p-3" id="sidebarToggle">
        
          </button>
        </div>
      </li>
    </ul>
  );
};

export default Sidebar;
