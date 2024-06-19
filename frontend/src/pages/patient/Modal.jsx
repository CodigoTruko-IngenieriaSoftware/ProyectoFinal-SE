// src/components/LogoutModal.jsx
import React from 'react';
import '../../assets/styles/doctor/LogoutModal.css';

const LogoutModal = ({ isOpen, onClose, children}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay-log">
            <div className="modal-log">
                <div>
                    {children}
                </div>
                <div className="modal-buttons-log">
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
