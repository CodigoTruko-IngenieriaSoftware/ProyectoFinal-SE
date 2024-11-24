import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./LayoutUser";
import CitaCard from "./CitaCard"; // Subcomponente para una cita
import "./Citas2.css";
import Modal from "../patient/Modal"; // Componente modal
import { useNavigate } from "react-router-dom";

function MisCitas() {
  const navigate = useNavigate();

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

  const fetchCitas = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        "https://hlvs.online/api/appointment/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userData = localStorage.getItem("userData");
      const user = JSON.parse(userData);
      const username = user.username;

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
        <h2 className="tittle">Mis Citas</h2>
        <div className="citas-container">
          {citas.map((cita, index) => (
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

export default MisCitas;
