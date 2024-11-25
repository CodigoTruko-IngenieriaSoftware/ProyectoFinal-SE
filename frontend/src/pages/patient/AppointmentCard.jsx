import React from "react";
import "../../assets/styles/user/AppointmentCard.css";

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="appointment-card">
      <h3 className="card-title">Cita Pendiente</h3>
      <p><strong>Fecha:</strong> {appointment.date}</p>
      <p><strong>Hora:</strong> {appointment.time}</p>
      <p><strong>Doctor:</strong> {appointment.doctorName}</p>
      <p><strong>Razón:</strong> {appointment.reason}</p>
    </div>
  );
};

export default AppointmentCard;
