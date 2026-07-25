using System.ComponentModel.DataAnnotations;
using backend.Models.Commons;

namespace backend.Models;

public abstract class Usuario
{
    public int UsuarioId { get; set; }
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(150)]
    public string NomeCompleto { get; set; } = string.Empty;
    public SexoEnum Sexo { get; set; }
    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(20)]
    public string? NumeroCelular { get; set; }
    [Required]
    public string SenhaHash { get; set; } = string.Empty;
    public PerfilEnum Perfil { get; protected set; }
    public bool Ativo { get; set; } = true;
    // TODO: Suporte Multi-tenant
    // public int ClinicaId { get; set; }
    // public Clinica? Clinica { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;
}