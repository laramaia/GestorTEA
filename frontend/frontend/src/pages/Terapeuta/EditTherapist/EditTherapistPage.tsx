import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../CreateTherapist/createTherapist.module.css";
import api from "../../../services/api";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";

export default function EditTherapist() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    nomeCompleto: "",
    numeroLicenca: "",
    especializacao: "",
    email: "",
    numeroCelular: "",
  });

  useEffect(() => {
    async function fetchTerapeuta() {
      try {
        const response = await api.get("/Terapeuta/listar");
        const lista = response.data;
        const encontrado = lista.find((t: any) => String(t.terapeutaId) === id);

        if (!encontrado) {
          setErro("Terapeuta não encontrado.");
          return;
        }

        setForm({
          nomeCompleto: encontrado.nomeCompleto ?? "",
          numeroLicenca: encontrado.numeroLicenca ?? "",
          especializacao: encontrado.especializacao ?? "",
          email: encontrado.email ?? "",
          numeroCelular: encontrado.numeroCelular ?? "",
        });
      } catch (err) {
        console.error("Erro ao buscar terapeuta:", err);
        setErro("Não foi possível carregar os dados do terapeuta.");
      } finally {
        setCarregando(false);
      }
    }

    if (id) fetchTerapeuta();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    navigate("/terapeutas");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      await api.delete(`/Terapeuta/deletar/${id}`);

      await api.post("/Terapeuta/inserir", {
        nomeCompleto: form.nomeCompleto,
        numeroLicenca: form.numeroLicenca,
        especializacao: form.especializacao,
        email: form.email || null,
        numeroCelular: form.numeroCelular || null,
        ativo: true,
      });

      navigate("/terapeutas");
    } catch (err) {
      console.error("Erro ao atualizar terapeuta:", err);
      setErro("Erro ao atualizar terapeuta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (carregando) {
    return (
      <div className={styles.modal_overlay}>
        <div className={styles.add_therapist_modal}>
          <p style={{ textAlign: "center", padding: "2rem" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.add_therapist_modal}>
        <button className={styles.close_btn} onClick={handleClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className={styles.modal_title}>Editar terapeuta</h2>

        {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className={styles.modal_content}>
            <div className={styles.therapist_form}>
              <div className={styles.form_group}>
                <label>Nome do terapeuta</label>
                <Input
                  type="text"
                  name="nomeCompleto"
                  value={form.nomeCompleto}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.form_group}>
                <label>Número de licença</label>
                <Input
                  type="text"
                  name="numeroLicenca"
                  value={form.numeroLicenca}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.form_group}>
                <label>Especialização</label>
                <Input
                  type="text"
                  name="especializacao"
                  value={form.especializacao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.form_group}>
                <label>Número de celular</label>
                <Input
                  type="text"
                  name="numeroCelular"
                  value={form.numeroCelular}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.form_group}>
                <label>E-mail</label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.modal_footer}>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
