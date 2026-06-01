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
    public IActionResult IniciarFase(int pacienteId, int faseId)
    {
        var paciente = _db.Pacientes.Find(pacienteId);
        var fase = _db.Fases.Include(f => f.Opcoes).FirstOrDefault(f => f.FaseId == faseId);

        if (paciente == null || fase == null) return NotFound("Paciente ou Fase não encontrada.");

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
    public IActionResult FinalizarFase([FromBody] ProgressoJogo resultado)
    {
        // Valida existencia de paciente e fase
        var existePaciente = _db.Pacientes.Any(p => p.PacienteId == resultado.PacienteId);
        var existeFase = _db.Fases.Any(f => f.FaseId == resultado.FaseId);

        if (!existePaciente || !existeFase)
        {
            return BadRequest("Dados inválidos: Paciente ou Fase não encontrados.");
        }

        var progressoExistente = _db.Progressos
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
            _db.Progressos.Add(resultado);
        }

        _db.SaveChanges();

        return Ok(new { mensagem = "Progresso salvo!" });
    }
}