import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import '../../assets/styles/assistant/Layout.css';

const Layout = ({ children }) => {
    const nav = useNavigate();
    const location = useLocation(); // Para saber en que ruta esta actualmente.

    const navigateTo = (path) => {
        nav(path);
    };

    const handleLogout = () => {
        localStorage.clear();
        nav('/');
    };

    const getActiveNav = () => {
        switch (location.pathname) {
            case '/User':
                return 'Inicio';
            case '/MisCitas':
                return 'MisCitas';
            case '/Prescripcion':
                return 'Prescripción';
            case '/Profile':
                return 'Profile';
            default:
                return ''; // Retorna una cadena vacía si no hay coincidencias
        }
    };


    return (
        <div className="main-container">
            <header>
                <div className="logo">Clinica Ya Merito</div>
                <nav className="nav">
                    <ul className="menu">
                        <li
                            className={`navElement ${getActiveNav() === 'Inicio' ? 'active' : ''}`}
                            onClick={() => navigateTo('/User')}
                        >
                            Agendar cita
                        </li>
                        <li
                            className={`navElement ${getActiveNav() === 'MisCitas' ? 'active' : ''}`}
                            onClick={() => navigateTo('/MisCitas')}
                        >
                            Mis citas
                        </li>
                        <li className="navElement logout" onClick={handleLogout}>
                            Logout
                        </li>
                    </ul>
                </nav>
            </header>
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default Layout;
