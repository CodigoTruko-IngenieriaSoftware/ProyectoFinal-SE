import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import '../../assets/styles/assistant/Layout.css';

const Layout = ({ children }) => {
    const nav = useNavigate();
    const location = useLocation(); // Para saber en que ruta esta actualmente.

    const navigateTo = (path) => {
        nav(path);
    };

    const getActiveNav = () => {
        switch (location.pathname) {
            case '/Assistant':
                return 'Inicio';
            case '/Cita':
                return 'Citas';
            case '/Prescripcion':
                return 'Prescripción';
            default:
                return 'Inicio';
        }
    };

    return (
        <div className="main-container">
            <header>
                <div className="logo">Clinica Ya Merito</div>
                <nav className="nav">
                    <ul className="menu">
                        <li className={`navElement ${getActiveNav() === 'Inicio' ? 'active' : ''}`}
                            onClick={() => navigateTo('/Assistant')}>Inicio</li>
                        <li className={`navElement ${getActiveNav() === 'Citas' ? 'active' : ''}`}
                            onClick={() => navigateTo('/Cita')}>Citas</li>
                        <li className={`navElement ${getActiveNav() === 'Prescripción' ? 'active' : ''}`}
                            onClick={() => navigateTo('/Prescripcion')}>Prescripción</li>
                    </ul>
                </nav>
            </header>
            <div className="main-content">
                { children }
            </div>
        </div>
    );
};

export default Layout;