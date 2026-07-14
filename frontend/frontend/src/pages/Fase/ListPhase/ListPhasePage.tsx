import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi";
import api from "../../../services/api";
import Input from "../../../components/Input/input";
import styles from "../../Paciente/ListPatient/listPatient.module.css"; 

interface Opcao {
  opcaoId?: number;
  texto: string;
  ehCorreta: boolean;
  Texto?: string;    
  EhCorreta?: boolean;
}

interface Phase {
  faseId: number;
  enunciado: string;
  opcoes: Opcao[];
  totalEstrelas: number;
  estrelasParaAvancar: number;
}

export default function ListPhasePage() {
  const navigate = useNavigate();
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPhases = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Fase/listar");
console.log("Fases vindas do C#:", response.data);
      
      if (Array.isArray(response.data)) {
        setPhases(response.data);
      } else {
        setPhases([]);
      }
    } catch (err) {
      console.error("Erro ao buscar fases do back-end:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta fase?")) return;

    try {
      await api.delete(`/Fase/deletar/${id}`);
      setPhases((prev) => prev.filter((phase) => phase.faseId !== id));
    } catch (err) {
      console.error("Erro ao deletar fase:", err);
      alert("Não foi possível excluir a fase. Tente novamente.");
    }
  };

  const filteredPhases = phases.filter((phase) => {
    const txtEnunciado = phase.enunciado ?? "";
    return txtEnunciado.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredPhases.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPhases.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <header className={styles.topHeader}>
        <h1>Fases</h1>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/fases/create")}
        >
          Adicionar fase
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.titleArea}>
            <h2>Todas as fases</h2>
            <p>Gerenciamento de perguntas e alternativas</p>
          </div>

          <div className={styles.filterArea}>
            <div className={styles.searchWrapper}>
              <Input
                icon={<FiSearch />}
                placeholder="Procurar fase..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                name="search"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>Carregando...</p>
        ) : currentItems.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#8b8b9a" }}>
            Nenhuma fase encontrada.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Enunciado</th>
                <th style={{ width: "35%" }}>Resposta Correta</th>
                <th style={{ width: "10%", textAlign: "center" }}>Nº Alts</th>
                <th style={{ width: "15%" }}></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((phase) => {
                const id = phase.faseId;
                const enunciado = phase.enunciado ?? "Sem enunciado";
                const alts = phase.opcoes ?? [];

                const opcaoCorretaObj = alts.find(
                  (opt) => opt.ehCorreta === true || opt.EhCorreta === true
                );

                const corretaTexto = opcaoCorretaObj 
                  ? (opcaoCorretaObj.texto ?? opcaoCorretaObj.Texto) 
                  : null;

                return (
                  <tr key={id}>
                    <td className={styles.patientCell}>
                      <span
                        style={{
                          background: "#2a2942",
                          color: "#a5a1ff",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          marginRight: "12px",
                        }}
                      >
                        #{id}
                      </span>
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "320px",
                          display: "inline-block",
                        }}
                        title={enunciado}
                      >
                        {enunciado}
                      </span>
                    </td>
                    <td>
                      {corretaTexto ? (
                        <span style={{ color: "#4caf50", fontWeight: "500" }}>
                          ✓ {corretaTexto}
                        </span>
                      ) : (
                        <span style={{ color: "#ff6b6b", fontSize: "0.9rem" }}>
                          ⚠ Sem resposta correta
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {alts.length}
                    </td>
                    <td className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => navigate(`/fases/create/${id}`)}
                        title="Editar fase"
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
                        onClick={() => handleDelete(id)}
                        title="Excluir fase"
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

        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}