import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";
import api from "../../../services/api";
import styles from "../Cadastro/cadastro.module.css";
import { FaUser, FaUserMd, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";

interface TerapeutaForm {
  NomeCompleto: string;
  NumeroLicenca: string;
  Especializacao: string;
  Email: string;
  NumeroCelular: string;
  Ativo: boolean;
}

function CadastroTerapeuta() {
  const [form, setForm] = useState<TerapeutaForm>({
    NomeCompleto: "",
    NumeroLicenca: "",
    Especializacao: "",
    Email: "",
    NumeroCelular: "",
    Ativo: true,
  });

  const [mensagem, setMensagem] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem("Enviando...");

    try {
      await api.post("Terapeuta/inserir", form);
      setMensagem("Terapeuta cadastrado com sucesso!");

      setForm({
        NomeCompleto: "",
        NumeroLicenca: "",
        Especializacao: "",
        Email: "",
        NumeroCelular: "",
        Ativo: true,
      });
    } catch (error: any) {
      console.error("Erro:", error.response?.data);
      if (error.response?.data?.errors) {
        const mensagens = Object.values(error.response.data.errors)
          .flat()
          .join(" | ");
        setMensagem(`Erro de validação: ${mensagens}`);
      } else {
        setMensagem("Erro ao conectar com o servidor.");
      }
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Cadastra-se</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            icon={<FaUser className={styles.icon} />}
            name="NomeCompleto"
            value={form.NomeCompleto}
            placeholder="Nome Completo"
            onChange={handleChange}
            required
          />

          <Input
            icon={<IoDocumentText className={styles.icon} />}
            name="NumeroLicenca"
            value={form.NumeroLicenca}
            placeholder="CRP / Registro"
            onChange={handleChange}
            required
          />

          <Input
            icon={<FaUserMd className={styles.icon} />}
            name="Especializacao"
            value={form.Especializacao}
            placeholder="Especialização"
            onChange={handleChange}
            required
          />

          <Input
            icon={<MdEmail className={styles.icon} />}
            name="Email"
            type="email"
            value={form.Email}
            placeholder="E-mail"
            onChange={handleChange}
          />

          <Input
            icon={<FaPhoneAlt className={styles.icon} />}
            name="NumeroCelular"
            value={form.NumeroCelular}
            placeholder="Telefone"
            onChange={handleChange}
          />

          <div className={styles.termosContainer}>
            <input
              type="checkbox"
              id="termos"
              className={styles.checkbox}
              checked={form.Ativo}
              onChange={(e) => setForm({ ...form, Ativo: e.target.checked })}
              required
            />
            <label htmlFor="termos">Concordo com os Termos</label>
          </div>

          <Button type="submit">{"Cadastrar"}</Button>
        </form>

        <p className={styles.link}>
          Já possui cadastro?{" "}
          <span>
            <Link to="/" className={styles.link_span}>
              Entrar
            </Link>
          </span>
        </p>

        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
      </div>
    </div>
  );
}

export default CadastroTerapeuta;
