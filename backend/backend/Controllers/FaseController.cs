using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

public class FaseController : CrudController<Fase>
{
    public FaseController(AppDbContext db) : base(db)
    { }

    [HttpGet("listar")]
    public override async Task<IActionResult> ObterTodos()
    {
        var fases = await _db.Fases
            .Include(f => f.Opcoes)
            .AsNoTracking()
            .ToListAsync();

        return Ok(fases);
    }

    [NonAction]
    public override Task<IActionResult> Criar([FromBody] Fase entidade)
    {
        return base.Criar(entidade);
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> CriarFase([FromBody] FaseCadastroDto dto)
    {
        var novaFase = new Fase
        {
            Ordem = dto.Ordem,
            Nome = dto.Nome,
            Enunciado = dto.Enunciado,
            Ilustracao = dto.Ilustracao,
            TotalEstrelas = dto.TotalEstrelas,
            EstrelasParaAvancar = dto.EstrelasParaAvancar,
            Opcoes = dto.Opcoes.Select(o => new Opcao
            {
                Texto = o.Texto,
                EhCorreta = o.EhCorreta
            }).ToList()
        };

        await _db.Fases.AddAsync(novaFase);
        await _db.SaveChangesAsync();
        
        return Created(string.Empty, new
        {
            mensagem = "Fase cadastrada com sucesso!",
            fase = novaFase
        });
    }

    [HttpDelete("deletar/{id:int}")]
    public override async Task<IActionResult> Deletar(int id)
    {
        var fase = await _db.Fases
            .Include(f => f.Opcoes)
            .FirstOrDefaultAsync(f => f.FaseId == id);

        if (fase == null)
        {
            return NotFound(new { mensagem = "Fase não encontrada." });
        }

        try
        {
            if (fase.Opcoes != null && fase.Opcoes.Any())
            {
                _db.Opcoes.RemoveRange(fase.Opcoes);
            }

            _db.Fases.Remove(fase);
            await _db.SaveChangesAsync();

            return Ok(new { mensagem = "Fase e suas alternativas excluídas com sucesso!" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                mensagem = "Erro interno ao tentar excluir a fase.",
                detalhes = ex.Message
            });
        }
    }
}