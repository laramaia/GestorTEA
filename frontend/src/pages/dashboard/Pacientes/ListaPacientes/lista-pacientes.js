import { Link } from "react-router-dom";
import styles from "./lista.module.css";

function ListaPacientes() {
  return (
    <div className={styles.patient_list}>
      <div className={styles.header_actions}>
        <h2>Pacientes</h2>
        <Link className={styles.add_button} to="/adicionar-pacientes">
          Adicionar paciente
        </Link>
      </div>

      <div className={styles.patient_panel}>
        <div className={styles.panel_header}>
          <div>
            <h3 className={styles.panel_title}>Todos pacientes</h3>
            <p className={styles.panel_subtitle}>Todos membros ativos</p>
          </div>

          <div className={styles.panel_filters}>
            <div className={styles.search_bar}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" placeholder="Procurar..." />
            </div>
            <div className={styles.sort_dropdown}></div>
          </div>
        </div>

        <div className={styles.table_header}>
          <div className={styles.col_name}>Nome do paciente</div>
          <div className={styles.col_tasks}>Tarefas completas</div>
          <div className={styles.col_accuracy}>Media de acertos</div>
          <div className={styles.col_actions}></div>
        </div>
      </div>
    </div>
  );
}

export default ListaPacientes;
