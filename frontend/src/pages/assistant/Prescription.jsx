import React, { useEffect, useState } from "react";
import Layout from './Layout.jsx';
import Overlay from './OverlayForm';
import axios from 'axios';

import '../../assets/styles/assistant/Prescription.css';

function Prescription() {

    // LOGICA DE CONEXIÓN CON API
    // Obtener Usuarios.
    const [user, setUsers] = useState([]);

    useEffect(() => {
        handleGetUser();
    }, []);

    const handleGetUser = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/user/");
            console.log("Data:", response.data);

            // Filtrar usuarios con rol "ROLE_PCNT"
            const filteredUsers = response.data.data.filter(user => 
                user.authorities.some(auth => auth.authority === "ROLE_PCNT")
            );

            setUsers(filteredUsers);

        } catch (error) {
            console.error('Error al obtener citas:', error.response ? error.response.data : 'Error sin respuesta');
        }
    }

    // Filtrar Historial de cada User.
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [selectedPatientRecords, setSelectedPatientRecords] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const handleGetRecords = async (user) => {
        try {
            const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhc3Npc3RhbnQxQGdtYWlsLmNvbSIsImlhdCI6MTcxODU2MjgyNiwiZXhwIjoxNzE5ODU4ODI2fQ.qRsZd-U_JChw4Tk-zr1NV7NYKnUgTYaFKrVFb5_SOlk";
            const response = await axios.get(`http://localhost:8080/api/record/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Registros:", response.data);
            setSelectedPatientRecords(response.data.data);
            setSelectedPatient(user);
            setIsOverlayOpen(true);
        } catch (error) {
            console.error('Error al obtener registros:', error.response ? error.response.data : 'Error sin respuesta');
            setIsOverlayOpen(false);
        }
    };
    

    return (
        <Layout>
            <div className="content">
                <h2 className="tittle">Lista de Pacientes</h2>
                <div className="user-info-container">
                    <div className="user">
                        <p className="info-tittle">Nombre</p>
                        <p className="info-tittle">Email</p>
                        <p className="info-tittle">Historial</p>
                    </div>
                    {user.map((user, index) => (
                        <div key={index} className="user-info">
                                <p>{user.username}</p>
                                <p>{user.email}</p>
                            <div>
                            <button onClick={() => handleGetRecords(user)}>Acceder</button>
                            </div>
                        </div>
                    ))}
                </div>
                {isOverlayOpen && (
                <Overlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)}>
                    <div>
                        <h2>Historial de {selectedPatient.username}</h2>
                        {selectedPatientRecords.length > 0 ? (
                            selectedPatientRecords.map((record, index) => (
                                <div key={index}>
                                    <p>Fecha: {record.creationDate}</p>
                                    <p>Razón: {record.reason}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay registros disponibles.</p>
                        )}
                    </div>
                </Overlay>
            )}
            </div>
        </Layout>
    );
}

export default Prescription;