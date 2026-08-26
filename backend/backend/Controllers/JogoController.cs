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

    // iniciar fase
    [HttpGet("iniciar/{pacienteId}/{faseId}")]
    public async Task<IActionResult> IniciarFase(int pacienteId, int faseId)
    {
        var paciente = _db.Pacientes.Find(pacienteId);
        var fase = _db.Fases
            .Include(f => f.Opcoes)
            .FirstOrDefault(f => f.FaseId == faseId);

        if (paciente == null || fase == null) 
            return NotFound("Paciente ou Fase não encontrada.");

        // retorno para front
        return Ok(new
        {
            PacienteNome = paciente.NomeCompleto,
            FaseNome = fase.Nome,
            Pergunta = fase.Enunciado,
            Alternativas = fase.Opcoes
        });
    }

    [HttpPost("finalizar")]
    public async Task<IActionResult> FinalizarFase([FromBody] ProgressoJogo resultado)
    {
        // Valida existencia de paciente e fase
        var existePaciente = _db.Pacientes.Any(p => p.PacienteId == resultado.PacienteId);
        var existeFase = _db.Fases.Any(f => f.FaseId == resultado.FaseId);

        if (!existePaciente || !existeFase)
        {
            return BadRequest("Dados inválidos: Paciente ou Fase não encontrados.");
        }

        var progressoExistente = _db.ProgressoJogos
        .FirstOrDefault(p => p.PacienteId == resultado.PacienteId && p.FaseId == resultado.FaseId);

        if (progressoExistente != null)
        {
            // Se nova pontuação for melhor, atualiza
            if (resultado.EstrelasGanhas > progressoExistente.EstrelasGanhas)
            {
                progressoExistente.EstrelasGanhas = resultado.EstrelasGanhas;
                progressoExistente.DataConclusao = DateTime.UtcNow;
            }
        }
        else
        {
            // Se não existe, cria um novo resultado
            resultado.DataConclusao = DateTime.UtcNow;
            _db.ProgressoJogos.Add(resultado);
        }

        _db.SaveChanges();

        return Ok(new { mensagem = "Progresso salvo!" });
    }
    
    [HttpGet("progresso/paciente/{pacienteId:int}")]
    public async Task<IActionResult> ObterProgressoPorPaciente(int pacienteId)
    {
        var progresso = await _db.ProgressoJogos
            .AsNoTracking()
            .Where(p => p.PacienteId == pacienteId)
            .OrderBy(p => p.FaseId)
            .ToListAsync();
        
        var totalFasesExistentes = await _db.Fases.CountAsync();
        
        return Ok(new
        {
            TotalFasesJogo = totalFasesExistentes,
            FasesConcluidas = progresso.Count,
            PercentualConcluido = totalFasesExistentes > 0 
                ? Math.Round((double)progresso.Count / totalFasesExistentes * 100, 2) 
                : 0,
            HistoricoFases = progresso
        });
    }
}