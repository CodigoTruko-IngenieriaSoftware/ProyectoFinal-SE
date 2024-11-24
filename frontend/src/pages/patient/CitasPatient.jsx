import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./LayoutPatient";
import "../user/Citas2.css";
import CitaCard from "../user/CitaCard"; // Subcomponente para una cita
import Modal from "./Modal"; // Asumiendo que tienes un componente Modal para mostrar confirmaciones
import { useNavigate } from "react-router-dom";

function Citas() {
  const navigate = useNavigate();

  const [citasAprobadas, setCitasAprobadas] = useState([]);
  const [citasPendientes, setCitasPendientes] = useState([]);
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

  const fetchCitas = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const userData = localStorage.getItem("userData");
      const user = JSON.parse(userData);
      const username = user.username;

      // Fetch citas aprobadas (pending_execution)
      const responseAprobadas = await axios.get(
        "https://hlvs.online/api/appointment/own",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            state: "pending_execution",
          },
        }
      );

      const citasAprobadasData = responseAprobadas.data.data.filter(
        (cita) => cita.user.username === username
      );

      setCitasAprobadas(citasAprobadasData);

      // Fetch citas pendientes de aprobación (pending_approval)
      const responsePendientes = await axios.get(
        "https://hlvs.online/api/appointment/own",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            state: "pending_approval",
          },
        }
      );

      const citasPendientesData = responsePendientes.data.data.filter(
        (cita) => cita.user.username === username
      );

      setCitasPendientes(citasPendientesData);
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
        `https://hlvs.online/api/appointment/cancel`,
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
        fetchCitas();
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
    fetchCitas();

    const interval = setInterval(() => {
      fetchCitas();
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
        <h2 className="title">Mis Citas Aprobadas</h2>
        <div className="citas-container">
          {citasAprobadas.map((cita, index) => (
            <CitaCard
              key={index}
              cita={cita}
              stateMapping={stateMapping}
              onCancel={openModal}
            />
          ))}
        </div>
         <br></br>   
        <h2 className="title">Citas Pendientes de Aprobación</h2>
        <div className="citas-container">
          {citasPendientes.map((cita, index) => (
            <CitaCard
              key={index}
              cita={cita}
              stateMapping={stateMapping}
              onCancel={openModal}
            />
          ))}
        </div>

        <Modal isOpen={modalOpen} onClose={closeModal}>
          <div className="reject-container">
            <h2>¿Seguro que quieres cancelar?</h2>
            <div className="btns-container">
              <button className="reject-btn" onClick={closeModal}>
                Rechazar
              </button>
              <button className="approve-btn" onClick={handleCancelAppointment}>
                Confirmar
              </button>
            </div>
          </div>
        </Modal>

        {error && <p>{error}</p>}
      </div>
    </Layout>
  );
}

export default Citas;
