// src/pages/doctor/Inicio.jsx
import React from 'react';
import '../../assets/styles/doctor/inicio.css';
import DoctorLayout from './DoctorLayout';

const Inicio = () => {
  return (
    <DoctorLayout>
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
    </DoctorLayout>
  );
};

export default Inicio;
