import React, { useEffect, useState } from "react";
import axios from 'axios';
import Layout from './DoctorLayout';
import Overlay from './OverlayForm';
import { useNavigate } from "react-router-dom";
import '../../assets/styles/assistant/Prescription.css';

function Prescription() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPatientRecords, setSelectedPatientRecords] = useState([]);
    const [newRecordReason, setNewRecordReason] = useState('');

    useEffect(() => {
        handleGetUser();
    }, []);

    const handleGetUser = async () => {
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

        try {
            
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/all-patients`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const filteredUsers = response.data.data.filter(user =>
                user.authorities.some(auth => auth.authority === "ROLE_PTNT")
            );
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error al obtener usuarios:', error.toString());
        }
    };

    const handleGetRecords = async (user) => {
        setSelectedPatient(user);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/record/${user.username}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectedPatientRecords(response.data.data.records);
            setActiveForm("RecordHistory");
            setIsOpen(true);
        } catch (error) {
            console.error('Error al obtener registros:', error.toString());
            setIsOpen(false);
        }
    };

    const handleAddRecord = () => {
        setNewRecordReason('');
        setActiveForm("AddNewRecord");
    };

    const handleSubmitNewRecord = async () => {

        const data = {
            username: selectedPatient.username,
            reason: newRecordReason
        }

        try {

            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/record`, data,{
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            console.log("Respuesta de cancelación:", response.data);
            setIsOpen(false);
            handleGetRecords(selectedPatient);
        } catch (error) {
            console.error('Error al cancelar la cita:', error.response ? error.response.data : 'Error sin respuesta');
        }
    };

    return (
        <Layout>
            <div className="content">
                <h2 className="tittle">Lista de Pacientes</h2>
                <div className="user-info-container">
                    <div className="user">
                        <p className="info-title-r">Nombre</p>
                        <p className="info-title-r">Email</p>
                        <p className="info-title-r">Historial</p>
                    </div>
                    {users.map((user, index) => (
                        <div key={index} className="user-info">
                            <p className="user-info-username">{user.username}</p>
                            <p className="user-info-email">{user.email}</p>
                            <div className="user-div-info">
                                <button onClick={() => handleGetRecords(user)} className="user-info-btn">Acceder</button>
                            </div>
                        </div>
                    ))}
                </div>
                {isOpen && (
                    <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
                        {activeForm === "RecordHistory" && selectedPatient && (
                            <div className="record-container">
                                <h2>Historial de {selectedPatient.username}</h2>
                                {selectedPatientRecords.length > 0 ? (
                                    <div className="record-data-container">
                                        {selectedPatientRecords.map((record, index) => (
                                            <div key={index} className="data-container">
                                                <p>{index + 1}</p>
                                                <p>{record.creationDate}</p>
                                                <p>{record.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay registros disponibles para {selectedPatient.username} en este momento.</p>
                                )}
                                <div>
                                    <button className="new-entry-doctor" onClick={handleAddRecord}>Agregar Nueva Entrada</button>
                                </div>
                            </div>
                        )}
                        {activeForm === "AddNewRecord" && (
                            <div className="add-reason-container">
                                <h2>Agregar Nueva Entrada para {selectedPatient.username}</h2>
                                <div className="reason-container">
                                    <p>Razon:</p>
                                    <input type="text" onChange={e => setNewRecordReason(e.target.value)} />
                                </div>
                                <div>
                                    <button className="new-entry-doctor" onClick={handleSubmitNewRecord}>Guardar Entrada</button>
                                </div>
                            </div>
                        )}
                    </Overlay>
                )}
            </div>
        </Layout>
    );
}

export default Prescription;