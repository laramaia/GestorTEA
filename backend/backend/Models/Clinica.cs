using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Clinica
    {
        public int ClinicaId { get; set; }
        [Required(ErrorMessage = "Nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;
        [Required(ErrorMessage = "CNPJ é obrigatório.")]
        public string Cnpj { get; set;} = string.Empty;
        public string? Endereco { get; set; }
        public string? NumeroCelular { get; set; }
        public string? Email { get; set; }
        public DateTime CriadoEm { get; set; }
        public DateTime AtualizadoEm { get; set; }
    }
}