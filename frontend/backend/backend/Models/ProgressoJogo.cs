using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class ProgressoJogo
{
    [Key]
    public int ProgressoJogoId { get; set; }
    public int PacienteId { get; set; }
    public Paciente? paciente { get; set; }
    public int FaseId { get; set; }
    public Fase? fase { get; set; }
    public int EstrelasGanhas { get; set; }
    public DateTime DataConclusao { get; set; } = DateTime.UtcNow;
}