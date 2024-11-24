import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/admin/ChangeRole.css";

const ROLES = {
  PTNT: "Paciente",
  DCTR: "Doctor",
  ASST: "Asistente",
};

const ROLE_PATHS = {
  sysadmin: "/ChangeRole",
  doctor: "/doctor",
  assistant: "/Assistant",
  patient: "/patient",
  default: "/User",
};

function ChangeRole() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    handleGetUser();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser((prev) => prev || users[0]);
    }
  }, [users]);

  const getToken = () => localStorage.getItem("token");

  const handleRoleNavigation = (roles) => {
    const path = roles.find((role) => ROLE_PATHS[role.toLowerCase()]) || "default";
    navigate(ROLE_PATHS[path]);
  };

  const handleGetUser = async () => {
    const token = getToken();

    if (!token) {
      console.error("No token found");
      return;
    }

    const userData = localStorage.getItem("userData");
    const user = JSON.parse(userData);
    const roles = user.role.map((role) => role.name);

    if (!roles.includes("sysadmin")) {
      handleRoleNavigation(roles);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/all-users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      alert("Error al obtener usuarios. Por favor, inténtalo nuevamente.");
      console.error("Error al obtener usuarios:", error.toString());
    }
  };

  const getRoleDescription = (roleCode) => ROLES[roleCode.replace("ROLE_", "")] || roleCode;

  const getAvailableRoles = (currentRoles) => {
    const currentFormattedRoles = currentRoles.map((role) => role.replace("ROLE_", ""));
    return Object.keys(ROLES).filter((role) => !currentFormattedRoles.includes(role));
  };

  const handleChangeRole = async (username, newRole) => {
    const token = getToken();

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const currentRole = selectedUser.roles[0].replace("ROLE_", "");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/config/change-roles`,
        { identifier: username, roles: [newRole, currentRole] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedUser = users.find((user) => user.username === username);
        if (updatedUser) {
          setSelectedUser({ ...updatedUser, roles: [newRole] });
        }
        setNewRole("");
      }
    } catch (error) {
      console.error("Error changing role:", error.response?.data || "Error");
    }
  };

  const selectedUserStyle = {
    cursor: "pointer",
    backgroundColor: "#B0D9FF",
    borderRadius: "10px",
    margin: "0.5rem 0",
    padding: "0.5rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const defaultUserStyle = {
    ...selectedUserStyle,
    backgroundColor: "#E3F2FF",
  };

  return (
    <Layout>
      <div className="role-content">
        <div className="functions-container">
          <div className="list-container">
            <h2 className="list-text">Lista de Usuarios</h2>

            <div
              className="element-container"
              style={{ fontWeight: "bold", backgroundColor: "white", boxShadow: "none" }}
            >
              <div className="user-inf-container">
                <h3 className="title">Usuario</h3>
              </div>
              <div className="user-inf-container">
                <h3 className="title">Email</h3>
              </div>
            </div>

            {users.map(({ username, email }, index) => (
              <div
                key={index}
                className="element-container"
                onClick={() => setSelectedUser(users[index])}
                style={
                  selectedUser?.username === username
                    ? selectedUserStyle
                    : defaultUserStyle
                }
              >
                <div className="user-inf-container">
                  <div className="user-data-container">
                    <p>{username}</p>
                  </div>
                </div>
                <div className="user-inf-container">
                  <div className="email-data-container">
                    <p>{email}</p>
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
                  <p>{selectedUser.roles.map(getRoleDescription)}</p>
                </div>
              </div>
              <div className="c-r-selector-container">
                <h4>Cambiar Rol</h4>
                <div>
                  <select
                    className="role-selector"
                    defaultValue=""
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="" disabled>
                      Roles
                    </option>
                    {getAvailableRoles(selectedUser.roles).map((role) => (
                      <option key={role} value={role}>
                        {getRoleDescription(role)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="c-r-button-container">
                <button
                  className="c-r-button"
                  onClick={() => {
                    if (newRole) {
                      handleChangeRole(selectedUser.username, newRole);
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