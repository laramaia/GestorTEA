namespace backend.DTOs;

public class PerguntaCadastroDto
{
    public string Enunciado { get; set; } = string.Empty;

    public int Ordem { get; set; }

    public List<OpcaoCadastroDto> Opcoes { get; set; } = new();
}