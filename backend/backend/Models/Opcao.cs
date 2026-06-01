using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Opcao
{
    [Key]
    public int OpcaoId { get; set; }
    public string Texto { get; set; } = string.Empty;
    public bool EhCorreta { get; set; }
    public int FaseId { get; set; }
}