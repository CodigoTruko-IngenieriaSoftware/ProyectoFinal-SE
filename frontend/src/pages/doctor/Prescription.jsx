import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./DoctorLayout";

import "../../assets/styles/doctor/Prescription.css";

const Citas = () => {
  
  const [userID, setUserID] = useState(''); // ID del usuario seleccionado del dropdown
  const [patients, setPatients] = useState([]); // Lista de pacientes obtenidos del API
  const [prescriptions, setPrescriptions] = useState([]); // Prescripciones obtenidas del API

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/user/all-patients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPatients(response.data.data);
    } catch (error) {
      console.error('Error fetching patients:', error.response ? error.response.data.message : 'Error sin respuesta');
    }
  };

  

  const handleSearchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/clinic/prescription/${userID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPrescriptions(response.data.data);
      console.log('Prescripciones obtenidas:', response.data.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error.response ? error.response.data.message : 'Error sin respuesta');
    }
  };

  return (
    <Layout>
      <div className="content">
        <h2 className="tittle">Prescripciones</h2>
        <div className="prescription-container">
          <div className="search-art"></div>
          <select
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            className="search-input"
          >
            <option value="">Seleccione un paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.username}
              </option>
            ))}
          </select>
          <button onClick={handleSearchPrescriptions} className="search-btn">Buscar Prescripciones</button>
          {prescriptions.length > 0 && (
            <div className="prescriptions-list">
              <h3>Prescripciones del usuario</h3>
              <table className="prescription-table">
                <thead>
                  <tr>
                    <th>Medicament</th>
                    <th>Dosis</th>
                    <th>Fecha de Caducidad</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription, index) => (
                    <tr key={index}>
                      <td>{prescription.dose}</td>
                      <td>{prescription.instructions}</td>
                      <td>{prescription.issueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      
    </Layout>
  );
}

export default Citas;