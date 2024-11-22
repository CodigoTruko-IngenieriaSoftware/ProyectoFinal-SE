import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/admin/ChangeRole.css";

function ChangeRole() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    handleGetUser();
  }, []);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

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
    
        // Actualizar el usuario seleccionado después del refetch
        const updatedUser = users.find((user) => user.username === username);
        if (updatedUser) {
          setSelectedUser(updatedUser);
        } else {
          console.error("No se encontró el usuario después del refetch");
        }
  
        setNewRole(""); // Limpia el estado del nuevo rol
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
      <div className="role-content">
        <div className="functions-container">

          <div className="list-container">
            <h2 className="list-text">Lista de Usuarios</h2>

            <div className="element-container" style={{ fontWeight: "bold", backgroundColor: "white", boxShadow: "none"}}>
              <div className="user-inf-container">
                <h3 className="title">Usuario</h3>
              </div>
              <div className="user-inf-container">
                <h3 className="title">Email</h3>
              </div>
            </div>

            {users.map((user, index) => (
              <div
                key={index}
                className="element-container"
                onClick={() => setSelectedUser(user)} // Selecciona el usuario al hacer clic en la fila
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedUser?.username === user.username ? "#B0D9FF" : "#E3F2FF",
                  borderRadius: "10px",
                  margin: "0.5rem 0",
                  padding: "0.5rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="user-inf-container">
                  <div className="user-data-container">
                    <p>{user.username}</p>
                  </div>
                </div>
                <div className="user-inf-container">
                  <div className="email-data-container">
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedUser && (
            <div className="change-role-container">
              <div className="c-r-info-container">
                <div className="role-info">
                  <h3 className="role-title">ROL</h3>
                  <p>{selectedUser.roles.map(getRoleDescription).join(", ")}</p>
                </div>
              </div>
              <div className="c-r-selector-container">
                <h4>Cambiar Rol</h4>
                <div>
                <select
                  className="role-selector"
                  defaultValue=""
                  onChange={(e) => setNewRole(e.target.value)} // Almacena el nuevo rol en el estado
                >
                  <option value="" disabled>
                    Roles
                  </option>
                  <option value="PTNT">Paciente</option>
                  <option value="DCTR">Doctor</option>
                  <option value="ASST">Asistente</option>
                </select>
                </div>
              </div>
              <div className="c-r-button-container">
              <button
                className="c-r-button"
                onClick={() => {
                  if (newRole) {
                    handleChangeRole(selectedUser.username, newRole);
                    setNewRole("");
                  } else {
                    alert("Por favor, selecciona un rol antes de cambiar.");
                  }
                }}
              >
                Cambiar Rol
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ChangeRole;