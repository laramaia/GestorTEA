import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CreateTherapist/createTherapist.module.css";
import api from "../../../services/api";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";

export default function CreateTherapist() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    nomeCompleto: "",
    numeroLicenca: "",
    especializacao: "",
    email: "",
    numeroCelular: "",
    senha: "",
    repetirSenha: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    navigate("/terapeutas");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (form.senha || form.repetirSenha) {
      if (form.senha !== form.repetirSenha) {
        setErro("As senhas não coincidem.");
        return;
      }
    }

    setLoading(true);

    try {
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
      setErro("Erro ao cadastrar terapeuta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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

        <h2 className={styles.modal_title}>Dados do terapeuta</h2>

        {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

        <form onSubmit={handleSubmit} className={styles.therapist_form}>
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
            <label>Numero de celular</label>
            <Input
              type="text"
              name="numeroCelular"
              value={form.numeroCelular}
              onChange={handleChange}
            />
          </div>

          <div className={styles.form_group}>
            <label>Email</label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.form_group}>
            <label>Senha</label>
            <Input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
            />
          </div>

          <div className={styles.form_group}>
            <label>Repita a senha</label>
            <Input
              type="password"
              name="repetirSenha"
              value={form.repetirSenha}
              onChange={handleChange}
            />
          </div>

          <div className={styles.modal_footer}>
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Adicionar terapeuta"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
