// src/pages/doctor/Inicio.jsx
import React from 'react';
import '../../assets/styles/doctor/inicio.css';
import DoctorLayout from './DoctorLayout';
import doctoresImage from '../../assets/images/Doctores.png';

const Inicio = () => {
  return (
    <DoctorLayout>
      <div className="inicio-container">
        <div className="main-content">
          <img src={doctoresImage} alt="Doctores" className="doctores-image" />
          <div className="text-container">
            <h1>Ya Merito</h1>
            <p>La mejor atención médica a tu alcance. Nuestro compromiso es tu salud y bienestar. Ven y descubre la diferencia en nuestra clínica.</p>
          </div>
        </div>

        <div className="testimonials">
          <h2>Testimonios de Pacientes</h2>
          <p>"La atención en Ya Merito es excepcional. Me sentí muy cuidado y atendido."</p>
          <p>"Los doctores son muy profesionales y amables. Recomiendo esta clínica a todos."</p>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Inicio;
