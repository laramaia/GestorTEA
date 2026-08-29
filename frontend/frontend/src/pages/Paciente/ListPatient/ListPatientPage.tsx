import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi";
import { usePatients } from "../../../hooks/usePatient";
import Input from "../../../components/Input/input";
import FeedbackModal from "../../../components/FeedbackModal/feedBackModal";
import styles from "../ListPatient/listPatient.module.css";
import api from "../../../services/api";

const getImageUrl = (path?: string) => {
  if (!path || path.trim() === "") {
    return "http://via.placeholder.com/40";
  }

  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  const API_BASE_URL = "http://localhost:5055";
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

type ModalConfig = {
  type: "success" | "error";
  title: string;
  message: string;
  isActionConfirm?: boolean;
} | null;

export default function ListPatient() {
  const navigate = useNavigate();
  const [patientToDelete, setPatientToDelete] = useState<
    string | number | null
  >(null);
  const [modalConfig, setModalConfig] = useState<ModalConfig>(null);

  const {
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    loading,
  } = usePatients(5);

  const triggerDeletePrompt = (id: string | number) => {
    setPatientToDelete(id);
    setModalConfig({
      type: "error",
      title: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir este paciente permanentemente?",
      isActionConfirm: true,
    });
  };

  const handleExecuteDelete = async () => {
    if (!patientToDelete) return;

    try {
      await api.delete(`Paciente/deletar/${patientToDelete}`);

      setModalConfig({
        type: "success",
        title: "Sucesso!",
        message: "O paciente foi removido do sistema com sucesso.",
        isActionConfirm: false,
      });
    } catch (err) {
      console.error("Erro ao deletar paciente:", err);

      setModalConfig({
        type: "error",
        title: "Falha na Ação",
        message:
          "Não foi possível excluir o paciente. Verifique sua conexão e tente novamente.",
        isActionConfirm: false,
      });
    } finally {
      setPatientToDelete(null);
    }
  };

  const handleModalClose = () => {
    const isSuccess =
      modalConfig?.type === "success" && !modalConfig.isActionConfirm;
    setModalConfig(null);

    if (isSuccess) {
      window.location.reload();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.topHeader}>
        <h1>Pacientes</h1>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/pacientes/create")}
        >
          Adicionar paciente
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.titleArea}>
            <h2>Todos pacientes</h2>
            <p>Todos membros ativos</p>
          </div>

          <div className={styles.filterArea}>
            <div className={styles.searchWrapper}>
              <Input
                icon={<FiSearch />}
                placeholder="Procurar..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                name="search"
              />
            </div>
            <select className={styles.selectFilter}>
              <option>Filtrar por: Progresso</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>Carregando...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome do paciente</th>
                <th>Tarefas completas</th>
                <th>Média de acertos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((patient: any) => {
                const rawPhotoPath =
                  patient.photoUrl ||
                  patient.fotoPerfil ||
                  patient.FotoPerfil ||
                  patient.foto ||
                  patient.caminhoFoto;

                const patientName =
                  patient.name || patient.nomeCompleto || patient.NomeCompleto;
                const patientId =
                  patient.id || patient.pacienteId || patient.PacienteId;

                return (
                  <tr key={patientId}>
                    <td className={styles.patientCell}>
                      <img src={getImageUrl(rawPhotoPath)} alt={patientName} />
                      <span>{patientName}</span>
                    </td>
                    <td>
                      {patient.tasksCompleted ?? patient.TarefasCompletas ?? 0}
                    </td>
                    <td>
                      <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{
                              width: `${patient.averageScore || patient.MediaAcertos || 0}%`,
                            }}
                          />
                        </div>
                        <span>
                          {patient.averageScore || patient.MediaAcertos || 0}%
                        </span>
                      </div>
                    </td>
                    <td className={styles.actions}>
                      <button
                        className={styles.resultBtn}
                        onClick={() =>
                          navigate(`/pacientes/details/${patientId}`)
                        }
                      >
                        Resultados
                      </button>
                      <button
                        className={styles.editBtn}
                        onClick={() =>
                          navigate(`/pacientes/create/${patientId}`)
                        }
                        title="Editar paciente"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className={styles.editBtn}
                        style={{
                          color: "#ff6b6b",
                          background: "transparent",
                          marginLeft: "8px",
                        }}
                        onClick={() => triggerDeletePrompt(patientId)}
                        title="Excluir paciente"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <footer className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={
                currentPage === i + 1 ? styles.activePage : styles.pageNumber
              }
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <FiChevronRight />
          </button>
        </footer>
      </div>
      {modalConfig && (
        <FeedbackModal
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          buttonText={
            modalConfig.isActionConfirm ? "Sim, excluir" : "Concluído"
          }
          cancelButtonText="Não, manter"
          showCancelButton={modalConfig.isActionConfirm}
          onClose={
            modalConfig.isActionConfirm ? handleExecuteDelete : handleModalClose
          }
          onCancel={() => setModalConfig(null)}
        />
      )}
    </div>
  );
}
