using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Terapeuta
    {
        public int TerapeutaId { get; set; }
        [Required(ErrorMessage = "Nome é obrigatório.")]
        public string NomeCompleto { get; set; } = string.Empty;
        [Required(ErrorMessage = "Número de licença é obrigatório.")]
        public string NumeroLicenca { get; set; } = string.Empty;
        [Required(ErrorMessage = "Especialização é obrigatório.")]
        public string Especializacao { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? NumeroCelular { get; set; }
        [Required(ErrorMessage = "Status é obrigatório.")]
        public bool Ativo { get; set; }
    }
}