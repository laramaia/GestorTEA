export interface Therapist {
  therapistId: number;
  nomeCompleto: string;
  numeroLicenca: string;
  especializacao: string;
  email?: string;
  numeroCelular?: string;
  ativo: boolean;
}
