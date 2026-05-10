import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/input";
import Button from "../../components/Button/button";
import api from "../../services/api";
import styles from "../../styles/cadastro.module.css";

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
      <h1 className={styles.title}>Cadastro de Terapeuta</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Nome completo"
          name="NomeCompleto"
          value={form.NomeCompleto}
          placeholder="Digite seu nome"
          onChange={handleChange}
          required
        />

        <Input
          label="Número de Licença"
          name="NumeroLicenca"
          value={form.NumeroLicenca}
          placeholder="CRP / Registro"
          onChange={handleChange}
          required
        />

        <Input
          label="Especialização"
          name="Especializacao"
          value={form.Especializacao}
          placeholder="Ex: Psicologia Infantil"
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="Email"
          type="email"
          value={form.Email}
          placeholder="Digite seu email"
          onChange={handleChange}
        />

        <Input
          label="Telefone"
          name="NumeroCelular"
          value={form.NumeroCelular}
          placeholder="Digite seu telefone"
          onChange={handleChange}
        />

        <div className={styles.termosContainer}>
          <input
            type="checkbox"
            id="termos"
            className={styles.checkbox}
            checked={form.Ativo}
            onChange={(e) =>
              setForm({ ...form, Ativo: e.target.checked })
            }
            required
          />
          <label htmlFor="termos">Concordo com os Termos</label>
        </div>

        <Button texto="Cadastrar" />
      </form>

      <p className={styles.link}>
        Já possui conta?{" "}
        <span>
          <Link to="/">Entrar</Link>
        </span>
      </p>

      {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
    </div>
  );
}

export default CadastroTerapeuta;