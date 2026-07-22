export interface Therapist {
  terapeutaId: number;
  nomeCompleto: string;
  numeroLicenca: string;
  especializacao: string;
  email: string | null;
  numeroCelular: string | null;
  ativo: boolean;
}

export interface TherapistCreatePayload {
  nomeCompleto: string;
  numeroLicenca: string;
  especializacao: string;
  email: string;
  numeroCelular: string | null;
  senha: string;
}
