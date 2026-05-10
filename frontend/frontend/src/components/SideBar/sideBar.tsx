import { FiHome, FiUsers, FiUserCheck, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarItem from "./sideBarItem";
import Input from "../Input/input";
import styles from "../../styles/sideBar.module.css";

export default function Sidebar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Menu</h2>
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

      <nav className={styles.nav}>
        <SidebarItem icon={<FiHome />} label="Dashboard" onClick={() => navigate("/dashboard")}/>
        <SidebarItem icon={<FiUsers />} label="Pacientes" onClick={() => navigate("/pacientes")}/>
        <SidebarItem icon={<FiUserCheck />} label="Terapeutas" onClick={() => navigate("/terapeutas")}/>
      </nav>
      <button className={styles.logout} onClick={() => navigate("/")}>
        Sair
      </button>
    </aside>
  );
}