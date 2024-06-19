import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import ChangeRole from './pages/admin/ChangeRole';

import MainAssistant from './pages/assistant/MainAssistant';
import AprobarCita from './pages/assistant/Citas';
import Prescription from './pages/assistant/Prescription';
import UserMain from './pages/user/UserMain';
import Record from './pages/assistant/Record';
import MainDoctor from './pages/doctor/MainDoctor';
import PrescriptionDoctor from './pages/doctor/Prescription';
import Citas from './pages/doctor/Citas';
import Patient from './pages/patient/Patient';

import CitasPatient from './pages/patient/CitasPatient';

import MyPrescription from './pages/patient/MyPrescription';

import RecordDoctor from './pages/doctor/RecordDoctor';

import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          <Route path="/ChangeRole" element={<ChangeRole />} />

          <Route path="/Assistant" element={<MainAssistant />} />
          <Route path="/Cita" element={<AprobarCita />} />
          <Route path="/Prescripcion" element={<Prescription />} />
          <Route path="/User" element={<UserMain />} />
          <Route path="/Record" element={<Record />} />
          <Route path="/Doctor" element={<MainDoctor />} />
          <Route path="/PrescriptionDoctor" element={<PrescriptionDoctor />} />
          <Route path="/Appointment" element={<Citas />} />
          <Route path="/Patient" element={<Patient />} />
          <Route path="/CitasPatient" element={<CitasPatient />} />
          <Route path="/MyRecord" element={<MyPrescription />} />
          <Route path="/DoctorRecord" element={<RecordDoctor />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
