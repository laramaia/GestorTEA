namespace backend.Models;

public class Fase
{
    public int FaseId { get; set; }
    public int Ordem { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Enunciado { get; set; } = string.Empty;
    public List<Opcao> Opcoes { get; set; } = new List<Opcao>();
    public int TotalEstrelas { get; set; } = 3;
    public int EstrelasParaAvancar { get; set; } = 1;
}