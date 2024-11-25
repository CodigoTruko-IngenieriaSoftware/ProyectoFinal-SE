import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import Overlay from "./OverlayForm";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/assistant/Citas.css";

function Citas() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("HourForm");

  const [entryHour, setEntryHour] = useState("");
  const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState("");

  const [doctors, setDoctors] = useState([
    {
      doctor: "Selecciona un doctor",
      specialty: "Selecciona una especialidad",
    },
  ]);
  const [selectedDoctors, setSelectedDoctors] = useState([
    "Selecciona un doctor",
  ]);
  const [specialties, setSpecialties] = useState([
    { name: "Selecciona una especialidad" },
  ]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([
    "Selecciona una especialidad",
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(null);

  const [doctorCount, setDoctorCount] = useState(1); // Para manejar múltiples selecciones de doctores si necesario
  const [rejectInfo, setRejectInfo] = useState({ isOpen: false, index: null });
  const [aproveInfo, setAproveInfo] = useState({ isOpen: false, index: null });
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
    handleGetList();
  }, []);

  const toggleOverlay = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setActiveForm("HourForm");
    }
  };

  const isFormValid = () => {
    const minutes = parseInt(estimatedTimeMinutes, 10);
    return (
      entryHour.trim() !== "" &&
      !isNaN(minutes) &&
      minutes >= 0 &&
      minutes <= 240
    );
  };

  const handleNext = () => {
    setActiveForm("DoctorForm");
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleDoctorSelect = (doctor, index) => {
    const updatedDoctors = [...selectedDoctors];
    updatedDoctors[index] = doctor.username;
    setSelectedDoctors(updatedDoctors);
    setDropdownOpen(null);
  };

  const getAvailableDoctors = () => {
    return doctors.filter(
      (doc) => doc.available && !selectedDoctors.includes(doc.username)
    );
  };

  const toggleSpecialtyDropdown = (index) => {
    setSpecialtyDropdownOpen(specialtyDropdownOpen === index ? null : index);
  };

  const handleSpecialtySelect = (specialty, index) => {
    const updatedSpecialties = [...selectedSpecialties];
    updatedSpecialties[index] = specialty.name;
    setSelectedSpecialties(updatedSpecialties);
    setSpecialtyDropdownOpen(null);
  };

  const getAvailableSpecialties = () => specialties;

  const addDoctor = () => {
    if (doctorCount < doctors.length) {
      const newDoctor = "Selecciona un doctor";
      const newSpecialty = "Selecciona una especialidad";
      setSelectedDoctors([...selectedDoctors, newDoctor]);
      setSelectedSpecialties([...selectedSpecialties, newSpecialty]);
      setDoctorCount(doctorCount + 1);
    }
  };

  const removeDoctor = () => {
    if (doctorCount > 1) {
      selectedDoctors.pop();
      selectedSpecialties.pop();
      setSelectedDoctors([...selectedDoctors]);
      setSelectedSpecialties([...selectedSpecialties]);
      setDoctorCount(doctorCount - 1);
    }
  };

  // LOGICA DE CONEXIÓN CON API
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/all-doctors`, { headers: { Authorization: `Bearer ${token}` } });
      setDoctors(response.data.data.map(doc => ({ ...doc, available: true })));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/specialty/`, { headers: { Authorization: `Bearer ${token}` } });
      setSpecialties(response.data.data);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  };

  const handleGetList = async () => {
    try {
      console.log("Obteniendo citas..."); // Indica que se inicia la llamada

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta de la API (citas):", response.data); // Depura la respuesta completa

      setCitas(response.data.data); // Guarda las citas en el estado

      const userData = localStorage.getItem("userData");
      const user = JSON.parse(userData);

      console.log("Datos del usuario desde localStorage:", user); // Muestra los datos del usuario

      const roles = user.role.map((role) => role.name);

      console.log("Roles del usuario:", roles); // Lista los roles del usuario

      // Navegación según el rol del usuario
      if (!roles.includes("assistant")) {
        if (roles.includes("sysadmin")) {
          navigate("/ChangeRole");
        } else if (roles.includes("doctor")) {
          navigate("/doctor");
        } else if (roles.includes("asistant")) {
          navigate("/Assistant");
        } else if (roles.includes("patient")) {
          navigate("/patient");
        } else {
          console.error("Rol desconocido:", user.role);
          navigate("/User");
        }
      }
    } catch (error) {
      console.error(
        "Error al obtener citas:",
        error.response ? error.response.data : "Error sin respuesta"
      );
    }
  };


  const handleConfirmApprove = async (index) => {
    const appointmentId = citas[index].id;
    const userSpecialty = selectedDoctors.map((doctor, idx) => [
      doctor,
      selectedSpecialties[idx],
    ]);

    const data = {
      appointmentId: appointmentId,
      entryHour: entryHour,
      estimatedTimeMinutes: estimatedTimeMinutes,
      user_specialty: userSpecialty,
    };

    console.log(data);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/approve`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedDoctors = doctors.map((doc) => {
          if (userSpecialty.some((us) => us[0] === doc.username)) {
            return { ...doc, available: true };
          }
          return doc;
        });

        setDoctors(updatedDoctors);
        setIsOpen(false);
        setActiveForm(null);
        handleGetList();
      }
      console.log("Respuesta de la aprobación:", response.data);
    } catch (error) {
      console.error(
        "Error al aprobar la cita:",
        error.response ? error.response.data : "Error sin respuesta"
      );
    }
  };

  const handleReject = (index) => {
    setActiveForm("RejectForm");
    setIsOpen(true);
    setRejectInfo({ index: index });
  };

  const handleAprove = (index) => {
    setActiveForm("HourForm");
    setIsOpen(true);
    setAproveInfo({ index: index });
  };

  const handleConfirmRejection = async (index) => {
    const appointmentId = citas[index].id;

    const data = {
      appointmentId: appointmentId,
    };

    console.log(data);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/reject`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Respuesta de cancelación:", response.data);
      setIsOpen(false);
      setActiveForm(null);
      handleGetList();
    } catch (error) {
      console.error(
        "Error al cancelar la cita:",
        error.response ? error.response.data : "Error sin respuesta"
      );
    }
  };

  return (
    <Layout>
      <div className="content">
        <h2 className="tittle">Citas Pendientes de Aprobación</h2>
        <div className="appointments-list-astnt">
          {citas.map((cita, index) => (
            <div key={index} className="appointment-item">
              <div className="appointment-item-content">
                <div className="appointment-item-text-astnt">
                  <p className="info-tittle">Nombre</p>
                  <p>{cita.user.username}</p>
                </div>
                <div className="appointment-item-text-astnt">
                  <p className="info-tittle">Descripción</p>
                  <p>{cita.reason || "No proporcionada"}</p>
                </div>
                <div className="appointment-item-text-astnt">
                  <p className="info-tittle">Fecha Solicitada</p>
                  <p>{cita.date || "Fecha no definida"}</p>
                </div>
                <div className="appointment-item-text-astnt">
                  <p className="info-tittle">Estado</p>
                  <div className="btns-container">
                    {cita.state === "pending_execution" && <p>Aprobada</p>}
                    {cita.state === "rejected" && <p>Rechazada</p>}
                    {cita.state === "finished" && <p>finalizado</p>}
                    {cita.state === "in_execution" && <p>En ejecución</p>}
                    {cita.state === "cancelled" && <p>Cancelada</p>}
                    {cita.state === "pending_approval" && (
                      <>
                        <button
                          onClick={() => {
                            handleAprove(index);
                          }}
                          className="start-button"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(index)}
                          className="finish-button"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                  <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                    {activeForm === "HourForm" && (
                      <div className="popup-container">
                        <h2 className="popup-header">Aprobar Cita</h2>
                        <div className="popup-input-container">
                          <p className="popup-label">Hora que se aprobará:</p>
                          <input
                            type="time"
                            className="popup-input time-input"
                            value={entryHour}
                            onChange={(e) => setEntryHour(e.target.value)}
                            placeholder="Hora de entrada"
                          />
                        </div>
                        <div className="popup-input-container">
                          <p className="popup-label">Duración estimada:</p>
                          <input
                            type="number"
                            className="popup-input duration-input"
                            value={estimatedTimeMinutes}
                            onChange={(e) => setEstimatedTimeMinutes(e.target.value)}
                            placeholder="Duración estimada en minutos"
                            min="0"
                            max="240"
                          />
                        </div>
                        <button
                          onClick={handleNext}
                          className="popup-btn approve-btn"
                          disabled={!isFormValid()}
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                    {activeForm === "DoctorForm" && (
                      <div className="popup-container">
                      <h2 className="popup-header">Seleccionar Doctores</h2>
                      <div className="doctors-container">
                        {selectedDoctors.map((selectedDoctor, index) => (
                          <div key={index} className="doctor-selection">
                            <div className="popup-input-group">
                              <p className="popup-label">Doctor:</p>
                              <button
                                onClick={() => toggleDropdown(index)}
                                className="popup-dropdown-btn"
                              >
                                {selectedDoctor} &#9660;
                              </button>
                              {dropdownOpen === index && (
                                <ul className="dropdown-list">
                                  {getAvailableDoctors().map((doc, idx) => (
                                    <li
                                      key={idx}
                                      onClick={() => handleDoctorSelect(doc, index)}
                                      className="dropdown-item"
                                    >
                                      {doc.username}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="popup-input-group">
                              <p className="popup-label">Especialidad:</p>
                              <button
                                onClick={() => toggleSpecialtyDropdown(index)}
                                className="popup-dropdown-btn"
                              >
                                {selectedSpecialties[index]} &#9660;
                              </button>
                              {specialtyDropdownOpen === index && (
                                <ul className="dropdown-list">
                                  {getAvailableSpecialties().map((specialty, idx) => (
                                    <li
                                      key={idx}
                                      onClick={() => handleSpecialtySelect(specialty, index)}
                                      className="dropdown-item"
                                    >
                                      {specialty.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="btn-container">
                        <div className="doctor-count-container">
                          <button
                            id="remove-doc-btn"
                            className="popup-btn-secondary count-btn"
                            onClick={removeDoctor}
                            disabled={doctorCount <= 1}
                          >
                            -
                          </button>
                          <p className="doctor-count">{doctorCount}</p>
                          <button
                            id="add-doc-btn"
                            className="popup-btn-secondary count-btn"
                            onClick={addDoctor}
                            disabled={doctorCount >= doctors.length}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleConfirmApprove(aproveInfo.index)}
                          className="popup-btn approve-btn"
                        >
                          Finalizar
                        </button>
                      </div>
                    </div>                    
                
                    )}
                    {activeForm === "RejectForm" && (
                      <div className="popup-container reject-popup">
                        <h2 className="popup-header">Confirmar Rechazo</h2>
                        <p className="popup-text">¿Estás seguro de que quieres rechazar esta cita?</p>
                        <div className="btns-container">
                          <button
                            onClick={() => handleConfirmRejection(rejectInfo.index)}
                            className="popup-btn reject-confirm-btn"
                          >
                            Confirmar
                          </button>
                          <button onClick={toggleOverlay} className="popup-btn popup-btn-secondary">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </Overlay>

                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
    </Layout>
  );
}

export default Citas;
