import { FiGrid, FiSearch } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { FaUserMd } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarItem from "./SideBarItem/sideBarItem";
import Input from "../Input/input";
import styles from "../SideBar/sideBar.module.css";

export default function Sidebar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
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
        <SidebarItem
          icon={<FaUserMd />}
          label="Terapeutas"
          onClick={() => navigate("/terapeutas")}
        />
        <SidebarItem
          icon={<LuGamepad2 />}
          label="Fases"
          onClick={() => navigate("/fases")}
        />
      </nav>
      <button className={styles.logout} onClick={() => navigate("/")}>
        Sair
      </button>
    </aside>
  );
}
