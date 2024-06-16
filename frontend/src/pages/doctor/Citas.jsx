// src/pages/doctor/Citas.jsx
import React, { useState } from 'react';
import { appointments as initialAppointments } from '../../constants/appointments'; // Archivo de constantes de citas
import '../../assets/styles/doctor/citas.css';
import DoctorLayout from './DoctorLayout';

const Citas = () => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleOpenAppointment = (id) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === id ? { ...appointment, status: 'open' } : appointment
      )
    );
  };

  const handleCloseAppointment = (id) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === id ? { ...appointment, status: 'closed' } : appointment
      )
    );
  };

  return (
    <DoctorLayout>
      <div className="appointments-container">
        <h2>Citas</h2>
        <ul className="appointments-list">
          {appointments.map(appointment => (
            <li key={appointment.id} className={`appointment-item ${appointment.status}`}>
              <div className="appointment-item-content">
                <div className="appointment-item-text">
                  <h3>{appointment.patientName}</h3>
                  <p>Hora de la cita: {appointment.time}</p>
                  <p>Status: {appointment.status === 'open' ? 'Abierta' : appointment.status === 'closed' ? 'Cerrada' : 'Pendiente'}</p>
                </div>
                {appointment.status === 'open' ? (
                  <button onClick={() => handleCloseAppointment(appointment.id)} className="toggle-button close-button">
                    Cerrar Cita
                  </button>
                ) : appointment.status === '' && (
                  <button onClick={() => handleOpenAppointment(appointment.id)} className="toggle-button open-button">
                    Abrir Cita
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DoctorLayout>
  );
};

export default Citas;
