// src/pages/doctor/Historial.jsx
import React, { useState } from 'react';
import { medicalHistory as initialMedicalHistory } from '../../constants/MedicalHistory';
import '../../assets/styles/doctor/historial.css';
import DoctorLayout from './DoctorLayout';

const Historial = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicalHistory, setMedicalHistory] = useState(initialMedicalHistory);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
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
    setForm({
      patientName: entry.patientName,
      appointmentTime: entry.appointmentTime,
      prescription: entry.prescription,
      dosage: entry.dosage
    });
    setIsAdding(false); // Ensure that we are not in adding mode
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setForm({
      patientName: "",
      appointmentTime: "",
      prescription: "",
      dosage: ""
    });
    setEditingId(null); // Ensure that we are not in editing mode
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (isAdding) {
      setMedicalHistory(prevHistory => [
        ...prevHistory,
        { id: prevHistory.length + 1, ...form }
      ]);
      setIsAdding(false);
    } else {
      setMedicalHistory(prevHistory => 
        prevHistory.map(entry => 
          entry.id === editingId ? { ...entry, ...form } : entry
        )
      );
      setEditingId(null);
    }
    setForm({
      patientName: "",
      appointmentTime: "",
      prescription: "",
      dosage: ""
    });
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
        <button onClick={handleAddClick} className="add-button">Agregar Registro</button>
        <ul className="historial-list">
          {(isAdding || editingId !== null) && (
            <li className="historial-item">
              <form onSubmit={handleFormSubmit} className="edit-form">
                <input
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleFormChange}
                  placeholder="Nombre del paciente"
                />
                <input
                  type="text"
                  name="appointmentTime"
                  value={form.appointmentTime}
                  onChange={handleFormChange}
                  placeholder="Hora de la cita"
                />
                <input
                  type="text"
                  name="prescription"
                  value={form.prescription}
                  onChange={handleFormChange}
                  placeholder="Receta"
                />
                <input
                  type="text"
                  name="dosage"
                  value={form.dosage}
                  onChange={handleFormChange}
                  placeholder="Dosis"
                />
                <button type="submit">Guardar</button>
              </form>
            </li>
          )}
          {filteredHistory.map(entry => (
            <li key={entry.id} className="historial-item">
              {editingId === entry.id ? (
                <form onSubmit={handleFormSubmit} className="edit-form">
                  <input
                    type="text"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleFormChange}
                    placeholder="Nombre del paciente"
                  />
                  <input
                    type="text"
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleFormChange}
                    placeholder="Hora de la cita"
                  />
                  <input
                    type="text"
                    name="prescription"
                    value={form.prescription}
                    onChange={handleFormChange}
                    placeholder="Receta"
                  />
                  <input
                    type="text"
                    name="dosage"
                    value={form.dosage}
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
