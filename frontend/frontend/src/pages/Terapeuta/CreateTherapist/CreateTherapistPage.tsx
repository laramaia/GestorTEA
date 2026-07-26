import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CreateTherapist/createTherapist.module.css";
import type { TherapistCreatePayload } from "../../../types/therapist";
import api from "../../../services/api";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";
import FeedbackModal from "../../../components/FeedbackModal/feedBackModal";

interface FormErrors {
  nomeCompleto?: string;
  numeroLicenca?: string;
  especializacao?: string;
  numeroCelular?: string;
  email?: string;
  senha?: string;
  repetirSenha?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONE_REGEX = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

type Feedback = { type: "success" | "error"; message: string } | null;

export default function CreateTherapist() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [form, setForm] = useState({
    nomeCompleto: "",
    sexo: "1",
    numeroLicenca: "",
    especializacao: "",
    email: "",
    numeroCelular: "",
    senha: "",
    repetirSenha: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
  };

  const handleClose = () => {
    navigate("/terapeutas");
  };

  const validarFormulario = (): FormErrors => {
    const errors: FormErrors = {};

    if (!form.nomeCompleto.trim()) {
      errors.nomeCompleto = "Nome completo é obrigatório.";
    } else if (form.nomeCompleto.trim().length > 100) {
      errors.nomeCompleto = "O nome não pode exceder 100 caracteres.";
    }

    if (!form.numeroLicenca.trim()) {
      errors.numeroLicenca = "Número de licença é obrigatório.";
    }

    if (!form.especializacao.trim()) {
      errors.especializacao = "Especialização é obrigatória.";
    }

    if (
      form.numeroCelular.trim() &&
      !TELEFONE_REGEX.test(form.numeroCelular.trim())
    ) {
      errors.numeroCelular = "Telefone inválido. Ex: (65) 91234-5678";
    }

    if (!form.email.trim()) {
      errors.email = "E-mail é obrigatório.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = "E-mail em formato inválido.";
    }

    if (!form.senha) {
      errors.senha = "A senha é obrigatória.";
    } else if (form.senha.length < 6 || form.senha.length > 30) {
      errors.senha = "A senha deve ter entre 6 e 30 caracteres.";
    }

    if (!form.repetirSenha) {
      errors.repetirSenha = "Repita a senha.";
    } else if (form.senha !== form.repetirSenha) {
      errors.repetirSenha = "As senhas não coincidem.";
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validarFormulario();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const payload: TherapistCreatePayload = {
      nomeCompleto: form.nomeCompleto,
      sexo: Number(form.sexo),
      numeroLicenca: form.numeroLicenca,
      especializacao: form.especializacao,
      email: form.email,
      numeroCelular: form.numeroCelular || null,
      senha: form.senha,
    };

    try {
      await api.post("/Terapeuta/inserir", payload);

      setFeedback({
        type: "success",
        message: `${form.nomeCompleto.split(" ")[0]} foi cadastrado com sucesso no sistema.`,
      });
    } catch (err: any) {
      console.log("Status do erro:", err.response?.status);
  console.log("Detalhes da validação (Backend):", err.response?.data);
      console.error("Erro na requisição:", err.response?.data || err);
      setFeedback({
        type: "error",
        message:
          err.response?.data?.mensagem ||
          "Não foi possível cadastrar o terapeuta. Verifique os dados e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClose = () => {
    const wasSuccess = feedback?.type === "success";
    setFeedback(null);
    if (wasSuccess) navigate("/terapeutas");
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

        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className={styles.modal_content}>
            <div className={styles.therapist_form}>
              <div className={styles.form_group}>
                <label>Nome Completo</label>
                <Input
                  type="text"
                  name="nomeCompleto"
                  value={form.nomeCompleto}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.nomeCompleto && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.nomeCompleto}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>Sexo</label>
                <select
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                  className={styles.select_input}
                  required
                >
                  <option value="1">Feminino</option>
                  <option value="2">Masculino</option>
                </select>
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
                {fieldErrors.numeroLicenca && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.numeroLicenca}
                  </span>
                )}
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
                {fieldErrors.especializacao && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.especializacao}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>Número de celular</label>
                <Input
                  type="text"
                  name="numeroCelular"
                  value={form.numeroCelular}
                  onChange={handleChange}
                  placeholder="(65) 91234-5678"
                />
                {fieldErrors.numeroCelular && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.numeroCelular}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>E-mail</label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>Senha</label>
                <Input
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  required
                  minLength={6}
                  maxLength={30}
                />
                {fieldErrors.senha && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.senha}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>Repita a senha</label>
                <Input
                  type="password"
                  name="repetirSenha"
                  value={form.repetirSenha}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.repetirSenha && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.repetirSenha}
                  </span>
                )}
              </div>

              <div className={styles.modal_footer}>
                <Button type="submit" disabled={loading}>
                  {loading ? "Cadastrando..." : "Adicionar terapeuta"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {feedback && (
        <FeedbackModal
          type={feedback.type}
          title={
            feedback.type === "success" ? "Sucesso!" : "Ops, algo deu errado"
          }
          message={feedback.message}
          buttonText={
            feedback.type === "success" ? "Concluído" : "Tentar novamente"
          }
          onClose={handleFeedbackClose}
        />
      )}
    </div>
  );
}
