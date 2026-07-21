import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useTherapist } from "../../../hooks/useTherapist";
import Input from "../../../components/Input/input";
import styles from "../ListTherapist/listTherapist.module.css";

export default function ListTherapists() {
  const navigate = useNavigate();

  const {
    searchTerm,
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    loading,
  } = useTherapist(5);

  return (
    <div className={styles.container}>
      <header className={styles.topHeader}>
        <h1>Terapeutas</h1>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/terapeutas/create")}
        >
          Adicionar terapeutas
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.titleArea}>
            <h2>Terapeutas cadastrados</h2>
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
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>Carregando...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome do terapeuta</th>
                <th>Numero de celular</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((therapist) => (
                <tr key={therapist.therapistId}>
                  <td className={styles.nameCell}>{therapist.nomeCompleto}</td>
                  <td>{therapist.numeroCelular || "-"}</td>
                  <td>{therapist.email || "-"}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() =>
                        navigate(`/terapeutas/create/${therapist.therapistId}`)
                      }
                    >
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
