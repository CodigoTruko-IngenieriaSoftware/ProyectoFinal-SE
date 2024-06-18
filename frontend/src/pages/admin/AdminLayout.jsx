import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import '../../assets/styles/assistant/Layout.css';

const AdminLayout = ({ children }) => {
    const nav = useNavigate();
    const location = useLocation();

    const navigateTo = (path) => {
        nav(path);
    };

    const getActiveNav = () => {
        switch (location.pathname) {
            case '/Change Role':
                return 'Roles';
            case '/Cita':
                return 'Citas';
            case '/Prescripcion':
                return 'Historial Medico';
            default:
                return 'Roles';
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        nav('/');
    };

    return (
        <div className="main-container">
            <header>
                <div className="logo">Clinica Ya Merito</div>
                <nav className="nav">
                    <ul className="menu">
                        <li className={`navElement ${getActiveNav() === 'Roles' ? 'active' : ''}`}
                            onClick={() => navigateTo('/ChangeRole')}>Roles</li>
                        <li className="navElement logout" onClick={handleLogout}>Logout</li>
                    </ul>
                </nav>
            </header>
            <div className="main-content">
                { children }
            </div>
        </div>
    );
};

export default AdminLayout;