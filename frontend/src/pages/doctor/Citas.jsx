// src/pages/doctor/Citas.jsx
import React, { useState, useEffect } from 'react';
import '../../assets/styles/doctor/citas.css';
import DoctorLayout from './DoctorLayout';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Citas = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10);
  const [date, setDate] = useState(formattedDate);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, [date]);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        navigate('/');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/clinic/schedule', {
        params: { date },
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const appointmentsData = response.data.data.appointments;
      setAppointments(appointmentsData);

    } catch (error) {
      setError('Failed to fetch data: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleStartAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        navigate('/');
        return;
      }

      const requestData = { appointmentId };

      await axios.post(`http://localhost:8080/api/appointment/start`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // Fetch appointments again to update the state
      fetchSchedule();
    } catch (error) {
      console.error('Error al iniciar la cita:', error.response ? error.response.data.message : 'Error sin respuesta');
    }
  };

  const handleFinishAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        navigate('/');
        return;
      }

      const requestData = { appointmentId };

      await axios.post(`http://localhost:8080/api/appointment/finish`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // Fetch appointments again to update the state
      fetchSchedule();
    } catch (error) {
      console.error('Error al finalizar la cita:', error.response ? error.response.data.message : 'Error sin respuesta');
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

        {error && <p className="error-message">{error}</p>}

        <ul className="appointments-list">
          {appointments.map((appointment) => (
            <li key={appointment.appointmentId} className="appointment-item">
              <div className="appointment-item-content">
                <div className="appointment-item-text">
                  <h3><strong>Paciente:</strong> {appointment.patient.patientUsername}</h3>
                  <p><strong>ID de la cita:</strong> {appointment.appointmentId}</p>
                  <p><strong>Hora de entrada:</strong> {appointment.appointmentEntryHour}</p>
                  <p><strong>Hora estimada fin:</strong> {appointment.appointmentEstimatedEndHour}</p>
                  <p><strong>Estado:</strong> {appointment.appointmentState}</p>
                </div>
                <div className="appointment-item-buttons">
                  {appointment.appointmentState !== 'finished' && (
                    <>
                      <button onClick={() => handleStartAppointment(appointment.appointmentId)} className="toggle-button start-button">
                        Iniciar Cita
                      </button>
                      <button onClick={() => handleFinishAppointment(appointment.appointmentId)} className="toggle-button finish-button">
                        Finalizar Cita
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DoctorLayout>
  );
};

export default Citas;
