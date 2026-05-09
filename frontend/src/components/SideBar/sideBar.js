import { useNavigate } from "react-router-dom"; 
import styles from "./sidebar.module.css";

function SideBar() {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    navigate("/"); 
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar_menu}>
        <h3 className={styles.menu_header}>Menu</h3>
        <nav>
          <a href="#" className={styles.menu_item}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Pacientes
          </a>
        </nav>
      </div>
      <div className={styles.sidebar_footer}>
        <button className={styles.logout_button} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
