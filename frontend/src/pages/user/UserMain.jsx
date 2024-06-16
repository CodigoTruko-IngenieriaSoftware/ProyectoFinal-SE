import React, { useState, useEffect, useRef } from "react";
import Layout from "./LayoutUser.jsx";
import AddElement from "../components/AddElement.jsx";

import "../../assets/styles/user/User.css";

function UserMain() {
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [appointmentReason]);

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
            <p className="user-text">Nuestros mejores doctores te atenderán</p>
            <button className="btn-make-apointment" onClick={togglePopup}>
              Has click aquí
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
                        Escoge una fecha y hora
                      </p>
                      <input
                        type="datetime-local"
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
                    <button className="setAppointment">AGENDAR CITA</button>
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
          </div>
        </div>
      </Layout>
    </>
  );
}

export default UserMain;
