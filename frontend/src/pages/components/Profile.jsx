import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../admin/AdminLayout";
import "../../assets/styles/components/Profile.css";
import tioChill from '../../assets/images/Tio-chill.jpg';
import bgImage from '../../assets/images/bg.jpg';

function Profile() {

  const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
          console.error("No token found");
          return;
      }

      try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/user/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        
            console.log("Data:", response.data);
          // Extrae los datos del usuario desde la respuesta
          const userData = response.data.data;
          setUser(userData);
      } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
      }
  };

    const roleMapping = {
        sysadmin: "Admin",
        assistant: "Asistente",
        doctor: "Doctor",
        patient: "Paciente",
        user: "Usuario"
    };

    const getRoleDescriptions = (roles) => {
        return roles
            .map((role) => roleMapping[role.name] || role.name)
            .join(", ");
    };

    return (
        <Layout>
            <div className="bg-content">
                <div className="profile-content"
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${bgImage})`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'
                    }}>
                    {user ? (
                        <div className="profile-card">
                            <div className="profile-image">
                                <img src={tioChill} alt="Imagen de Tio Chill de Cojones." />
                            </div>
                            <div className="profile-info">
                                <h3>{user.username}</h3>
                                <p>Correo</p>
                                <p>{user.email}</p>
                                <p>Roles</p>
                                <p>{getRoleDescriptions(user.role)}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Usuario sin Datos :/</p>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Profile;