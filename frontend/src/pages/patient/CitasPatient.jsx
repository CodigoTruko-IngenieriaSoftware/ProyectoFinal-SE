import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./LayoutPatient";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

import "../user/Citas2.css";

function Citas() {
  const navigate = useNavigate();

  const [citasAprobadas, setCitasAprobadas] = useState([]);
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelAppointmentId, setCancelAppointmentId] = useState(null);
  const [error, setError] = useState("");

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

      // Fetch citas aprobadas
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

      // Fetch citas pendientes
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
    }, 5000);

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
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Solicitada</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
              </tr>
            </thead>
            <tbody>
              {citasAprobadas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.user.username}</td>
                  <td>{cita.reason}</td>
                  <td>{cita.date}</td>
                  <td>{cita.entryHour}</td>
                  <td>{cita.estimatedEndHour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
                <br />
        <h2 className="title">Citas Pendientes de Aprobación</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Solicitada</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {citasPendientes.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.user.username}</td>
                  <td>{cita.reason}</td>
                  <td>{cita.date}</td>
                  <td>
                    <button
                      className="reject-btn"
                      onClick={() => openModal(cita.id)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
