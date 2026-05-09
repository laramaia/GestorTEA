import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/input";
import Button from "../../components/Button/button";
import api from "../../services/api";
import styles from "../../styles/login.module.css";

interface LoginResponse {
  token: string;
  message: string;
}

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post<LoginResponse>("Terapeuta/listar", {
        email,
        senha,
      });

      localStorage.setItem("userToken", response.data.token);

      navigate("/dashboard");  

    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao fazer login");
    }
  }

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.title}>Login</h1>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />

        <Input
          label="Senha"
          name="senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSenha(e.target.value)
          }
          required
        />

        {erro && <p className={styles.erro}>{erro}</p>}

        <Button texto="Entrar" onClick={() => navigate("/dashboard")}/>
      </form>

      <p className={styles.link}>
        Não tem conta?{" "}
        <span>
          <Link to="/register">Cadastre-se</Link>
        </span>
      </p>
    </div>
  );
}

export default Login;