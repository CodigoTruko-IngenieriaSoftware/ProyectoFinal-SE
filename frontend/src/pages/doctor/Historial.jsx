// src/pages/doctor/Historial.jsx
import React, { useState } from 'react';
import { medicalHistory as initialMedicalHistory } from '../../constants/MedicalHistory';
import '../../assets/styles/doctor/historial.css';
import DoctorLayout from './DoctorLayout';

const Historial = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicalHistory, setMedicalHistory] = useState(initialMedicalHistory);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    patientName: "",
    appointmentTime: "",
    prescription: "",
    dosage: ""
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (entry) => {
    setEditingId(entry.id);
    setEditForm({
      patientName: entry.patientName,
      appointmentTime: entry.appointmentTime,
      prescription: entry.prescription,
      dosage: entry.dosage
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setMedicalHistory(prevHistory => 
      prevHistory.map(entry => 
        entry.id === editingId ? { ...entry, ...editForm } : entry
      )
    );
    setEditingId(null);
  };

  const filteredHistory = medicalHistory.filter(entry =>
    entry.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DoctorLayout>
      <div className="historial-container">
        <h2>Historial Médico</h2>
        <input
          type="text"
          placeholder="Buscar por paciente"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <ul className="historial-list">
          {filteredHistory.map(entry => (
            <li key={entry.id} className="historial-item">
              {editingId === entry.id ? (
                <form onSubmit={handleFormSubmit} className="edit-form">
                  <input
                    type="text"
                    name="patientName"
                    value={editForm.patientName}
                    onChange={handleFormChange}
                    placeholder="Nombre del paciente"
                  />
                  <input
                    type="text"
                    name="appointmentTime"
                    value={editForm.appointmentTime}
                    onChange={handleFormChange}
                    placeholder="Hora de la cita"
                  />
                  <input
                    type="text"
                    name="prescription"
                    value={editForm.prescription}
                    onChange={handleFormChange}
                    placeholder="Receta"
                  />
                  <input
                    type="text"
                    name="dosage"
                    value={editForm.dosage}
                    onChange={handleFormChange}
                    placeholder="Dosis"
                  />
                  <button type="submit">Guardar</button>
                </form>
              ) : (
                <div className="historial-item-content">
                  <div className="historial-item-text">
                    <h3>{entry.patientName}</h3>
                    <p>Hora de la cita: {entry.appointmentTime}</p>
                    <p>Receta: {entry.prescription}</p>
                    <p>Dosis: {entry.dosage}</p>
                  </div>
                  <button onClick={() => handleEditClick(entry)} className="edit-button">Editar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </DoctorLayout>
  );
};

export default Historial;
