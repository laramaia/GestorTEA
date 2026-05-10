import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import styles from "../../styles/detailsPatient.module.css";
import api from "../../services/api";

interface PacienteDetalhe {
  pacienteId: number;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string;
  cpf: string;
  endereco: string;
  criadoEm: string;
}

export default function DetailsPatient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"atividade" | "desempenho">(
    "atividade",
  );
  const [patient, setPatient] = useState<PacienteDetalhe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaciente() {
      try {
        const response = await api.get("/paciente/listar");
        const lista: PacienteDetalhe[] = response.data;
        const encontrado = lista.find((p) => String(p.pacienteId) === id);
        setPatient(encontrado ?? null);
      } catch (err) {
        console.error("Erro ao buscar paciente:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPaciente();
  }, [id]);

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>Carregando...</p>
    );
  if (!patient)
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>
        Paciente não encontrado.
      </p>
    );

  const primeiroNome = patient.nomeCompleto.split(" ")[0];
  const dataNasc = new Date(patient.dataNascimento).toLocaleDateString(
    "pt-BR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.patient_detail_modal}>
        <button
          className={styles.close_btn}
          onClick={() => navigate("/pacientes")}
        >
          <FiX size={24} />
        </button>

        <div className={styles.detail_layout}>
          <aside className={styles.profile_sidebar}>
            <div className={styles.avatar_container}>
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className={styles.profile_name}>{patient.nomeCompleto}</h2>
            <p className={styles.profile_description}>
              {primeiroNome} está cadastrado no sistema.
            </p>

            <div className={styles.profile_info_group}>
              <h4>Data de nascimento</h4>
              <p>{dataNasc}</p>
            </div>

            <div className={styles.profile_info_group}>
              <h4>CPF</h4>
              <p>{patient.cpf || "Não informado"}</p>
            </div>

            <div className={styles.profile_info_group}>
              <h4>Endereço</h4>
              <p>{patient.endereco || "Não informado"}</p>
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
                    <p>
                      Trabalhar habilidades de organização, memória e associação
                      de objetos relacionados ao ambiente escolar.
                    </p>
                  </div>
                  <div className={styles.action_footer}>
                    <button
                      className={styles.primary_btn}
                      onClick={() => navigate("/game")}
                    >
                      Iniciar atividade
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.content_animate}>
                  <div className={styles.info_section}>
                    <h4>Atividades finalizadas</h4>
                    <div className={styles.progress_container_large}>
                      <div className={styles.progress_bar_large}>
                        <div
                          className={styles.progress_fill_large}
                          style={{ width: "80%" }}
                        >
                          <span>33/36</span>
                        </div>
                      </div>
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
