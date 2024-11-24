import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./LayoutPatient";
import "../../assets/styles/assistant/Citas.css";
import Modal from "./Modal"; // Asumiendo que tienes un componente Modal para mostrar confirmaciones
import { useNavigate } from "react-router-dom";

function Citas() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [citas, setCitas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelAppointmentId, setCancelAppointmentId] = useState(null);
  const [error, setError] = useState("");

  const stateMapping = {
    pending_approval: "Pendiente de aprobación",
    pending_execution: "Pendiente de ejecución",
    in_execution: "En ejecución",
    finished: "Finalizada",
    rejected: "Rechazada",
    cancelled: "Cancelada",
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const userData = localStorage.getItem("userData");
      const user = JSON.parse(userData);
      const roles = user.role.map((role) => role.name);
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

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/own-approve`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const appointmentsData = response.data.data;
      setAppointments(appointmentsData);
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handleGetList = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const userData = localStorage.getItem("userData");
      const user = JSON.parse(userData);
      const username = user.username;

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/own-approve`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const citasData = response.data.data.filter(
        (cita) => cita.user.username === username
      );
      setCitas(citasData);
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/cancel`,
        { appointmentId: cancelAppointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      
      setModalOpen(false);

      if (response.data.message === "OK") {
        fetchAppointments();
      } else {
        setError("Failed to cancel appointment");
      }
    } catch (error) {
      setError(
        "Failed to cancel appointment: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
    handleGetList();

    const interval = setInterval(() => {
      fetchAppointments();
    }, 5000); // Actualizar automáticamente cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const openModal = (appointmentId) => {
    setCancelAppointmentId(appointmentId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Layout>
      <div className="content">
        <h2 className="tittle">Mis Citas</h2>
        <div className="citas-container">
          {citas.map((cita, index) => (
            <div key={index} className="paciente">
              <div>
                <p className="info-tittle">Nombre</p>
                <p>{cita.user.username}</p>
              </div>
              <div>
                <p className="info-tittle">Descripción</p>
                <p>{cita.reason || "No proporcionada"}</p>
              </div>
              <div>
                <p className="info-tittle">Fecha Solicitada</p>
                <p>{cita.date || "Fecha no definida"}</p>
              </div>
              <div>
                <p className="info-tittle">Estado</p>
                <p>{stateMapping[cita.state] || "Desconocido"}</p>
              </div>
              {cita.state === "pending_approval" && (
                <button onClick={() => openModal(cita.id)}>
                  Cancelar cita
                </button>
              )}
            </div>
          ))}
        </div>
        <Modal isOpen={modalOpen} onClose={closeModal}>
          <h2>¿Estás seguro de cancelar esta cita?</h2>
          <div className="modal-buttons">
            <button onClick={handleCancelAppointment}>Confirmar</button>
            <button onClick={closeModal}>Cancelar</button>
          </div>
        </Modal>
        {error && <p>{error}</p>}
      </div>
    </Layout>
  );
}

export default Citas;