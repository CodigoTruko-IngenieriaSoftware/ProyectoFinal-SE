import React, { useState, useEffect, useRef } from "react";
import Layout from "./LayoutPatient.jsx";
import AddElement from "../components/AddElement.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/user/User.css";

function Patient() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  const navToRegister = () => {
    navigate("/");
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 3)); // Hay 3 pasos en total
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const textareaRef = useRef(null);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [appointmentState, setAppointmentState] = useState(''); // Inicialmente vacío
  const [appointments, setAppointments] = useState([]);

  const stateMapping = {
    "pending_approval": "Pendiente de aprobación",
    "pending_execution": "Pendiente de ejecución",
    "in_execution": "En ejecución",
    "completed": "Finalizada",
    "rejected": "Rechazada",
    "cancelled": "Cancelada"
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [appointmentReason]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        navigate('/');
        return;
      }
      
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/appointment/own`, {
        params: { state: 'pending_approval' },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const appointment = response.data.data.find(appointment => appointment.state === 'pending_approval');
      setAppointments(response.data.data);
      setAppointmentState(appointment ? appointment.state : '');

    } catch (error) {
      console.error('Error fetching appointment state:', error.response ? error.response.data.message : 'Error sin respuesta');
    }
  };

  const handleSubmit = async () => {
    console.log("Intentando agendar cita con:", appointmentDate, appointmentReason);

    const data = {
      date: appointmentDate,
      reason: appointmentReason,
    };

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        navToRegister();
        return;
      }

      const userData = localStorage.getItem("userData");

      const user = JSON.parse(userData)


      const roles = user.role.map(role => role.name);
      if (!roles.includes("patient")) {
        if (roles.includes("sysadmin")) {
          navigate("/ChangeRole");
        } else if (roles.includes("doctor")) {
          navigate("/doctor");
        } else if (roles.includes("assistant")) {
          navigate("/Assistant");
        } else if (roles.includes("patient")) {
          navigate("/patient");
        } else {
          console.error("Unknown role:", user.role);
          navigate("/User");
        }
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/appointment/request`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log("Cita registrada:", response.data);
      setMessage('Cita registrada con éxito');
      setShowMessage(true);

      // Cerrar el popup y reiniciar los campos
      setShowPopup(false);
      setAppointmentDate("");
      setAppointmentReason("");
      setCurrentStep(1);

      // Fetch appointments after submitting
      fetchAppointments();

    } catch (error) {
      console.error('Error para registrar la cita:', error.response ? error.response.data.message : 'Error sin respuesta');
      setMessage('Error al registrar la cita');
      setShowMessage(true);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Actualizar automáticamente la lista de citas cada 60 segundos
    const interval = setInterval(() => {
      fetchAppointments();
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <>
      <Layout>
        <div className="main-container-user">
          <img
            src="src/assets/images/doctor-1.png"
            alt=""
            className="user-img"
          />
          <div className="cita-container">
            <p className="user-title">¿Quieres agendar una cita?</p>
            <p className="user-text">Nuestros mejores doctores te atenderán.</p>
            <button className="btn-make-apointment" onClick={togglePopup}>
              ¡Haz click aquí!
            </button>

            <AddElement show={showPopup} handleClose={togglePopup}>
              <div className="setps">
                {currentStep === 1 && (
                  <div
                    className={`step-1 ${currentStep === 1 ? "active" : ""}`}
                  >
                    <div className="elements-popup">
                      <p className="appointment-title">Agenda una cita</p>
                      <p className="appointment-text">
                        Escoge una fecha
                      </p>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div
                    className={`step-2 ${currentStep === 2 ? "active" : ""}`}
                  >
                    <div className="elements-popup">
                      <p className="appointment-title">Agenda una cita</p>
                      <p className="appointment-text">
                        Escribe la razón por la que quieres agendar cita
                      </p>
                      <textarea
                        ref={textareaRef}
                        placeholder="Razón de cita"
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        rows={1}
                        style={{
                          width: "300px", // Ancho específico
                          overflow: "hidden",
                          resize: "none",
                        }}
                      />
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div
                    className={`step-3 ${currentStep === 3 ? "active" : ""}`}
                  >
                    <div className="elements-popup">
                      <p className="appointment-title">Resumen</p>
                      <p className="reason"><strong>Fecha y hora:</strong></p>
                      <div className="summary">
                        {appointmentDate}
                      </div>
                      <p className="reason"><strong>Razón de cita:</strong></p>
                      <div className="summary">
                        {appointmentReason}
                      </div>
                      <button className="setAppointment" onClick={handleSubmit}>AGENDAR CITA</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="navigation-buttons">
                {currentStep > 1 && (
                  <button onClick={prevStep} className="step-btn">
                    Anterior
                  </button>
                )}
                {currentStep < 3 && (
                  <button onClick={nextStep} className="step-btn">
                    Siguiente
                  </button>
                )}
              </div>
            </AddElement>
            {showMessage && <div className="message-popup">{message}</div>}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Patient;
