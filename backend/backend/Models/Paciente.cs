using System.ComponentModel.DataAnnotations;
using backend.Models.Commons;

namespace backend.Models;

public class Paciente
{
    [Key]
    public int PacienteId { get; set; }
    [MaxLength(500)]
    public string? FotoPerfil { get; set; }
    [Required(ErrorMessage = "Nome é obrigatório.")]
    public string NomeCompleto { get; set; } = string.Empty;
    public SexoEnum Sexo { get; set; }
    [MaxLength(11)]
    public string? Cpf { get; set; }
    public string Endereco { get; set; } = string.Empty;
    [Required(ErrorMessage = "Data de nascimento é obrigatório.")]
    public DateTime DataNascimento { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}