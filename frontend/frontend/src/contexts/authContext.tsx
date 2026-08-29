import { createContext, useContext, useState, type ReactNode } from "react";

export type Perfil = "Admin" | "Terapeuta";

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
}

interface AuthContextType {
  usuario: UsuarioLogado | null;
  logar: (token: string, usuario: UsuarioLogado) => void;
  deslogar: () => void;
  estaAutenticado: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(() => {
    const raw = localStorage.getItem("usuario");
    return raw ? (JSON.parse(raw) as UsuarioLogado) : null;
  });

  function logar(token: string, novoUsuario: UsuarioLogado) {
    localStorage.setItem("token", token); // mesma chave que api.ts já lê
    localStorage.setItem("usuario", JSON.stringify(novoUsuario));
    setUsuario(novoUsuario);
  }

  function deslogar() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, logar, deslogar, estaAutenticado: !!usuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  return ctx;
}
