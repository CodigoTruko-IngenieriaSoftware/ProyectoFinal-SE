import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/admin/ChangeRole.css";

function ChangeRole() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleGetUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }
    const userData = localStorage.getItem("userData");
    const user = JSON.parse(userData);
    const roles = user.role.map((role) => role.name);
    if (!roles.includes("sysadmin")) {
      if (roles.includes("sysadmin")) {
        navigate("/ChangeRole");
      } else if (roles.includes("doctor")) {
        navigate("/doctor");
      } else if (roles.includes("assistant")) {
        navigate("/Assistant");
      } else if (roles.includes("patient")) {
        navigate("/patient");
      } else {
        console.error("Unknown role:", user.role);
        navigate("/User");
      }
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/all-users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Data:", response.data);
      const filteredUsers = response.data.data
        .filter(
          (user) =>
            !user.authorities.some((auth) => auth.authority === "ROLE_SUDO")
        )
        .map((user) => ({
          ...user,
          roles:
            user.authorities.map((auth) => auth.authority).length > 0
              ? user.authorities.map((auth) => auth.authority)
              : ["Usuario"],
        }));
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.toString());
    }
  };

  const getRoleDescription = (roleCode) => {
    const roleDescriptions = {
      ROLE_PTNT: "Paciente",
      ROLE_DCTR: "Doctor",
      ROLE_ASST: "Asistente",
    };
    return roleDescriptions[roleCode] || roleCode;
  };

  const handleChangeRole = async (username, newRole) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }
    console.log(username, newRole);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/config/change-roles",
        {
          identifier: username,
          roles: [newRole],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Role changed successfully");
        handleGetUser();
      }
    } catch (error) {
      console.error(
        "Error changing role:",
        error.response ? error.response.data : "Error"
      );
    }
  };

  return (
    <Layout>
      <div className="content">
        <h2 className="tittle">Lista de Usuarios</h2>
        <div className="user-info-container">
          <div className="users">
            <p className="info-tittle">Nombre</p>
            <p className="info-tittle">Email</p>
            <p className="info-tittle">Rol</p>
            <p className="info-tittle">Cambiar Rol</p>
          </div>
          {users.map((user, index) => (
            <div key={index} className="users-info">
              <p>{user.username}</p>
              <p>{user.email}</p>
              <p>{user.roles.map(getRoleDescription).join(", ")}</p>
              <div>
                <select
                  defaultValue=""
                  onChange={(e) =>
                    handleChangeRole(user.username, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Change Role
                  </option>
                  <option value="PTNT">Paciente</option>
                  <option value="DCTR">Doctor</option>
                  <option value="ASST">Asistente</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ChangeRole;
