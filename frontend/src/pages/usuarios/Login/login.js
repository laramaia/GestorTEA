import { React, useState } from "react"; // Adicione useState
import { Link, useNavigate } from "react-router-dom"; // useNavigate para redirecionar
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import api from "../../../services/api";
import styles from "./login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("Terapeuta/listar", { email, senha });

      // Persistência: Salva o token ou ID no localStorage
      // Ajuste 'response.data.token' conforme o retorno da sua API
      localStorage.setItem("userToken", response.data.token);
      console.log("Login realizado:", response.data.message);
      navigate("/listar-pacientes"); // Exemplo: manda para a tela principal
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao fazer login");
    }
  }

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.title}>Login</h1>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          label="Email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <Button texto="Entrar" />
      </form>

      <p className={styles.link}>
        Não tem conta?{" "}
        <span>
          <Link to="/cadastro">Cadastre-se</Link>
        </span>
      </p>
    </div>
  );
}
export default Login;
