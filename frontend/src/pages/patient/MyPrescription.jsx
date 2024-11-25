import React, { useState } from "react";
import axios from "axios";
import Layout from "./LayoutPatient";
import { useNavigate } from "react-router-dom";
import "./Prescription2.css"
function Prescription() {
  const navigate = useNavigate();

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    const requestData = { dateStart, dateEnd };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const userData = localStorage.getItem("userData");
      const user = JSON.parse(userData);
      const roles = user.role.map((role) => role.name);
      if (!roles.includes("patient")) {
        if (roles.includes("sysadmin")) navigate("/ChangeRole");
        else if (roles.includes("doctor")) navigate("/doctor");
        else if (roles.includes("assistant")) navigate("/Assistant");
        else if (roles.includes("patient")) navigate("/patient");
        else {
          console.error("Unknown role:", user.role);
          navigate("/User");
        }
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/record`,
        {
          params: requestData,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "OK") {
        setRecords(response.data.data);
        setError("");
      } else {
        setError("Failed to fetch records");
        setRecords([]);
      }
    } catch (error) {
      setError(
        "Valores de la búsqueda inválidos."
      );
      setRecords([]);
    }
  };

  return (
    <Layout>
      <div className="prescription-container">
        <h1 className="title">Mi Historial de Prescripciones</h1>
        <div className="form-container">
          <label className="form-label">
            Fecha de Inicio:
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Fecha de Finalización:
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="form-input"
            />
          </label>
          <button onClick={fetchRecords} className="search-button">
            Buscar
          </button>
        </div>
        <div className="record-container">
          {error && <p className="error-message">{error}</p>}
          {records.length > 0 && (
            <ul className="record-list">
              {records.map((record) => (
                <li key={record.id} className="record-item">
                  <p>
                    <strong>Razón: </strong> {record.reason}
                  </p>
                  <p>
                    <strong>Fecha de creación: </strong>
                    {record.creationDate}
                  </p>
                  <p>
                    <strong>Fecha de actualización: </strong> {record.updateDate}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {error && (
            <p className="no-records">No hay registros encontrados</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Prescription;
