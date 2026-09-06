using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JogoController : ControllerBase
{
    private readonly AppDbContext _db;

    public JogoController(AppDbContext db) => _db = db;

    [HttpGet("iniciar/{pacienteId}/{faseId}")]
    public async Task<IActionResult> IniciarFase(
        int pacienteId,
        int faseId
    )
    {
        var paciente = await _db.Pacientes
            .AsNoTracking()
            .FirstOrDefaultAsync(
                p => p.PacienteId == pacienteId
            );

        if (paciente == null)
        {
            return NotFound(new
            {
                mensagem = "Paciente não encontrado."
            });
        }

        var fase = await _db.Fases
            .Include(f => f.Perguntas)
                .ThenInclude(p => p.Opcoes)
            .AsNoTracking()
            .FirstOrDefaultAsync(
                f => f.FaseId == faseId
            );

        if (fase == null)
        {
            return NotFound(new
            {
                mensagem = "Fase não encontrada."
            });
        }

        var perguntas = fase.Perguntas
            .OrderBy(p => p.Ordem)
            .ToList();

        if (perguntas.Count != 3)
        {
            return BadRequest(new
            {
                mensagem = "Esta fase deve possuir exatamente 3 perguntas."
            });
        }

        return Ok(new
        {
            pacienteId = paciente.PacienteId,

            pacienteNome = paciente.NomeCompleto,

            faseId = fase.FaseId,

            faseNome = fase.Nome,

            ilustracao = fase.Ilustracao,

            totalEstrelas = fase.TotalEstrelas,

            estrelasParaAvancar = fase.EstrelasParaAvancar,

            perguntas = perguntas.Select(pergunta => new
            {
                perguntaId = pergunta.PerguntaId,

                ordem = pergunta.Ordem,

                enunciado = pergunta.Enunciado,

                opcoes = pergunta.Opcoes.Select(opcao => new
                {
                    opcaoId = opcao.OpcaoId,

                    texto = opcao.Texto,

                    ehCorreta = opcao.EhCorreta
                })
            })
        });
    }

    [HttpPost("finalizar")]
    public async Task<IActionResult> FinalizarFase(
        [FromBody] ProgressoJogo resultado
    )
    {
        var existePaciente = await _db.Pacientes
            .AnyAsync(
                p => p.PacienteId == resultado.PacienteId
            );

        var fase = await _db.Fases
            .AsNoTracking()
            .FirstOrDefaultAsync(
                f => f.FaseId == resultado.FaseId
            );

        if (!existePaciente || fase == null)
        {
            return BadRequest(new
            {
                mensagem = "Dados inválidos: paciente ou fase não encontrados."
            });
        }

        if (resultado.EstrelasGanhas < 0)
        {
            resultado.EstrelasGanhas = 0;
        }

        if (resultado.EstrelasGanhas > fase.TotalEstrelas)
        {
            resultado.EstrelasGanhas = fase.TotalEstrelas;
        }

        var progressoExistente = await _db.ProgressoJogos
            .FirstOrDefaultAsync(p =>
                p.PacienteId == resultado.PacienteId &&
                p.FaseId == resultado.FaseId
            );

        if (progressoExistente != null)
        {
            if (
                resultado.EstrelasGanhas >
                progressoExistente.EstrelasGanhas
            )
            {
                progressoExistente.EstrelasGanhas =
                    resultado.EstrelasGanhas;

                progressoExistente.DataConclusao =
                    DateTime.UtcNow;
            }
        }
        else
        {
            resultado.DataConclusao =
                DateTime.UtcNow;

            _db.ProgressoJogos.Add(resultado);
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            mensagem = "Progresso salvo!"
        });
    }

    [HttpGet("progresso/paciente/{pacienteId:int}")]
    public async Task<IActionResult> ObterProgressoPorPaciente(
        int pacienteId
    )
    {
        var pacienteExiste = await _db.Pacientes
            .AnyAsync(p => p.PacienteId == pacienteId);

        if (!pacienteExiste)
        {
            return NotFound(new
            {
                mensagem = "Paciente não encontrado."
            });
        }

        var progresso = await _db.ProgressoJogos
            .AsNoTracking()
            .Where(
                p => p.PacienteId == pacienteId
            )
            .OrderBy(p => p.FaseId)
            .ToListAsync();

        var totalFasesExistentes =
            await _db.Fases.CountAsync();

        return Ok(new
        {
            TotalFasesJogo = totalFasesExistentes,

            FasesConcluidas = progresso.Count,

            PercentualConcluido =
                totalFasesExistentes > 0
                    ? Math.Round(
                        (double)progresso.Count /
                        totalFasesExistentes *
                        100,
                        2
                    )
                    : 0,

            HistoricoFases = progresso
        });
    }
}