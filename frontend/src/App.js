import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import SideBar from "./components/SideBar/sideBar";
import Login from "./pages/usuarios/Login/login";
import CadastroTerapeuta from "./pages/usuarios/Cadastro/cadastro-terapeuta";
import ListaPacientes from "./pages/dashboard/Pacientes/ListaPacientes/lista-pacientes";
import AdicionaPacientes from "./pages/dashboard/Pacientes/CriarPacientes/criar-paciente";
import DetalhePacientes from "./pages/dashboard/Pacientes/DetalhePacientes/detalhe-paciente";

// Componente auxiliar para gerenciar a lógica da SideBar
function AppContent() {
  const location = useLocation();
  const esconderSideBar =
    location.pathname === "/" || location.pathname === "/cadastro";

  return (
    <div className="App" style={{ display: "flex", minHeight: "100vh" }}>
      {!esconderSideBar && <SideBar />}

      <main
        style={{
          flexGrow: 1,
          backgroundColor: "#1a1a2e",
          overflowY: "auto",
          padding: esconderSideBar ? "0px" : "20px", 
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<CadastroTerapeuta />} />
          <Route path="/listar-pacientes" element={<ListaPacientes />} />
          <Route path="/adicionar-pacientes" element={<AdicionaPacientes />} />
          <Route path="/detalhes-pacientes" element={<DetalhePacientes />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
