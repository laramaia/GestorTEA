import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";
import api from "../../../services/api";
import styles from "../Login/login.module.css";
import { FiMail, FiLock } from "react-icons/fi";

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
      <div className={styles.card}>
      <h1 className={styles.title}>Entrar</h1>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          icon={<FiMail className={styles.icon} />}
          name="email"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />

        <Input
          icon={<FiLock className={styles.icon} />}
          name="senha"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSenha(e.target.value)
          }
          required
        />

        {erro && <p className={styles.erro}>{erro}</p>}
        <p className={styles.link}>
        Esqueceu sua senha? <span><Link to="/register" className={styles.link_span}>Clique aqui</Link></span>
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          {"Entrar"}
        </Button>
      </form>
    </div>
    </div>
  );
}

export default Login;