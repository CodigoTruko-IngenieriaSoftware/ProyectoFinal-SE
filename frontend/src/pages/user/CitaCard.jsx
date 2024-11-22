import React from "react";
import PropTypes from "prop-types";

function CitaCard({ cita, stateMapping, onCancel }) {
  return (
    <div className="paciente">
      <div>
        <p className="info-tittle">Nombre</p>
        <p>{cita.user.username}</p>
      </div>
      <div>
        <p className="info-tittle">Descripción</p>
        <p>{cita.reason || "No proporcionada"}</p>
      </div>
      <div>
        <p className="info-tittle">Fecha Solicitada</p>
        <p>{cita.date || "Fecha no definida"}</p>
      </div>
      <div>
        <p className="info-tittle">Estado</p>
        <p>{stateMapping[cita.state] || "Desconocido"}</p>
      </div>
      {cita.state === "pending_approval" && (
    <button className="reject-btn" onClick={() => onCancel(cita.id)}>
        ✖
    </button>
)}
    </div>
  );
}

CitaCard.propTypes = {
  cita: PropTypes.object.isRequired,
  stateMapping: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CitaCard;
