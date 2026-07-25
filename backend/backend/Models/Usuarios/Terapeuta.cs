using System.ComponentModel.DataAnnotations;
using backend.Models.Commons;

namespace backend.Models
{
    public class Terapeuta : Usuario
    {
        [Required(ErrorMessage = "Número de licença é obrigatório.")]
        [MaxLength(50)]
        public string NumeroLicenca { get; set; } = string.Empty;
        [Required(ErrorMessage = "Especialização é obrigatória.")]
        [MaxLength(100)]
        public string Especializacao { get; set; } = string.Empty;
        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
        
        public Terapeuta()
        {
            Perfil = PerfilEnum.Terapeuta; 
        }
    }
}