import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/layout";
import Login from "./pages/Usuarios/Login";
import SetupAdmin from "./pages/Usuarios/Administrador/setupAdmin";
import Paciente from "./pages/Paciente/ListPatient/ListPatientPage";
import Dashboard from "./pages/Dashboard";
import ListTherapists from "./pages/Terapeuta/ListTherapist/ListTherapistPage";
import CreateTherapist from "./pages/Terapeuta/CreateTherapist/CreateTherapistPage";
import EditTherapist from "./pages/Terapeuta/EditTherapist/EditTherapistPage";
import CreatePatientPage from "./pages/Paciente/CreatePatient/CreatePatientPage";
import DetailsPatientPage from "./pages/Paciente/DetailsPatient/DetailsPatientPage";
import CreatePhasePage from "./pages/Fase/CreatePhase/CreatePhasePage";
import Game from "./pages/Game/Game";
import ListPhasePage from "./pages/Fase/ListPhase/ListPhasePage";
import ProtectedRoute from "./components/Routes/protectedRoute";
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/setup-admin" element={<SetupAdmin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Terapeuta"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pacientes"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Terapeuta"]}>
                <Layout>
                  <Paciente />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pacientes/create"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Terapeuta"]}>
                <Layout>
                  <CreatePatientPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pacientes/details/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Terapeuta"]}>
                <Layout>
                  <DetailsPatientPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/terapeutas"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Layout>
                  <ListTherapists />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/terapeutas/create"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Layout>
                  <CreateTherapist />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/terapeutas/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Layout>
                  <EditTherapist />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fases"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Terapeuta"]}>
                <Layout>
                  <ListPhasePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fases/create"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Terapeuta"]}>
                <Layout>
                  <CreatePhasePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Terapeuta"]}>
                <Game />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
