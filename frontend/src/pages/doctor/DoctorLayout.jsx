import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import '../../assets/styles/assistant/Layout.css';

const DoctorLayout = ({ children }) => {
    const nav = useNavigate();
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navigateTo = (path) => {
        nav(path);
    };

    const getActiveNav = () => {
        switch (location.pathname) {
            case '/Doctor':
                return 'Inicio';
            case '/appointment':
                return 'appointment';
            case '/PrescriptionDoctor':
                return 'Prescription';
            default:
                return 'Inicio';
        }
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleCloseModal = () => {
        setShowLogoutModal(false);
    };

    const handleConfirmLogout = () => {
        localStorage.clear();
        nav('/');
    };

    return (
        <div className="main-container">
            <header>
                <div className="logo">Clinica Ya Merito</div>
                <nav className="nav">
                    <ul className="menu">
                        <li className={`navElement ${getActiveNav() === 'Inicio' ? 'active' : ''}`}
                            onClick={() => navigateTo('/Doctor')}>Doctor</li>
                        <li className={`navElement ${getActiveNav() === 'appointment' ? 'active' : ''}`}
                            onClick={() => navigateTo('/appointment')}>Citas</li>
                        <li className={`navElement ${getActiveNav() === 'Records' ? 'active' : ''}`}
                            onClick={() => navigateTo('/PrescriptionDoctor')}>Prescripciones</li>
                        <li className="navElement logout" onClick={handleLogout}>Logout</li>
                    </ul>
                </nav>
            </header>
            <div className="main-content">
                {children}
            </div>
            <LogoutModal 
                show={showLogoutModal} 
                handleClose={handleCloseModal} 
                handleConfirm={handleConfirmLogout} 
            />
        </div>
    );
};

export default DoctorLayout;
