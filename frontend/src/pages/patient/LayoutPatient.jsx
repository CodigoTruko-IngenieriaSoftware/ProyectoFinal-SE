import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutModal from './LogoutModal';

import '../../assets/styles/assistant/Layout.css';

const Layout = ({ children }) => {
    const nav = useNavigate();
    const location = useLocation(); // Para saber en que ruta esta actualmente.
    const [showLogoutModal, setShowLogoutModal] = useState(false);


    const navigateTo = (path) => {
        nav(path);
    };

    const getActiveNav = () => {
        switch (location.pathname) {
            case '/User ':
                return 'Inicio';
            case '/CitasPatient':
                return 'Citas';
            case '/MyRecord':
                return 'Mi Historial';
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
                            onClick={() => navigateTo('/Patient')}>Inicio</li>
                            <li className={`navElement ${getActiveNav() === 'Citas' ? 'active' : ''}`}
                            onClick={() => navigateTo('/CitasPatient')}>Citas</li>
                        <li className={`navElement ${getActiveNav() === 'Mi Historial' ? 'active' : ''}`}
                            onClick={() => navigateTo('/MyRecord')}>Mi Historial</li>
                        <li className="navElement logout" onClick={handleLogout}>Logout</li>
                    </ul>
                </nav>
            </header>
            <div className="main-content">
                { children }
            </div>
            <LogoutModal 
                show={showLogoutModal} 
                handleClose={handleCloseModal} 
                handleConfirm={handleConfirmLogout} 
            />
        </div>
    );
};

export default Layout;
