using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

public class PerguntaController : CrudController<Pergunta>
{
    public PerguntaController(AppDbContext db) : base(db)
    { }

    [HttpGet("listar")]
    public override async Task<IActionResult> ObterTodos()
    {
        var perguntas = await _db.Perguntas
            .Include(p => p.Opcoes)
            .AsNoTracking()
            .OrderBy(p => p.FaseId)
            .ThenBy(p => p.Ordem)
            .ToListAsync();

        return Ok(perguntas);
    }

    [HttpGet("fase/{faseId:int}")]
    public async Task<IActionResult> ObterPorFase(
        int faseId
    )
    {
        var perguntas = await _db.Perguntas
            .Include(p => p.Opcoes)
            .AsNoTracking()
            .Where(p => p.FaseId == faseId)
            .OrderBy(p => p.Ordem)
            .ToListAsync();

        return Ok(perguntas);
    }
}