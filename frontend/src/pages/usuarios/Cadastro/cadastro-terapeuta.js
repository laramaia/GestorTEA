import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import api from "../../../services/api";
import styles from "./cadastro.module.css";

function CadastroTerapeuta() {
  const [form, setForm] = useState({
    NomeCompleto: "",
    NumeroLicenca: "",
    Especializacao: "",
    Email: "",
    NumeroCelular: "",
    Ativo: true,
  });

  const [mensagem, setMensagem] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    // O console.log agora vai mostrar que está funcionando!
    console.log(`Atualizando ${name} para: ${value}`);
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("Enviando...");

    try {
      const response = await api.post("Terapeuta/inserir", form);

      setMensagem("Terapeuta cadastrado com sucesso!");

      setForm({
        NomeCompleto: "",
        NumeroLicenca: "",
        Especializacao: "",
        Email: "",
        NumeroCelular: "",
        Ativo: true,
      });
    } catch (error) {
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
          name="NomeCompleto" // IGUAL AO STATE
          value={form.NomeCompleto}
          placeholder="Digite seu nome"
          onChange={handleChange}
          required
        />

        <Input
          label="Número de Licença"
          name="NumeroLicenca" // IGUAL AO STATE
          value={form.NumeroLicenca}
          placeholder="CRP / Registro"
          onChange={handleChange}
          required
        />

        <Input
          label="Especialização"
          name="Especializacao" // IGUAL AO STATE
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
            required
            className={styles.checkbox}
            checked={form.Ativo}
            onChange={(e) => setForm({ ...form, Ativo: e.target.checked })}
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
