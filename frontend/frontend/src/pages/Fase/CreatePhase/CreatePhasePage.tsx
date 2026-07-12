import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react"; 

interface PhaseForm {
  enunciado: string;
  alternativas: string[];
  respostaCorreta: number | null; 
}

export default function CreatePhasePage() {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.enunciado.trim()) {
      alert("Por favor, preencha o enunciado.");
      return;
    }
    if (formData.alternativas.some((alt) => !alt.trim())) {
      alert("Por favor, preencha todas as 3 alternativas.");
      return;
    }
    if (formData.respostaCorreta === null) {
      alert("Por favor, selecione qual é a alternativa correta.");
      return;
    }

    console.log("Dados da nova fase prontos para enviar para o backend/API:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Nova Fase</h2>

      <div>
        <label htmlFor="enunciado">Enunciado da Questão:</label>
        <input
          id="enunciado"
          type="text"
          placeholder="Digite a pergunta da fase..."
          value={formData.enunciado}
          onChange={handleEnunciadoChange}
        />
      </div>

      <br/>

      <h3>Alternativas (Marque a correta)</h3>
      {formData.alternativas.map((alternativa, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "10px" }}>
          <input
            type="radio"
            name="resposta-correta" 
            checked={formData.respostaCorreta === index}
            onChange={() => handleSelectCorrect(index)}
          />

          <input
            type="text"
            placeholder={`Alternativa ${index + 1}`}
            value={alternativa}
            onChange={(e) => handleAlternativaChange(index, e.target.value)}
          />
        </div>
      ))}

      <br />

      <button type="submit">Salvar</button>
    </form>
  );
}