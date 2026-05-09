import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/createPatient.module.css";
import api from "../../services/api";
import Input from "../../components/Input/input";

export default function CriarPacientes() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    nomeCompleto: "",
    descricao: "",
    dataNascimento: "",
    responsavel: "",
    telefone: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    navigate("/pacientes");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      await api.post("/Paciente/inserir", {
        nomeCompleto: form.nomeCompleto,
        dataNascimento: new Date(form.dataNascimento).toISOString(),
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      });

      navigate("/pacientes");
    } catch (err) {
      setErro("Erro ao cadastrar paciente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.add_patient_modal}>
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

        <h2 className={styles.modal_title}>Dados do paciente</h2>

        {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

        <div className={styles.modal_content}>
          <form className={styles.patient_form} onSubmit={handleSubmit}>
            <div className={styles.form_group}>
              <label>Nome do paciente</label>
              <Input
                type="text"
                name="nomeCompleto"
                value={form.nomeCompleto}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.form_group}>
              <label>Descrição</label>
              <Input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
              />
            </div>

            <div className={styles.form_group}>
              <label>Data de nascimento</label>
              <Input
                type="date"
                name="dataNascimento"
                value={form.dataNascimento}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.form_group}>
              <label>Contato do responsável</label>
              <Input
                type="text"
                name="responsavel"
                value={form.responsavel}
                onChange={handleChange}
              />
            </div>

            <div className={styles.form_group}>
              <label>Telefone do responsável</label>
              <Input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.modal_footer}>
              <button
                className={styles.submit_btn}
                type="submit"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Adicionar paciente"}
              </button>
            </div>
          </form>

          <div className={styles.photo_upload_section}>
            <span className={styles.photo_label}>Foto do paciente</span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <div
              className={styles.photo_placeholder}
              onClick={handlePlaceholderClick}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.preview_img}
                />
              ) : (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
