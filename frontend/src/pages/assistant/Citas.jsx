import React, { useEffect, useState } from "react";
import axios from 'axios';  // Importa axios
import Layout from './Layout';
import Overlay from './OverlayForm';

import '../../assets/styles/assistant/Citas.css';


function Citas() {

    const [isOpen, setIsOpen] = useState(false);
    const [activeForm, setActiveForm] = useState("HourForm");

    const [selectedDoctor, setSelectedDoctor] = useState("Selecciona un doctor");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState("Selecciona una especialidad");
    const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);

    const [doctorCount, setDoctorCount] = useState(1); // Nuevo estado para contar doctores
    const [doctors, setDoctors] = useState([{ doctor: "Selecciona un doctor", specialty: "Selecciona una especialidad" }]);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setActiveForm("HourForm");
    };

    const handleNext = () => {
        setActiveForm("DoctorForm");  // Cambiar al siguiente formulario.
    };
    
    const handleReject = (index) => {
        setActiveForm("RejectForm");
        setIsOpen(true);
        // Puedes guardar el índice o cualquier otro identificador necesario para manejar el rechazo
        setRejectInfo({ index: index });
    };

    const confirmRejection = (index) => {
        console.log("Cita rechazada:", citas[index]);
        // Implementa la lógica para actualizar el estado en el backend
        setIsOpen(false);
        setActiveForm(null);
    };    

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setDropdownOpen(false);
    };

    const toggleSpecialtyDropdown = () => {
        setSpecialtyDropdownOpen(!specialtyDropdownOpen);
    };

    const handleSpecialtySelect = (specialty) => {
        setSelectedSpecialty(specialty);
        setSpecialtyDropdownOpen(false);
    };
    
    const addDoctor = () => {
        const newDoctor = { doctor: "Selecciona un doctor", specialty: "Selecciona una especialidad" };
        setDoctors([...doctors, newDoctor]);
        setDoctorCount(doctorCount + 1);
    };

    const removeDoctor = () => {
        if (doctorCount > 1) {
            setDoctors(doctors.slice(0, -1));
            setDoctorCount(doctorCount - 1);
        }
    };

    // LOGICA DE CONEXIÓN CON API
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        handleGetList();
    }, []);

    const handleGetList = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/appointment/");
            console.log("Data:", response.data);
            setCitas(response.data.data);
        } catch (error) {
            console.error('Error al obtener citas:', error.response ? error.response.data : 'Error sin respuesta');
        }
    }
    
    return (
        <Layout>
            <div className="content">
                <p className="tittle">Citas Pendientes de Aprobación</p>
                <div className="citas-container">
                {citas.map((cita, index) => (
                    <div key={ index } className="paciente">
                        <div>
                            <p className="info-tittle">Nombre</p>
                            <p>{ cita.user.username }</p>
                        </div>
                        <div>
                            <p className="info-tittle">Descripción</p>
                            <p>{ cita.reason || 'No proporcionada' }</p>
                        </div>
                        <div>
                            <p className="info-tittle">Fecha Solicitada</p>
                            <p>{ cita.date || 'Fecha no definida' }</p>
                        </div>
                        <div>
                            <p className="info-tittle">Estado</p>
                            <div className="btns-container">
                                <button onClick={ toggleOverlay } className="aprove-btn">Aprobar</button>
                                <button onClick={() => handleReject(index)} className="reject-btn">Rechazar</button>
                            </div>
                            
                            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                                {activeForm === "HourForm" && (
                                    <div>
                                        <h2>Aprobar Cita</h2>
                                        <div className="time-container">
                                            <p>Hora que se aprobara:</p>
                                            <input type="time" placeholder="Hora" />
                                        </div>
                                        <div className="time-container">
                                            <p>Duración estimada:</p>
                                            <input type="number" placeholder="Minutos" />
                                        </div>
                                        <button onClick={handleNext} className="aprove-btn">Siguiente</button>
                                    </div>
                                )}
                                {activeForm === "DoctorForm" && (
                                    <div>
                                        <h2>Seleccionar Doctores</h2>
                                        <div className="doctors-container">
                                            {doctors.map((doctor, index) => (
                                                <div key={index} className="doc-det-container">
                                                    <p>Doctor:</p>
                                                    <button onClick={() => toggleDropdown(index)}>{doctor.doctor} &#9660;</button>
                                                    <p>Especialidad:</p>
                                                    <button onClick={() => toggleSpecialtyDropdown(index)}>{doctor.specialty} &#9660;</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="btn-container">
                                            <div className="doc-num-container">
                                                <button id="add-doc-btn" onClick={removeDoctor} disabled={doctorCount <= 1}>-</button>
                                                <p>{ doctorCount }</p>
                                                <button id="add-doc-btn" onClick={addDoctor}>+</button>
                                            </div>
                                            <button onClick={toggleOverlay} className="aprove-btn">Finalizar</button>
                                        </div>
                                    </div>
                                )}
                                {activeForm === "RejectForm" && (
                                    <div className="reject-container">
                                        <h2>Confirmar Rechazo</h2>
                                        <p>¿Estás seguro de que quieres rechazar esta cita?</p>

                                        <div className="btns-container">
                                            <button onClick={() => confirmRejection(rejectInfo.index)} className="aprove-btn">Confirmar</button>
                                            <button onClick={toggleOverlay} className="reject-btn">Cancelar</button>
                                        </div>

                                    </div>
                                )}
                            </Overlay>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Citas;