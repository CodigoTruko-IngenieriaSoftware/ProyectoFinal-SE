import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./DoctorLayout";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/doctor/Prescription.css";

const Citas = () => {

  const navigate = useNavigate();
  const [userID, setUserID] = useState('');
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem("userData");

      if (!token) {
        console.error('No token found');
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

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/all-patients`, {
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
      
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/clinic/prescription/${userID}`, {
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
              <table className="prescription-table">
                <thead>
                  <tr className="table-row">
                    <th className="table-cell">Medicament</th>
                    <th className="table-cell">Dosis</th>
                    <th className="table-cell">Fecha de Caducidad</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{prescription.dose}</td>
                      <td className="table-cell">{prescription.instructions}</td>
                      <td className="table-cell">{prescription.issueDate}</td>
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