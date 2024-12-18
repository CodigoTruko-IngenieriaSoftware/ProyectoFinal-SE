import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import assistant_bg from '../../assets/images/doctor-1.png';
import Layout from './Layout.jsx';


function Inicio() {
    const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try{
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      if (!token) {
        console.error("No token found");
        navigate("/");
        return;
      }
      
      const user = JSON.parse(userData)

      const roles = user.role.map(role => role.name);
      if(!roles.includes("assistant")){
        if(roles.includes('sysadmin')){
          navigate('/ChangeRole');
        } else if (roles.includes('doctor')){
          navigate('/doctor');
        } else if (roles.includes('assistant')){
          navigate('/Assistant');
        } else if (roles.includes('patient')){
          navigate('/patient');
        } else {
          console.error('Unknown role:', user.role);
          navigate('/User');
      }
      }

    }catch (error) {
      setError(
        "Failed to fetch data: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  }
    return (
        <Layout>
            <div className="inicio-container">
                <div className="main-content">
                <img
                    src={assistant_bg}
                    alt="Imagen de un doctor"
                    className="sesion-img"
                />
                <div className="logo">
                    <h1 className="logo-title">YA</h1>
                    <h1 className="logo-title">MERITO</h1>
                    <p className="logo-text">La clínica perfecta</p>
                </div>
                </div>
            </div>
        </Layout>
    );
}

export default Inicio;