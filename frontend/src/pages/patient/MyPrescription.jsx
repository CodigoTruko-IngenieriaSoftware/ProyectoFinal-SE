import React, { useState } from "react";
import axios from "axios";
import Layout from "./LayoutPatient";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/assistant/Prescription.css";

function Prescription() {

  const navigate = useNavigate();

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    const requestData = {
      dateStart,
      dateEnd,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
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
        `${import.meta.env.VITE_API_BASE_URL}/api/user/record`,
        {
          params: requestData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        "Failed to fetch data: " +
          (error.response ? error.response.data.message : error.message)
      );
      setRecords([]);
    }
  };

  return (
    <Layout>
      <div className="content">
        <h1>Mi Historial</h1>
        <label>
          Fecha de Inicio:
          <input
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
        </label>
        <label>
          Fecha de Finalización:
          <input
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </label>
        <button onClick={fetchRecords}>Buscar</button>
        <div className="record">
          {error && <p>{error}</p>}
          {records.length > 0 && (
            <ul>
              {records.map((record) => (
                <li key={record.id} className="list-record">
                  <p>
                    <strong>Razón: </strong> {record.reason}
                  </p>
                  <p>
                    <strong>Fecha de creación: </strong>
                    {record.creationDate}
                  </p>
                  <p>
                    <strong>Fecha de actulización: </strong> {record.updateDate}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {records.length === 0 && !error && (
            <p>No hay registros encontrados</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Prescription;
