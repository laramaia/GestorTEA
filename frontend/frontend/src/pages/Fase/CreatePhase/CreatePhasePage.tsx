import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react"; 
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi"; 
import styles from "./createPhase.module.css";
import api from "../../../services/api";

interface QuestionForm {
  enunciado: string;
  alternativas: string[];
  respostaCorreta: number | null;
}

interface PhaseForm {
  nome: string;
  perguntas: QuestionForm[];
}

export default function CreatePhasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [formData, setFormData] = useState<PhaseForm>({
    nome: "",
    perguntas: Array.from({ length: 3 }, () => ({
      enunciado: "",
      alternativas: ["", "", ""],
      respostaCorreta: null,
    })),
  });

  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, nome: e.target.value }));
  };

  const handleEnunciadoQuestionChange = (qIndex: number, value: string) => {
    setFormData((prev) => {
      const novasPerguntas = [...prev.perguntas];
      novasPerguntas[qIndex] = { ...novasPerguntas[qIndex], enunciado: value };
      return { ...prev, perguntas: novasPerguntas };
    });
  };

  const handleAlternativaChange = (qIndex: number, altIndex: number, value: string) => {
    setFormData((prev) => {
      const novasPerguntas = [...prev.perguntas];
      const novasAlternativas = [...novasPerguntas[qIndex].alternativas];
      novasAlternativas[altIndex] = value;
      novasPerguntas[qIndex] = { ...novasPerguntas[qIndex], alternativas: novasAlternativas };
      return { ...prev, perguntas: novasPerguntas };
    });
  };

  const handleSelectCorrect = (qIndex: number, altIndex: number) => {
    setFormData((prev) => {
      const novasPerguntas = [...prev.perguntas];
      novasPerguntas[qIndex] = { ...novasPerguntas[qIndex], respostaCorreta: altIndex };
      return { ...prev, perguntas: novasPerguntas };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    if (!formData.nome.trim()) {
      setErro("Por favor, preencha o nome da fase.");
      setLoading(false);
      return;
    }

    for (let i = 0; i < formData.perguntas.length; i++) {
      const p = formData.perguntas[i];
      if (!p.enunciado.trim()) {
        setErro(`Por favor, preencha o enunciado da Pergunta ${i + 1}.`);
        setLoading(false);
        return;
      }
      if (p.alternativas.some((alt) => !alt.trim())) {
        setErro(`Por favor, preencha todas as alternativas da Pergunta ${i + 1}.`);
        setLoading(false);
        return;
      }
      if (p.respostaCorreta === null) {
        setErro(`Por favor, selecione a resposta correta da Pergunta ${i + 1}.`);
        setLoading(false);
        return;
      }
    }

    try {
      // Como o backend usa [FromForm], montamos o FormData corretamente
      const data = new FormData();
      data.append("Nome", formData.nome);
      data.append("Ordem", "0");
      data.append("TotalEstrelas", "3");
      data.append("EstrelasParaAvancar", "1");

      formData.perguntas.forEach((p, qIndex) => {
        data.append(`Perguntas[${qIndex}].Enunciado`, p.enunciado);
        data.append(`Perguntas[${qIndex}].Ordem`, String(qIndex + 1));

        p.alternativas.forEach((altTexto, altIndex) => {
          data.append(`Perguntas[${qIndex}].Opcoes[${altIndex}].Texto`, altTexto);
          data.append(`Perguntas[${qIndex}].Opcoes[${altIndex}].EhCorreta`, String(altIndex === p.respostaCorreta));
        });
      });

      await api.post("/Fase/inserir", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/fases");
    } catch (err: any) {
      console.error("Erro ao cadastrar fase:", err.response?.data || err);
      setErro(
        err.response?.data?.mensagem ||
        err.response?.data?.message ||
        "Erro ao cadastrar a fase. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.add_patient_modal}>
        <button 
          type="button" 
          className={styles.close_btn} 
          onClick={() => navigate("/fases")}
          title="Fechar"
        >
          <FiX size={24} />
        </button>

        <h2 className={styles.modal_title}>Criar Nova Fase</h2>

        {erro && <p className={styles.error_message}>{erro}</p>}

        <form onSubmit={handleSubmit} className={styles.modal_content}>
          <div className={styles.form_group}>
            <label htmlFor="nomeFase">Nome da Fase</label>
            <input
              id="nomeFase"
              type="text"
              placeholder="Digite o nome da fase (ex: Fase 1)..."
              value={formData.nome}
              onChange={handleNomeChange}
              disabled={loading}
            />
          </div>

          <hr style={{ borderColor: "rgba(255, 255, 255, 0.1)", margin: "16px 0" }} />

          {formData.perguntas.map((pergunta, qIndex) => (
            <div key={qIndex} style={{ marginBottom: "24px" }}>
              <h3 style={{ color: "#a5a1ff", marginBottom: "12px", fontSize: "1.1rem" }}>
                Pergunta {qIndex + 1}
              </h3>

              <div className={styles.form_group}>
                <label htmlFor={`enunciado-${qIndex}`}>Enunciado do Desafio</label>
                <input
                  id={`enunciado-${qIndex}`}
                  type="text"
                  placeholder="Digite a pergunta do desafio..."
                  value={pergunta.enunciado}
                  onChange={(e) => handleEnunciadoQuestionChange(qIndex, e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className={styles.alternatives_section}>
                <span className={styles.alternatives_title}>
                  Alternativas (Marque a correta)
                </span>
                
                <div className={styles.alternatives_list}>
                  {pergunta.alternativas.map((alternativa, altIndex) => (
                    <div key={altIndex} className={styles.alternative_item}>
                      <input
                        type="radio"
                        name={`resposta-correta-${qIndex}`} 
                        className={styles.radio_input}
                        checked={pergunta.respostaCorreta === altIndex}
                        onChange={() => handleSelectCorrect(qIndex, altIndex)}
                        disabled={loading}
                      />

                      <input
                        type="text"
                        className={styles.alternative_input}
                        placeholder={`Alternativa ${altIndex + 1}`}
                        value={alternativa}
                        onChange={(e) => handleAlternativaChange(qIndex, altIndex, e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className={styles.modal_footer}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                backgroundColor: "#a5a1ff",
                color: "#151422",
              }}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}