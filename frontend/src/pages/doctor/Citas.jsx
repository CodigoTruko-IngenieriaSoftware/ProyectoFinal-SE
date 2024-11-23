import React, { useState, useEffect } from "react";
import "../../assets/styles/doctor/citas.css";
import DoctorLayout from "./DoctorLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Citas = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10);
  const [date, setDate] = useState(formattedDate);
  const [error, setError] = useState("");

  const [newPrescription, setNewPrescription] = useState({
    appointmentId: "",
    prescriptions: [["", "", ""]],
  });
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

  useEffect(() => {
    fetchSchedule();
  }, [date]);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      if (!token) {
        console.error("No token found");
        navigate("/");
        return;
      }
      
      const user = JSON.parse(userData)

      const roles = user.role.map(role => role.name);
      if(!roles.includes("doctor")){
        if(roles.includes('sysadmin')){
          navigate('/ChangeRole');
        } else if (roles.includes('doctor')){
          navigate('/doctor');
        } else if (roles.includes('assistant')){
          navigate('/Assistant');
        } else if (roles.includes('patient')){
          navigate('/patient');
        } else {
          console.error('Unknown role:', user.role);
          navigate('/User');
      }
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/clinic/schedule`,
        {
          params: { date },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const appointmentsData = response.data.data.appointments;
      setAppointments(appointmentsData);
    } catch (error) {
      setError(
        "Failed to fetch data: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...newPrescription.prescriptions];
    updatedPrescriptions[index][field] = value;
    setNewPrescription({
      ...newPrescription,
      prescriptions: updatedPrescriptions,
    });
  };

  const handleAddPrescriptionField = () => {
    setNewPrescription({
      ...newPrescription,
      prescriptions: [...newPrescription.prescriptions, ["", "", ""]],
    });
  };

  const handleRemovePrescriptionField = (index) => {
    const updatedPrescriptions = [...newPrescription.prescriptions];
    updatedPrescriptions.splice(index, 1);
    setNewPrescription({
      ...newPrescription,
      prescriptions: updatedPrescriptions,
    });
  };

  const handleAddPrescription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(  
        `${import.meta.env.VITE_API_BASE_URL}/api/clinic/prescription`,
        newPrescription,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Prescripción agregada:", response.data);
      setShowModal(false); // Ocultar el modal después de agregar la prescripción

      // Limpiar los campos después de agregar la prescripción
      setNewPrescription({
        appointmentId: "",
        prescriptions: [["", "", ""]],
      });
    } catch (error) {
      console.error(
        "Error adding prescription:",
        error.response ? error.response.data.message : "Error sin respuesta"
      );
    }
  };

  const handleStartAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        navigate("/");
        return;
      }

      const requestData = { appointmentId };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/start`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch appointments again to update the state
      fetchSchedule();
    } catch (error) {
      console.error(
        "Error al iniciar la cita:",
        error.response ? error.response.data.message : "Error sin respuesta"
      );
    }
  };

  const handleFinishAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        navigate("/");
        return;
      }

      const requestData = { appointmentId };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/finish`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch appointments again to update the state
      fetchSchedule();
    } catch (error) {
      console.error(
        "Error al finalizar la cita:",
        error.response ? error.response.data.message : "Error sin respuesta"
      );
    }
  };

  return (
    <DoctorLayout>
      <div className="appointments-container">
        <h2>Horarios de citas</h2>

        <label>
          Buscar por fecha
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <button onClick={fetchSchedule}>Buscar</button>

        {error && <p className="error-message">{error}</p>}

        <ul className="appointments-list">
          {appointments.map((appointment) => (
            <li key={appointment.appointmentId} className="appointment-item">
              <div className="appointment-item-content">
                <div className="appointment-item-text">
                  <h3>
                    <strong>Paciente:</strong>{" "}
                    {appointment.patient.patientUsername}
                  </h3>
                  <p>
                    <strong>ID de la cita:</strong> {appointment.appointmentId}
                  </p>
                  <p>
                    <strong>Hora de entrada:</strong>{" "}
                    {appointment.appointmentEntryHour}
                  </p>
                  <p>
                    <strong>Hora estimada fin:</strong>{" "}
                    {appointment.appointmentEstimatedEndHour}
                  </p>
                  <p>
                    <strong>Estado:</strong> {appointment.appointmentState}
                  </p>
                </div>
                <div className="appointment-item-buttons">
                  {appointment.appointmentState !== "finished" && (
                    <>
                      <button
                        onClick={() =>
                          handleStartAppointment(appointment.appointmentId)
                        }
                        className="toggle-button start-button"
                      >
                        Iniciar Cita
                      </button>
                      <button
                        onClick={() =>
                          handleFinishAppointment(appointment.appointmentId)
                        }
                        className="toggle-button finish-button"
                      >
                        Finalizar Cita
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowModal(true);
                    setNewPrescription({
                      ...newPrescription,
                      appointmentId: appointment.appointmentId,
                    });
                  }}
                  className="add-prescription-btn"
                >
                  Añadir Prescripción
                </button>
                {showModal && (
                  <div className="modal-overlay-pre">
                    <div className="modal-pre">
                      <h2>Agregar Nueva Prescripción</h2>
                      <div className="prescription-form">
                        <div className="prescripciones">
                          {newPrescription.prescriptions.map(
                            (prescription, index) => (
                              <div key={index} className="prescription-inputs">
                                <input
                                  type="text"
                                  placeholder="Medicamento"
                                  value={prescription[0]}
                                  onChange={(e) =>
                                    handlePrescriptionChange(
                                      index,
                                      0,
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  placeholder="Instrucciones"
                                  value={prescription[1]}
                                  onChange={(e) =>
                                    handlePrescriptionChange(
                                      index,
                                      1,
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="date"
                                  value={prescription[2]}
                                  onChange={(e) =>
                                    handlePrescriptionChange(
                                      index,
                                      2,
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  onClick={() =>
                                    handleRemovePrescriptionField(index)
                                  }
                                  className="remove-btn"
                                >
                                  Quitar
                                </button>
                              </div>
                            )
                          )}
                        </div>
                        <button
                          onClick={handleAddPrescriptionField}
                          className="modal-btn"
                        >
                          Agregar Medicamento
                        </button>
                        <div className="action-btns-modal">
                          <button
                            onClick={handleAddPrescription}
                            className="modal-btn-save"
                          >
                            Guardar Prescripción
                          </button>
                          <button
                            onClick={() => setShowModal(false)}
                            className="close-modal-btn"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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