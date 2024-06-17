// src/pages/doctor/Citas.jsx
import React, { useState, useEffect } from 'react';
import { appointments as initialAppointments } from '../../constants/appointments'; // Archivo de constantes de citas
import '../../assets/styles/doctor/citas.css';
import DoctorLayout from './DoctorLayout';
import axios from 'axios';


const Citas = () => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10);
  const [date, setDate] = useState(formattedDate);
  const [scheduleData, setScheduleData] = useState();
  const [error, setError] = useState('');


  useEffect(() => {
    fetchSchedule();

  }, [])


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


  const fetchSchedule = async()=> {

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        navigate('/');
        return;
      }

      const requestData = {
        date
      };

      const response = await axios.get('http://localhost:8080/api/clinic/schedule', {
        params: requestData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      setScheduleData(response.data.data.appointments);

      console.log(scheduleData);

    } catch (error) {
      setError('Failed to fetch data: ' + (error.response ? error.response.data.message : error.message));
  }

  };

  return (
    <DoctorLayout>
      <div className="appointments-container">
        <h2>Horarios de citas</h2>

        <label>
            Buscar por fecha
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>

        <button onClick={fetchSchedule}>Buscar</button>


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
