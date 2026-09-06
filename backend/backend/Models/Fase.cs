namespace backend.Models;

public class Fase
{
    public int FaseId { get; set; }

    public int Ordem { get; set; }

    public string Nome { get; set; } = string.Empty;

    public List<Pergunta> Perguntas { get; set; } = new();

    public string Ilustracao { get; set; } = string.Empty;

    public int TotalEstrelas { get; set; } = 3;

    public int EstrelasParaAvancar { get; set; } = 1;
}