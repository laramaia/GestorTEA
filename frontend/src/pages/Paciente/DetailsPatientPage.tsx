import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import styles from "../../styles/detailsPatient.module.css";
import type { Patient } from "../../types/patient";

const MOCK_PATIENTS: Patient[] = [
  { id: "1", name: "Sabrina Silva", tasksCompleted: "33/36", averageScore: 39, photoUrl: "https://object.pixocial.com/pixocial/dmxffni837f1xrj8pki9xgrl.jpg" },
  { id: "2", name: "Carlos Oliveira", tasksCompleted: "28/36", averageScore: 31, photoUrl: "https://object.pixocial.com/pixocial/dmxffni837f1xrj8pki9xgrl.jpg" },
  { id: "3", name: "Mariana Santos", tasksCompleted: "30/36", averageScore: 34, photoUrl: "https://object.pixocial.com/pixocial/dmxffni837f1xrj8pki9xgrl.jpg" },
  { id: "4", name: "Mariana Santos", tasksCompleted: "30/36", averageScore: 34, photoUrl: "https://object.pixocial.com/pixocial/dmxffni837f1xrj8pki9xgrl.jpg" },
  { id: "5", name: "Mariana Santos", tasksCompleted: "30/36", averageScore: 34, photoUrl: "https://object.pixocial.com/pixocial/dmxffni837f1xrj8pki9xgrl.jpg" },
];
export default function DetailsPatient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"atividade" | "desempenho">("atividade");

  const patient = MOCK_PATIENTS.find((p) => p.id === id) ?? MOCK_PATIENTS[0];

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.patient_detail_modal}>
        <button className={styles.close_btn} onClick={() => navigate("/pacientes")}>
          <FiX size={24} />
        </button>

        <div className={styles.detail_layout}>
          <aside className={styles.profile_sidebar}>
            <div className={styles.avatar_container}>
              <img src={patient.photoUrl} alt={patient.name} className={styles.profile_large_avatar} />
            </div>
            <h2 className={styles.profile_name}>{patient.name}</h2>
            <p className={styles.profile_description}>
              {patient.name.split(' ')[0]} tem 13 anos, e apresenta nível moderado
            </p>

            <div className={styles.profile_info_group}>
              <h4>Data de nascimento</h4>
              <p>2 de mar. de 2012</p>
            </div>

            <div className={styles.profile_info_group}>
              <h4>Nome do responsável</h4>
              <p>Luiz Silva</p>
            </div>

            <div className={styles.profile_info_group}>
              <h4>Contato de responsável</h4>
              <p>65 7521-8415</p>
            </div>

            <button className={styles.edit_profile_btn}>Editar perfil</button>
          </aside>
          <main className={styles.detail_content}>
            <nav className={styles.tabs_nav}>
              <button 
                className={activeTab === "atividade" ? styles.tab_active : ""} 
                onClick={() => setActiveTab("atividade")}
              >
                Atividade
              </button>
              <button 
                className={activeTab === "desempenho" ? styles.tab_active : ""} 
                onClick={() => setActiveTab("desempenho")}
              >
                Desempenho
              </button>
            </nav>

            <div className={styles.tab_body}>
              {activeTab === "atividade" ? (
                <div className={styles.content_animate}>
                  <div className={styles.info_section}>
                    <h4>Nível de atividade</h4>
                    <p>Nível intermediário - Escola</p>
                  </div>

                  <div className={styles.info_section}>
                    <h4>Objetivo da Atividade:</h4>
                    <p>Trabalhar habilidades de organização, memória e associação de objetos relacionados ao ambiente escolar.</p>
                  </div>

                  <div className={styles.info_section}>
                    <h4>Descrição da Atividade:</h4>
                    <p>A criança será convidada a organizar uma mochila escolar virtual, escolhendo os itens corretos entre várias opções...</p>
                  </div>

                  <div className={styles.action_footer}>
                    <button className={styles.primary_btn} onClick={() => navigate("/game")}>Iniciar atividade</button>
                  </div>
                </div>
              ) : (
                <div className={styles.content_animate}>
                  <div className={styles.info_section}>
                    <h4>Nível de atividade</h4>
                    <p>Nível intermediário - Escola</p>
                  </div>

                  <div className={styles.info_section}>
                    <h4>Atividades finalizadas</h4>
                    <div className={styles.progress_container_large}>
                      <div className={styles.progress_bar_large}>
                        <div className={styles.progress_fill_large} style={{ width: "80%" }}>
                          <span>33/36</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.info_section}>
                    <h4>Média de acertos</h4>
                    <div className={styles.chart_placeholder}>
                      <p style={{color: '#808191', fontSize: '0.8rem'}}>Gráfico de evolução (Jun - Nov)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
