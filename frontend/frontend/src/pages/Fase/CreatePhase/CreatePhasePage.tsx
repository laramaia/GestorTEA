import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react"; 
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi"; 
import styles from "./createPhase.module.css";
import api from "../../../services/api";

interface PhaseForm {
  enunciado: string;
  alternativas: string[];
  respostaCorreta: number | null; 
}

export default function CreatePhasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [formData, setFormData] = useState<PhaseForm>({
    enunciado: "",
    alternativas: ["", "", ""], 
    respostaCorreta: null,
  });

  const handleEnunciadoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, enunciado: e.target.value });
  };

  const handleAlternativaChange = (index: number, value: string) => {
    const novasAlternativas = [...formData.alternativas];
    novasAlternativas[index] = value;
    setFormData({ ...formData, alternativas: novasAlternativas });
  };

  const handleSelectCorrect = (index: number) => {
    setFormData({ ...formData, respostaCorreta: index });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    if (!formData.enunciado.trim()) {
      setErro("Por favor, preencha o enunciado.");
      setLoading(false);
      return;
    }
    if (formData.alternativas.some((alt) => !alt.trim())) {
      setErro("Por favor, preencha todas as 3 alternativas.");
      setLoading(false);
      return;
    }
    if (formData.respostaCorreta === null) {
      setErro("Por favor, selecione qual é a alternativa correta.");
      setLoading(false);
      return;
    }

    try {
      const opcoesMapeadas = formData.alternativas.map((texto, index) => ({
        texto: texto,                                 
        ehCorreta: index === formData.respostaCorreta,   
      }));

      const payload = {
        enunciado: formData.enunciado,                 
        opcoes: opcoesMapeadas,                          
        totalEstrelas: 3,
        estrelasParaAvancar: 1,
        nome: "", 
        ilustracao: "",
        ordem: 0
      };

      await api.post("/Fase/inserir", payload);
      navigate("/fases");
    } catch (err: any) {
      console.error("Erro ao cadastrar fase:", err.response?.data || err);
      setErro(
        err.response?.data?.mensagem || 
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
            <label htmlFor="enunciado">Enunciado do Desafio</label>
            <input
              id="enunciado"
              type="text"
              placeholder="Digite a pergunta do desafio..."
              value={formData.enunciado}
              onChange={handleEnunciadoChange}
              disabled={loading}
            />
          </div>

          <div className={styles.alternatives_section}>
            <span className={styles.alternatives_title}>
              Alternativas (Marque a correta)
            </span>
            
            <div className={styles.alternatives_list}>
              {formData.alternativas.map((alternativa, index) => (
                <div key={index} className={styles.alternative_item}>
                  <input
                    type="radio"
                    name="resposta-correta" 
                    className={styles.radio_input}
                    checked={formData.respostaCorreta === index}
                    onChange={() => handleSelectCorrect(index)}
                    disabled={loading}
                  />

                  <input
                    type="text"
                    className={styles.alternative_input}
                    placeholder={`Alternativa ${index + 1}`}
                    value={alternativa}
                    onChange={(e) => handleAlternativaChange(index, e.target.value)}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          </div>

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