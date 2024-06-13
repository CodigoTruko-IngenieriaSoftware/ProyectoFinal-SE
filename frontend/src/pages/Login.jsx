import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const navToRegister = () => {
    navigate("/Register");
  };

  return (
    <>
      <div className="main-container-sesion">
        <div className="column-img-l">
          <img
            src="src/assets/images/doctor-1.png"
            alt="Imagen de un doctor"
            className="sesion-img"
          />
          <div className="logo">
            <h1 className="logo-title">YA</h1>
            <h1 className="logo-title">MERITO</h1>
            <p className="logo-text">La clínica perfecta</p>
          </div>
        </div>
        <div className="column-info-s">
          <p className="sesion-text">Iniciar sesión</p>
          <div className="inputs-s">
            <p className="sesion-subtitle">Usuario</p>
            <input type="text" className="login-input" placeholder="Usuario" />
          </div>
          <div className="inputs-s">
            <p className="sesion-subtitle">Contraseña</p>
            <input
              type="text"
              className="sesion-input"
              placeholder="Contraseña"
            />
          </div>

          <button className="sesion-btn">Iniciar Sesión</button>
          <div className="to-register">
            <p className="x-small">¿No tienes una cuenta?</p>
            <button className="link-btn" onClick={navToRegister}>
              Registrate aquí.
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
