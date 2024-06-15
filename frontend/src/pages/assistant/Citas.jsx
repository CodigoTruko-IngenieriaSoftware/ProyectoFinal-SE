import '../../assets/styles/assistant/Citas.css';
import { useState } from "react";

<<<<<<< HEAD
import React from 'react';
import Layout from './Layout.jsx';
=======
import Layout from './Layout';
import Overlay from './OverlayForm';

>>>>>>> bbd48072a5d608cfce5f97f9381e4712281261c2

function Citas() {

    const [isOpen, setIsOpen] = useState(false);
    const [activeForm, setActiveForm] = useState("HourForm");
    const [selectedDoctor, setSelectedDoctor] = useState("Selecciona un doctor");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState("Selecciona una especialidad");
    const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setActiveForm("HourForm");
    };

    const handleNext = () => {
        setActiveForm("DoctorForm");  // Cambiar al siguiente formulario.
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

    return (
        <Layout>
            <div className="content">
                <p className="tittle">Citas Pendientes de Aprobación</p>
                <div className="citas-container">
                    <div className="paciente">
                        <div>
                            <p className="info-tittle">Nombre</p>
                            <p>Francisco Rosa</p>
                        </div>
                        <div>
                            <p className="info-tittle">Descripción</p>
                            <p>Dolor en el recto anal aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                        <div>
                            <p className="info-tittle">Fecha Solicitada</p>
                            <p>13/6/2069</p>
                        </div>
                        <div>
                            <p className="info-tittle">Estado</p>
                            <button onClick={ toggleOverlay }>Aprobar</button>

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
                                        <button onClick={handleNext}>Siguiente</button>
                                    </div>
                                )}
                                {activeForm === "DoctorForm" && (
                                    <div>
                                        <h2>Seleccionar Doctores</h2>
                                        <div className="doc-det-container">
                                            <p>Doctor:</p>
                                            <button onClick={toggleDropdown}>{selectedDoctor} &#9660;</button>
                                            {dropdownOpen && (
                                                <ul style={{ listStyleType: "none", padding: 0 }}>
                                                    <li onClick={() => handleDoctorSelect('Doctor 1')}>Doctor Douglas Hernandez</li>
                                                    <li onClick={() => handleDoctorSelect('Doctor 2')}>Doctor Andres Navas</li>
                                                    <li onClick={() => handleDoctorSelect('Doctor 3')}>Doctor Nexxxtor</li>
                                                </ul>
                                            )}

                                            <p>Especialidad:</p>
                                            <button onClick={toggleSpecialtyDropdown}>{selectedSpecialty} &#9660;</button>
                                            {specialtyDropdownOpen && (
                                                <ul style={{ listStyleType: "none", padding: 0 }}>
                                                    <li onClick={() => handleSpecialtySelect('Penologo')}>Penologo</li>
                                                    <li onClick={() => handleSpecialtySelect('Sexologo')}>Sexologo</li>
                                                    <li onClick={() => handleSpecialtySelect('Cucologo')}>Cucologo</li>
                                                </ul>
                                            )}
                                        </div>
                                        <button onClick={toggleOverlay}>Finalizar</button>
                                    </div>
                                )}
                            </Overlay>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Citas;