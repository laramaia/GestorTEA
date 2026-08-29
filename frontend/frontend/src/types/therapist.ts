export interface Therapist {
  id: number;
  terapeutaId: number;
  nomeCompleto: string;
  email: string;
  numeroLicenca: string;
  especializacao: string;
  numeroCelular: string | null;
  ativo: boolean;
}

export interface TherapistCreatePayload {
  nomeCompleto: string;
  sexo: number;
  numeroLicenca: string;
  especializacao: string;
  email: string;
  numeroCelular: string | null;
  senha: string;
}
