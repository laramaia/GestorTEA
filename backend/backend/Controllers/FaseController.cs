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
    public IActionResult CriarFase([FromBody] Fase fase)
    {
        _db.Fases.Add(fase);
        _db.SaveChanges();

        return Created(string.Empty,
        new
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
}