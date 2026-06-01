using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Paciente
{
    public int PacienteId { get; set; }
    [Required(ErrorMessage = "Nome é obrigatório.")]
    public string NomeCompleto { get; set; } = string.Empty;
    public string Sexo { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    [Required(ErrorMessage = "Data de nascimento é obrigatório.")]
    public DateTime DataNascimento { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}