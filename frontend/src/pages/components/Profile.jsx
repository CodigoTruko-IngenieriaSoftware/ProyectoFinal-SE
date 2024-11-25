import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/components/Profile.css";
import AdminLayout from "../admin/AdminLayout";
import DoctorLayout from "../doctor/DoctorLayout";
import AssistantLayout from "../assistant/Layout";
import PatientLayout from "../patient/LayoutPatient";
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

    const getLayout = (roles) => {
        if (!roles || roles.length === 0) return AdminLayout;
        
        const roleNames = roles.map((role) => role.name.toLowerCase());
        if (roleNames.includes("sysadmin")) return AdminLayout;
        if (roleNames.includes("doctor")) return DoctorLayout;
        if (roleNames.includes("assistant")) return AssistantLayout;
        if (roleNames.includes("patient")) return PatientLayout;
    
        return AdminLayout;
    };

    const Layout = user ? getLayout(user.role) : AdminLayout;


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
                            <div className="profile-info-center">
                                <h3>{user.username}</h3>
                                <div className="profile-data">
                                    <p className="strong">Email:</p>
                                    <p>{user.email}</p>
                                    <p className="strong">Rol:</p>
                                    <p>{getRoleDescriptions(user.role)}</p>
                                </div>
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