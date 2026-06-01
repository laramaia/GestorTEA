using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;
[ApiController]
[Route("api/[controller]")]
public class PacienteController : Controller
{
    private readonly AppDbContext _db;

    public PacienteController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("inserir")]
    public IActionResult CriarPaciente(Paciente paciente)
    {
        _db.Pacientes.Add(paciente);
        _db.SaveChanges();

        return Created(string.Empty,
            new
            {
                mensagem = "Paciente criado com sucesso",
                paciente = paciente
            });
    }

    [HttpGet("listar")]
    public IActionResult ListarPacientes()
    {
        var lista = _db.Pacientes
            .OrderByDescending(p => p.CriadoEm)
            .ToList();

        return Ok(lista);
    }
}