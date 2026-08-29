import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";
import api from "../../../services/api";
import styles from "../Login/login.module.css";
import { FaUser } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";

interface StatusResponse {
  adminConfigurado: boolean;
}

function SetupAdmin() {
  const [checking, setChecking] = useState(true);
  const [jaConfigurado, setJaConfigurado] = useState(false);

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function verificarStatus() {
      try {
        const response = await api.get<StatusResponse>("Auth/status");
        setJaConfigurado(response.data.adminConfigurado);
      } catch {
        setJaConfigurado(false);
      } finally {
        setChecking(false);
      }
    }

    verificarStatus();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await api.post("Auth/setup-admin", { nomeCompleto, email, senha });
      setSucesso(true);
    } catch (err: any) {
      setErro(
        err.response?.data?.mensagem ||
          "Não foi possível criar o administrador.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return null;
  }

  if (jaConfigurado) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.card}>
          <h1 className={styles.title}>Sistema já configurado</h1>
          <p className={styles.link}>
            Já existe um administrador cadastrado neste sistema. Peça a ele para
            criar seu acesso, ou{" "}
            <Link to="/" className={styles.link_span}>
              volte para o login
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.card}>
          <h1 className={styles.title}>Administrador criado!</h1>
          <p className={styles.link}>
            Agora você já pode{" "}
            <span
              className={styles.link_span}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              entrar com essas credenciais
            </span>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Primeiro acesso</h1>
        <p className={styles.link}>
          Nenhum administrador foi configurado ainda. Crie a conta que vai
          gerenciar o sistema — esta tela só funciona uma única vez.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            icon={<FaUser className={styles.icon} />}
            name="nomeCompleto"
            placeholder="Nome completo"
            value={nomeCompleto}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNomeCompleto(e.target.value)
            }
            required
          />

          <Input
            icon={<MdEmail className={styles.icon} />}
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
            icon={<MdLock className={styles.icon} />}
            name="senha"
            type="password"
            placeholder="Senha"
            value={senha}
            minLength={6}
            maxLength={30}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSenha(e.target.value)
            }
            required
          />

          <Input
            icon={<MdLock className={styles.icon} />}
            name="confirmarSenha"
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmarSenha(e.target.value)
            }
            required
          />

          {erro && <p className={styles.erro}>{erro}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar administrador"}
          </Button>
        </form>

        <p className={styles.link}>
          <Link to="/" className={styles.link_span}>
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SetupAdmin;
