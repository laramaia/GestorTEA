using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

public class OpcaoController : CrudController<Opcao>
{
    public OpcaoController(AppDbContext db) : base(db)
    { }

    [HttpGet("listar")]
    public override async Task<IActionResult> ObterTodos()
    {
        var lista = await _db.Opcoes.AsNoTracking().ToListAsync();
        return Ok(lista);
    }

    [HttpPut("atualizar/{id:int}")]
    public override async Task<IActionResult> Atualizar(int id, [FromBody] Opcao opcaoAtualizada)
    {
        var opcaoNoBanco = await _db.Opcoes.FindAsync(id);

        if (opcaoNoBanco == null) 
            return NotFound(new { mensagem = "Opção não encontrada." });

        opcaoNoBanco.Texto = opcaoAtualizada.Texto;
        opcaoNoBanco.EhCorreta = opcaoAtualizada.EhCorreta;

        await _db.SaveChangesAsync();

        return Ok(new { 
            mensagem = "Opção atualizada!", 
            opcao = opcaoNoBanco 
        });
    }
}