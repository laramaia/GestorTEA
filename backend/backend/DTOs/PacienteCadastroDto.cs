using System.ComponentModel.DataAnnotations;
using backend.Models.Commons;

namespace backend.DTOs;

public class PacienteCadastroDto
{
    public IFormFile? Foto { get; set; }
    [Required(ErrorMessage = "Nome é obrigatório.")]
    public string NomeCompleto { get; set; } = string.Empty;
    public SexoEnum Sexo { get; set; }
    public string? Cpf { get; set; }
    public string Endereco { get; set; } = string.Empty;
    [Required(ErrorMessage = "Data de nascimento é obrigatória.")]
    public DateTime DataNascimento { get; set; }
}