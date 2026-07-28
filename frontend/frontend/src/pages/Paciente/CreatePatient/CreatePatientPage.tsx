import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CreatePatient/createPatient.module.css";
import api from "../../../services/api";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";
import FeedbackModal from "../../../components/FeedbackModal/feedBackModal";

interface FormErrors {
  nomeCompleto?: string;
  dataNascimento?: string;
  cpf?: string;
}

type Feedback = { type: "success" | "error"; message: string } | null;

export default function CriarPacientes() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    sexo: "1",
    cpf: "",
    endereco: "",
  });

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const formatCpfInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
  };

  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfInput(e.target.value);
    setForm({ ...form, cpf: formatted });

    if (fieldErrors.cpf) {
      setFieldErrors({ ...fieldErrors, cpf: undefined });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    navigate("/pacientes");
  };

  const parseDataNascimento = (value: string): string => {
    const [dia, mes, ano] = value.split("/");
    if (!dia || !mes || !ano || ano.length < 4) {
      throw new Error("Data inválida");
    }

    const diaNum = Number(dia);
    const mesNum = Number(mes);
    const anoNum = Number(ano);

    const date = new Date(anoNum, mesNum - 1, diaNum);

    if (
      date.getFullYear() !== anoNum ||
      date.getMonth() !== mesNum - 1 ||
      date.getDate() !== diaNum
    ) {
      throw new Error("Data inválida");
    }

    const mesFormatado = String(mesNum).padStart(2, "0");
    const diaFormatado = String(diaNum).padStart(2, "0");

    return `${anoNum}-${mesFormatado}-${diaFormatado}T00:00:00.000Z`;
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    setForm({ ...form, dataNascimento: formatted });

    if (fieldErrors.dataNascimento) {
      setFieldErrors({ ...fieldErrors, dataNascimento: undefined });
    }
  };

  const validarFormulario = (): FormErrors => {
    const errors: FormErrors = {};

    if (!form.nomeCompleto.trim()) {
      errors.nomeCompleto = "Nome completo é obrigatório.";
    } else if (form.nomeCompleto.trim().length > 150) {
      errors.nomeCompleto = "O nome não pode exceder 150 caracteres.";
    }

    if (!form.dataNascimento.trim()) {
      errors.dataNascimento = "Data de nascimento é obrigatória.";
    } else {
      try {
        parseDataNascimento(form.dataNascimento);
      } catch {
        errors.dataNascimento = "Data inválida. Use uma data válida.";
      }
    }

    if (form.cpf.trim()) {
      const apenasDigitos = form.cpf.replace(/\D/g, "");
      if (apenasDigitos.length > 11) {
        errors.cpf = "O CPF não pode ter mais de 11 dígitos.";
      } else if (apenasDigitos.length < 11) {
        errors.cpf = "O CPF deve ter 11 dígitos.";
      }
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

    try {
      const dataNascimentoFormatada = parseDataNascimento(form.dataNascimento);

      const formData = new FormData();
      formData.append("NomeCompleto", form.nomeCompleto);
      formData.append("DataNascimento", dataNascimentoFormatada);
      formData.append("Sexo", form.sexo);
      if (form.cpf) formData.append("Cpf", form.cpf.replace(/\D/g, ""));
      if (form.endereco) formData.append("Endereco", form.endereco);

      if (selectedFile) {
        formData.append("foto", selectedFile);
      }

      await api.post("/Paciente/inserir", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFeedback({
        type: "success",
        message: `${form.nomeCompleto.split(" ")[0]} foi cadastrado com sucesso no sistema.`,
      });
    } catch (err: any) {
      console.error("Erro na requisição:", err.response?.data || err);
      setFeedback({
        type: "error",
        message:
          err.response?.data?.mensagem ||
          "Não foi possível cadastrar o paciente. Verifique a conexão com o servidor e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClose = () => {
    const wasSuccess = feedback?.type === "success";
    setFeedback(null);
    if (wasSuccess) navigate("/pacientes");
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

        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className={styles.modal_content}>
            <div className={styles.patient_form}>
              <div className={styles.form_group}>
                <label>Nome do paciente</label>
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
                <label>Data de nascimento</label>
                <Input
                  type="text"
                  name="dataNascimento"
                  value={form.dataNascimento}
                  onChange={handleDateChange}
                  placeholder="dd/mm/aaaa"
                  inputMode="numeric"
                  maxLength={10}
                  required
                />
                {fieldErrors.dataNascimento && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.dataNascimento}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>CPF</label>
                <Input
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  maxLength={14}
                />
                {fieldErrors.cpf && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {fieldErrors.cpf}
                  </span>
                )}
              </div>

              <div className={styles.form_group}>
                <label>Endereço</label>
                <Input
                  type="text"
                  name="endereco"
                  value={form.endereco}
                  onChange={handleChange}
                />
              </div>
            </div>

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

          <div className={styles.modal_footer}>
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Adicionar paciente"}
            </Button>
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
