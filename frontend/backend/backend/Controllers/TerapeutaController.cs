using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TerapeutaController : ControllerBase
{
    private readonly AppDbContext _db;

    // construtor
    public TerapeutaController(AppDbContext db)
    {
        // inicializa o banco sempre que o controller for chamado
        _db = db;
    }

    [HttpPost("inserir")]
    public IActionResult CriarTerapeuta(Terapeuta terapeuta)
    {
        _db.Terapeutas.Add(terapeuta);
        _db.SaveChanges();

        // retorna status 201
        return Created(string.Empty, 
            new
            {
                mensagem = "Terapeuta criado com sucesso",
                terapeuta = terapeuta
            });
    }

    [HttpGet("listar")]
    public IActionResult ListarTerapeuta()
        {
            var lista = _db.Terapeutas.ToList();

            return Ok(lista);
        }

    [HttpDelete("deletar/{id}")]
    public IActionResult DeletarTerapeuta([FromRoute] int id)
    {
        var terapeuta = _db.Terapeutas.Find(id);

        if (terapeuta == null)
        {
            return NotFound("Terapeuta não encontrado (a).");
        }

        _db.Remove(terapeuta);
        _db.SaveChanges();
        return Ok();
    }
}