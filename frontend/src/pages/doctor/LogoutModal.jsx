// src/components/LogoutModal.jsx
import React from 'react';
import '../../assets/styles/doctor/LogoutModal.css';

const LogoutModal = ({ show, handleClose, handleConfirm }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay-log">
            <div className="modal-log">
                <h2>Confirmación de Logout</h2>
                <p>¿Estás seguro que quieres salir?</p>
                <div className="modal-buttons-log">
                    <button onClick={handleConfirm} className="confirm-button">Sí</button>
                    <button onClick={handleClose} className="cancel-button">No</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
