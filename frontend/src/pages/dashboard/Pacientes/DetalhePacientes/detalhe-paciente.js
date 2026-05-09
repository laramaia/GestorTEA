import { useNavigate } from "react-router-dom";
import styles from "./detalhes.module.css";

function DetalhePacientes() {
  const navigate = useNavigate();
  return (
    <div className={styles.modal_overlay}>
      <div className={styles.patient_detail_modal}>
        <button
          className={styles.close_btn}
          onClick={() => navigate("/listar-pacientes")}
          aria-label="Fechar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.detail_layout}>
          <div className={styles.profile_sidebar}>
            <img className={styles.profile_large_avatar} />

            <h2 className={styles.profile_name}></h2>

            <div className={styles.profile_info_group}>
              <h4>Data de nascimento</h4>
            </div>

            <div className={styles.profile_info_group}>
              <h4>Nome do responsável</h4>
            </div>

            <div className={styles.profile_info_group}>
              <h4>Contato de responsável</h4>
            </div>
          </div>
          <div className={styles.detail_content}>
            <div className={styles.tabs}>
              <h1>Atividade</h1>
            </div>

            <div className={styles.tab_content}>
              <div className={styles.activity_level}>
                <h4>Nível de atividade</h4>
              </div>
              <div className={styles.atividade_view}>
                <div className={styles.goal_section}>
                  <h4>Objetivo da Atividade:</h4>
                </div>

                <div className={styles.goal_section}>
                  <h4>Objetivo da Atividade:</h4>
                </div>

                <div className={styles.action_footer}>
                  <button className={styles.start_activity_btn}>
                    Iniciar atividade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhePacientes;
