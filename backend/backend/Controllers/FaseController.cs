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
    public async Task<IActionResult> CriarFase([FromForm] FaseCadastroDto dto)
    {
        string caminhoIlustracao = string.Empty;

        if (dto.Ilustracao != null && dto.Ilustracao.Length > 0)
        {
            var pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ilustracoes-fases");
            if (!Directory.Exists(pasta))
            {
                Directory.CreateDirectory(pasta);
            }

            var nomeArquivo = $"{Guid.NewGuid()}{Path.GetExtension(dto.Ilustracao.FileName)}";
            var caminhoAbsoluto = Path.Combine(pasta, nomeArquivo);

            await using (var stream = new FileStream(caminhoAbsoluto, FileMode.Create))
            {
                await dto.Ilustracao.CopyToAsync(stream);
            }

            caminhoIlustracao = $"/ilustracoes-fases/{nomeArquivo}";
        }

        var novaFase = new Fase
        {
            Ordem = dto.Ordem,
            Nome = dto.Nome,
            Enunciado = dto.Enunciado,
            Ilustracao = caminhoIlustracao,
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
            if (!string.IsNullOrEmpty(fase.Ilustracao))
            {
                var caminhoArquivo = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", fase.Ilustracao.TrimStart('/'));
                if (System.IO.File.Exists(caminhoArquivo))
                {
                    System.IO.File.Delete(caminhoArquivo);
                }
            }

            if (fase.Opcoes.Any())
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