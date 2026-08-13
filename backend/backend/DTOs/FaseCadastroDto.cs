namespace backend.DTOs;

public class FaseCadastroDto
{
    public int Ordem { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Enunciado { get; set; } = string.Empty;
    public IFormFile? Ilustracao { get; set; }
    public int TotalEstrelas { get; set; } = 3;
    public int EstrelasParaAvancar { get; set; } = 1;
    public List<OpcaoCadastroDto> Opcoes { get; set; } = new();
}