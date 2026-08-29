import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type UsuarioLogado } from "../../../contexts/authContext";
import api from "../../../services/api";
import Input from "../../../components/Input/input";
import Button from "../../../components/Button/button";
import FeedbackModal from "../../../components/FeedbackModal/feedBackModal";
import styles from "./login.module.css";
import { MdEmail, MdLock } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginResponse {
  token: string;
  usuario: UsuarioLogado;
}

type ModalState = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [modal, setModal] = useState<ModalState>(null);
  const [dadosLoginTemp, setDadosLoginTemp] = useState<LoginResponse | null>(
    null,
  );

  const { logar } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post<LoginResponse>("Auth/login", {
        email,
        senha,
      });

      setDadosLoginTemp(response.data);

      setModal({
        type: "success",
        title: "Acesso Permitido",
        message: `Seja bem-vindo ${response.data.usuario.nome}!`,
      });
    } catch (err: any) {
      setModal({
        type: "error",
        title: "Falha na Autenticação",
        message:
          err.response?.data?.mensagem ||
          "Senha incorreta ou usuário não encontrado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCloseModal() {
    const isSuccess = modal?.type === "success";
    setModal(null); // Fecha o modal limpando o estado

    if (isSuccess && dadosLoginTemp) {
      // Efetiva o login no Contexto e muda de página após fechar o modal de sucesso
      logar(dadosLoginTemp.token, dadosLoginTemp.usuario);
      navigate("/dashboard");
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <Input
            icon={<MdEmail className={styles.icon} />}
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />

          <div className={styles.passwordWrapper}>
            <Input
              icon={<MdLock className={styles.icon} />}
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSenha(e.target.value)
              }
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Acessar"}
          </Button>
        </form>
      </div>

      {/* Renderização Condicional do seu Modal customizado */}
      {modal && (
        <FeedbackModal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          buttonText="Ok"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
