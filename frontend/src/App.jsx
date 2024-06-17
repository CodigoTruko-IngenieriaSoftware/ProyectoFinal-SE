import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MainAssistant from './pages/assistant/MainAssistant';
import AprobarCita from './pages/assistant/Citas';
import Prescription from './pages/assistant/Prescription';
import UserMain from './pages/user/UserMain';

import Record from './pages/assistant/Record'
import Patient from './pages/patient/Patient'

import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Assistant" element={<MainAssistant />} />
          <Route path="/Cita" element={<AprobarCita />} />
          <Route path="/Prescripcion" element={<Prescription />} />
          <Route path="/User" element={<UserMain />} />
          <Route path="/Record" element={<Record />} />
          <Route path="/Patient" element={<Patient />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
