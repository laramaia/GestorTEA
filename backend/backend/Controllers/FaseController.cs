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
            .Include(f => f.Perguntas)
                .ThenInclude(p => p.Opcoes)
            .AsNoTracking()
            .OrderBy(f => f.Ordem)
            .ToListAsync();

        return Ok(fases);
    }

    [HttpGet("{id:int}")]
    public override async Task<IActionResult> ObterPorId(int id)
    {
        var fase = await _db.Fases
            .Include(f => f.Perguntas)
                .ThenInclude(p => p.Opcoes)
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.FaseId == id);

        if (fase == null)
        {
            return NotFound(new
            {
                mensagem = "Fase não encontrada."
            });
        }

        return Ok(fase);
    }

    [NonAction]
    public override Task<IActionResult> Criar([FromBody] Fase entidade)
    {
        return base.Criar(entidade);
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> CriarFase([FromForm] FaseCadastroDto dto)
    {
        if (dto.Perguntas == null || dto.Perguntas.Count != 3)
        {
            return BadRequest(new
            {
                mensagem = "Cada fase deve possuir exatamente 3 perguntas."
            });
        }

        foreach (var pergunta in dto.Perguntas)
        {
            if (string.IsNullOrWhiteSpace(pergunta.Enunciado))
            {
                return BadRequest(new
                {
                    mensagem = "Todas as perguntas devem possuir um enunciado."
                });
            }

            if (pergunta.Opcoes == null || pergunta.Opcoes.Count == 0)
            {
                return BadRequest(new
                {
                    mensagem = $"A pergunta '{pergunta.Enunciado}' deve possuir alternativas."
                });
            }

            var quantidadeCorretas = pergunta.Opcoes.Count(o => o.EhCorreta);

            if (quantidadeCorretas != 1)
            {
                return BadRequest(new
                {
                    mensagem = $"A pergunta '{pergunta.Enunciado}' deve possuir exatamente uma alternativa correta."
                });
            }
        }

        string caminhoIlustracao = string.Empty;

        if (dto.Ilustracao != null && dto.Ilustracao.Length > 0)
        {
            var pasta = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "ilustracoes-fases"
            );

            if (!Directory.Exists(pasta))
            {
                Directory.CreateDirectory(pasta);
            }

            var nomeArquivo =
                $"{Guid.NewGuid()}{Path.GetExtension(dto.Ilustracao.FileName)}";

            var caminhoAbsoluto = Path.Combine(
                pasta,
                nomeArquivo
            );

            await using (var stream = new FileStream(
                caminhoAbsoluto,
                FileMode.Create
            ))
            {
                await dto.Ilustracao.CopyToAsync(stream);
            }

            caminhoIlustracao =
                $"/ilustracoes-fases/{nomeArquivo}";
        }

        var novaFase = new Fase
        {
            Ordem = dto.Ordem,
            Nome = dto.Nome,
            Ilustracao = caminhoIlustracao,
            TotalEstrelas = dto.TotalEstrelas,
            EstrelasParaAvancar = dto.EstrelasParaAvancar,

            Perguntas = dto.Perguntas
                .Select((pergunta, index) => new Pergunta
                {
                    Enunciado = pergunta.Enunciado,

                    Ordem = pergunta.Ordem > 0
                        ? pergunta.Ordem
                        : index + 1,

                    Opcoes = pergunta.Opcoes
                        .Select(opcao => new Opcao
                        {
                            Texto = opcao.Texto,
                            EhCorreta = opcao.EhCorreta
                        })
                        .ToList()
                })
                .ToList()
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
            .Include(f => f.Perguntas)
                .ThenInclude(p => p.Opcoes)
            .FirstOrDefaultAsync(f => f.FaseId == id);

        if (fase == null)
        {
            return NotFound(new
            {
                mensagem = "Fase não encontrada."
            });
        }

        try
        {
            if (!string.IsNullOrEmpty(fase.Ilustracao))
            {
                var caminhoArquivo = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    fase.Ilustracao.TrimStart('/')
                );

                if (System.IO.File.Exists(caminhoArquivo))
                {
                    System.IO.File.Delete(caminhoArquivo);
                }
            }

            _db.Fases.Remove(fase);

            await _db.SaveChangesAsync();

            return Ok(new
            {
                mensagem = "Fase, perguntas e alternativas excluídas com sucesso!"
            });
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