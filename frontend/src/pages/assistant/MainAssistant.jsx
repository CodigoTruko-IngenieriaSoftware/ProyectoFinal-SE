import React from 'react';
import Layout from './Layout.jsx';


function Inicio() {
    return (
        <Layout>
            <div className="inicio-container">
                <div className="main-content">
                <img
                    src="src/assets/images/doctor-1.png"
                    alt="Imagen de un doctor"
                    className="sesion-img"
                />
                <div className="logo">
                    <h1 className="logo-title">YA</h1>
                    <h1 className="logo-title">MERITO</h1>
                    <p className="logo-text">La clínica perfecta</p>
                </div>
                </div>
            </div>
        </Layout>
    );
}

export default Inicio;