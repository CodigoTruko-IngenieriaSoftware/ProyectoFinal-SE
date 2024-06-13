import React from 'react';
import '../assets/styles/Login.css';

function Login() {
  return (
    <>
    <div className="main-container-login">
        <div className="column-img-l">
            <img src="src/assets/images/doctor-1.png" alt="Imagen de un doctor" className='login-img'/>
           <div className="logo">
           <h1 className="logo-title">
                YA
            </h1>
            <h1 className="logo-title">
                MERITO
            </h1>
            <p className='logo-text'>La clínica perfecta</p>
           </div>
        </div>
        <div className="column-info-l">
            <p className='login-text'>Iniciar sesión</p>
            <div className="inputs-l">
                <p className='login-subtitle'>Usuario</p>
                <input type="text" className='login-input' placeholder='Usuario'/>
            </div>
            <div className="inputs-l">
                <p className='login-subtitle'>Contraseña</p>
                <input type="text" className='login-input' placeholder='Contraseña'/>
            </div>

            <button className='login-btn'>Iniciar Sesión</button>
            <div className="to-register">
                <p className='x-small'>¿No tienes una cuenta?</p> 
                <button className='link-btn'>Registrate aquí.</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Login