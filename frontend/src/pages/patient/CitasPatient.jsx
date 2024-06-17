import React, { useEffect, useState } from "react";
import axios from "axios"; // Importa axios
import Layout from "./LayoutPatient";

import { useNavigate } from "react-router-dom";

import "../../assets/styles/assistant/Citas.css";

function Citas() {
  const [appointmentState, setAppointmentState] = useState(""); // Inicialmente vacío
  const [appointments, setAppointments] = useState([]);
  const [citas, setCitas] = useState([]);

  const navigate = useNavigate();

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
        navigate("/");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/appointment/own", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const appointmentsData = response.data.data;
      setAppointments(appointmentsData);

      // Obtén el estado de la primera cita (si existe) para mostrar
      const appointment = appointmentsData.find(
        (appointment) => appointment.state === "pending_approval" || appointment.state === "pending_execution" || appointment.state === "in_execution" || appointment.state === "completed" || appointment.state === "rejected" || appointment.state === "cancelled" || appointment.state === "approved"
      );
      setAppointmentState(appointment ? appointment.state : "");

    } catch (error) {
      console.error(
        "Error fetching appointment state:",
        error.response ? error.response.data.message : "Error sin respuesta"
      );
    }
  };

  const handleGetList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/appointment/");
      console.log("Data:", response.data);
      setCitas(response.data.data);

      fetchAppointments();
    } catch (error) {
      console.error(
        "Error al obtener citas:",
        error.response ? error.response.data : "Error sin respuesta"
      );
    }
  };

  useEffect(() => {
    handleGetList();

    // Actualizar automáticamente la lista de citas cada 60 segundos
    const interval = setInterval(() => {
      fetchAppointments();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Citas;
