import { FiGrid, FiSearch } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { FaUserMd } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import SidebarItem from "./SideBarItem/sideBarItem";
import Input from "../Input/input";
import FeedbackModal from "../../components/FeedbackModal/feedBackModal"; // Importado aqui
import styles from "../SideBar/sideBar.module.css";

export default function Sidebar() {
  const [search, setSearch] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Estado para o modal de deslogar
  const navigate = useNavigate();

  const { usuario, deslogar } = useAuth();

  function confirmLogout() {
    setShowLogoutModal(false);
    deslogar(); // Executa a limpeza dos estados do localStorage
    navigate("/"); // Manda de volta para a tela de login
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.searchContainer}>
        <Input
          icon={<FiSearch />}
          name="search"
          label=""
          placeholder="Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2 className={styles.title}>Menu</h2>

      <nav className={styles.nav}>
        <SidebarItem
          icon={<FiGrid />}
          label="Dashboard"
          onClick={() => navigate("/dashboard")}
        />

        <SidebarItem
          icon={<HiUsers />}
          label="Pacientes"
          onClick={() => navigate("/pacientes")}
        />

        {usuario?.perfil === "Admin" && (
          <SidebarItem
            icon={<FaUserMd />}
            label="Terapeutas"
            onClick={() => navigate("/terapeutas")}
          />
        )}

        <SidebarItem
          icon={<LuGamepad2 />}
          label="Fases"
          onClick={() => navigate("/fases")}
        />
      </nav>

      {/* Ao clicar, ativa apenas o gatilho para o modal aparecer na tela */}
      <button
        className={styles.logout}
        onClick={() => setShowLogoutModal(true)}
      >
        Sair
      </button>

      {showLogoutModal && (
        <FeedbackModal
          type="success"
          title="Sessão Encerrada"
          message="Você foi deslogado com sucesso!"
          buttonText="Sair do Sistema"
          onClose={confirmLogout}
        />
      )}
    </aside>
  );
}
