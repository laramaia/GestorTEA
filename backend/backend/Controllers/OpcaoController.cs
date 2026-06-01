using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OpcaoController : ControllerBase
{
    private readonly AppDbContext _db;

    public OpcaoController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("listar")]
    public IActionResult ListarTodas()
    {
        return Ok(_db.Opcoes.ToList());
    }

    [HttpPut("atualizar/{id}")]
    public IActionResult AtualizarOpcao(int id, [FromBody] Opcao opcaoAtualizada)
    {
        var opcaoNoBanco = _db.Opcoes.Find(id);

        if (opcaoNoBanco == null) return NotFound("Opção não encontrada.");

        opcaoNoBanco.Texto = opcaoAtualizada.Texto;
        opcaoNoBanco.EhCorreta = opcaoAtualizada.EhCorreta;

        _db.SaveChanges();
        return Ok(new { 
            mensagem = "Opção atualizada!", 
            opcaoNoBanco 
        });
    }

    [HttpDelete("deletar/{id}")]
    public IActionResult DeletarOpcao(int id)
    {
        var opcao = _db.Opcoes.Find(id);

        if (opcao == null) return NotFound("Opção não encontrada.");

        _db.Opcoes.Remove(opcao);
        _db.SaveChanges();

        return Ok(new { mensagem = "Opção removida com sucesso!" });
    }
}