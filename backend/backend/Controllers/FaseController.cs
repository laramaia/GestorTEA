using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FaseController : Controller
{
    private readonly AppDbContext _db;

    public FaseController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> CriarFase([FromBody] Fase fase)
    {
        var opcoesParaSalvar = fase.Opcoes;
        fase.Opcoes = new List<Opcao>();

        await _db.Fases.AddAsync(fase);
        await _db.SaveChangesAsync();
        if (opcoesParaSalvar != null && opcoesParaSalvar.Any())
        {
            foreach (var opcao in opcoesParaSalvar)
            {
                opcao.FaseId = fase.FaseId; 
            }

            await _db.Opcoes.AddRangeAsync(opcoesParaSalvar);
            await _db.SaveChangesAsync();
        }

        fase.Opcoes = opcoesParaSalvar;

        return Created(string.Empty, new
        { 
            mensagem = "Fase cadastrada com sucesso!", 
            fase = fase
        });
    }

    [HttpGet("listar")]
    public IActionResult ListarFases()
    {
        var fases = _db.Fases.Include(f => f.Opcoes).ToList();
        return Ok(fases);
    }
    
    [HttpDelete("deletar/{id}")]
    public async Task<IActionResult> DeletarFase(int id)
    {
        // 1. Busca a fase junto com as suas opções associadas
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