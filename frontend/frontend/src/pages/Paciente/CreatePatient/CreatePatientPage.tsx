import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CreatePatient/createPatient.module.css";
import api from "../../../services/api";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";

export default function CriarPacientes() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFile(file); // Guarda o arquivo físico no estado

    // Para o preview da tela
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

    const mesFormatado = String(mesNum).padStart(2, '0');
    const diaFormatado = String(diaNum).padStart(2, '0');
    
    return `${anoNum}-${mesFormatado}-${diaFormatado}T00:00:00.000Z`;
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    setForm({ ...form, dataNascimento: formatted });
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErro(null);

  try {
    const dataNascimentoFormatada = parseDataNascimento(form.dataNascimento); 

    const formData = new FormData();
    formData.append("NomeCompleto", form.nomeCompleto);
    formData.append("DataNascimento", dataNascimentoFormatada);
    formData.append("Sexo", form.sexo);
    if (form.cpf) formData.append("Cpf", form.cpf);
    if (form.endereco) formData.append("Endereco", form.endereco);

    if (selectedFile) {
      formData.append("foto", selectedFile);
      console.log("Arquivo anexado com sucesso:", selectedFile.name);
    } else {
      console.warn("Nenhum arquivo de imagem foi selecionado!");
    }

    await api.post("/Paciente/inserir", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

    navigate("/pacientes");
  } catch (err: any) {
    console.error("Erro na requisição:", err.response?.data || err);
    setErro("Erro ao cadastrar paciente. Verifique os dados e tente novamente.");
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
              </div>

              <div className={styles.form_group}>
                <label>CPF</label>
                <Input
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                />
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
    </div>
  );
}