import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../assets/styles/Login.css";

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    console.log("Intentando registrar con:", username, email, password);
    const data = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        data
      );
      console.log("Registro exitoso:", response.data);
      navigate('/');
    } catch (error) {
      console.error(
        "Error en el registro:",
        error.response ? error.response.data.message : "Error sin respuesta"
      );
      alert("Error al registrarse, intente nuevamente");
    }
  };

  const navToLogin = () => {
    navigate("/");
  };

  return (
    <>
      <div className="main-container-sesion">
        <div className="column-img-l">
          <img
            src="src/assets/images/doctor-2.png"
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
          <p className="sesion-text">Regístrate</p>
          <div className="inputs-s">
            <p className="sesion-subtitle">Usuario</p>
            <input type="text" className="sesion-input" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="inputs-s">
            <p className="sesion-subtitle">Email</p>
            <input type="email" className="sesion-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="inputs-s">
            <p className="sesion-subtitle">Contraseña</p>
            <input type="password" className="sesion-input" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button className="sesion-btn" onClick={handleRegister}>Registrar</button>
          <div className="to-register">
            <p className="x-small">¿Ya eres miembro?</p>
            <button className="link-btn" onClick={navToLogin}>
              Inicia sesión aquí.
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;