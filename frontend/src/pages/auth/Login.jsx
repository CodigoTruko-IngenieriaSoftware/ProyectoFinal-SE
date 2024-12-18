import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import login_bg from "../../assets/images/doctor-1.png";
import "../../assets/styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const navToRegister = () => {
    navigate("/Register");
  };

  const handleLogin = async () => {
    console.log("Intentando iniciar sesión con:", username, password);

    const data = {
      identifier: username,
      password: password,
    };

    setLoading(true); // Activa el indicador de carga al comenzar la solicitud.

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        data
      );
      const token = response.data.data.token;
      await fetchUserData(token);

      console.log("Token:", response.data.data.token);
      localStorage.setItem("token", response.data.data.token);

      const userInfoResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/`,
        {
          headers: {
            Authorization: `Bearer ${response.data.data.token}`,
          },
        }
      );

      const userRoles = userInfoResponse.data.data.role;
      const hasEmptyRole = userRoles.some((role) => !role.name);
      localStorage.setItem("token", response.data.data.token);

      if (hasEmptyRole) {
        console.warn("User role is empty");
        navigate("/User");
      } else {
        const roleNames = userRoles.map((role) => role.name.toLowerCase());
        if (roleNames.includes("sysadmin")) {
          navigate("/ChangeRole");
        } else if (roleNames.includes("doctor")) {
          navigate("/appointment");
        } else if (roleNames.includes("assistant")) {
          navigate("/Cita");
        } else if (roleNames.includes("patient")) {
          navigate("/patient");
        } else {
          console.error("Unknown role:", userRoles);
          navigate("/User");
        }
      }
    } catch (error) {
      console.error(
        "Error en el login:",
        error.response ? error.response.data.message : "Error sin respuesta"
      );
      setMessage("Error al iniciar sesión, intente nuevamente");
      setShowMessage(true);
    } finally {
      setLoading(false); // Desactiva el indicador de carga después del intento.
    }
  };


  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.data;
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("Datos de usuario:", userData);
    } catch (error) {
      console.error(
        "Error al obtener datos de usuario:",
        error.response ? error.response.data.message : "Error sin respuesta"
      );
    }
  };

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <>
      <div className="main-container-sesion">
        <div className="column-img-l">
          <img
            src={login_bg}
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
            <input
              type="text"
              className="sesion-input"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="inputs-s">
            <p className="sesion-subtitle">Contraseña</p>
            <input
              type="password"
              className="sesion-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="sesion-btn" onClick={handleLogin}>
            {loading ? <div className="spinner"></div> : "Iniciar Sesión"}
          </button>
          <div className="to-register">
            <p className="x-small">¿No tienes una cuenta?</p>
            <button className="link-btn" onClick={navToRegister}>
              Registrate aquí.
            </button>
          </div>
        </div>
        {showMessage && <div className="message-popup">{message}</div>}
      </div>
    </>
  );
}

export default Login;