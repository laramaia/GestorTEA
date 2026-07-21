import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/layout";
import Login from "./pages/Usuarios/Login";
import Cadastro from "./pages/Usuarios/Cadastro";
import Paciente from "./pages/Paciente/ListPatient/ListPatientPage";
import Dashboard from "./pages/Dashboard";
import ListTherapists from "./pages/Terapeuta/ListTherapist/ListTherapistPage";
import CreateTherapist from "./pages/Terapeuta/CreateTherapist/CreateTherapistPage";
import CreatePatientPage from "./pages/Paciente/CreatePatient/CreatePatientPage";
import DetailsPatientPage from "./pages/Paciente/DetailsPatient/DetailsPatientPage";
import CreatePhasePage from "./pages/Fase/CreatePhase/CreatePhasePage";
import Game from "./pages/Game/Game";
import ListPhasePage from "./pages/Fase/ListPhase/ListPhasePage";

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
        <Route path="/terapeutas" element={<Layout><ListTherapists /></Layout> }/>
        <Route path="/terapeutas/create" element={<Layout><CreateTherapist /></Layout> }/>
        <Route path="/terapeutas/create/:id" element={<Layout><CreateTherapist /></Layout> }/>
        <Route path="/fases" element={<Layout><ListPhasePage /></Layout> }/>
        <Route path="/fases/create" element={<Layout><CreatePhasePage /></Layout>}/>
        <Route path="/game" element={<Game />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
