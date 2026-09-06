using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Pergunta
{
    [Key]
    public int PerguntaId { get; set; }

    public string Enunciado { get; set; } = string.Empty;

    public int Ordem { get; set; }

    public int FaseId { get; set; }

    public Fase? Fase { get; set; }

    public List<Opcao> Opcoes { get; set; } = new();
}