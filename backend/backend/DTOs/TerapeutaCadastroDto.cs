using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class TerapeutaCadastroDto
{
    [Required(ErrorMessage = "Nome completo é obrigatório.")]
    [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
    public string NomeCompleto { get; set; } = string.Empty;

    [Required(ErrorMessage = "Número de licença é obrigatório.")]
    public string NumeroLicenca { get; set; } = string.Empty;

    [Required(ErrorMessage = "Especialização é obrigatória.")]
    public string Especializacao { get; set; } = string.Empty;

    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail em formato inválido.")]
    public string Email { get; set; } = string.Empty;

    public string? NumeroCelular { get; set; }
    [Required(ErrorMessage = "A senha é obrigatória.")]
    [StringLength(30, MinimumLength = 6, ErrorMessage = "A senha deve ter entre {2} e {1} caracteres.")]
    public string Senha { get; set; } = string.Empty;

    //[Compare("Senha", ErrorMessage = "As senhas não coincidem.")]
    //public string ConfirmarSenha { get; set; } = string.Empty;
}