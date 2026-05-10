import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/layout";
import Login from "./pages/Usuarios/Login";
import Cadastro from "./pages/Usuarios/Register";
import Paciente from "./pages/Paciente/ListPatientPage";
import Dashboard from "./pages/Dashboard";
import Terapeuta from "./pages/Terapeuta/ListTherapistPage";
import CreatePatientPage from "./pages/Paciente/CreatePatientPage";
import DetailsPatientPage from "./pages/Paciente/DetailsPatientPage";
import Game from "./pages/Game/Game";

function App() {

  return (
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>}/>
        <Route path="/pacientes" element={<Layout><Paciente /></Layout>}/>
        <Route path="/pacientes/create" element={<Layout><CreatePatientPage /></Layout> }/>
        <Route path="/pacientes/details/:id" element={<Layout><DetailsPatientPage /></Layout> }/>
        <Route path="/terapeutas" element={<Layout><Terapeuta /></Layout>}/>
        <Route path="/game" element={<Game />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
