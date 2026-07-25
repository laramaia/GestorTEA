using backend.Data;
using backend.DTOs;
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
    public async Task<IActionResult> CriarPaciente([FromForm] PacienteCadastroDto dto)
    {
        string? caminhoFotoRelativo = null;

        // Acessa via dto.Foto
        if (dto.Foto != null && dto.Foto.Length > 0)
        {
            var pastaUploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(pastaUploads))
            {
                Directory.CreateDirectory(pastaUploads);
            }

            var nomeArquivo = $"{Guid.NewGuid()}{Path.GetExtension(dto.Foto.FileName)}";
            var caminhoAbsoluto = Path.Combine(pastaUploads, nomeArquivo);

            using (var stream = new FileStream(caminhoAbsoluto, FileMode.Create))
            {
                await dto.Foto.CopyToAsync(stream);
            }

            caminhoFotoRelativo = $"/uploads/{nomeArquivo}";
        }
    
        var novoPaciente = new Paciente
        {
            NomeCompleto = dto.NomeCompleto,
            Sexo = dto.Sexo,
            Cpf = dto.Cpf,
            Endereco = dto.Endereco,
            FotoPerfil = caminhoFotoRelativo,
            DataNascimento = dto.DataNascimento,
            CriadoEm = DateTime.UtcNow,
            AtualizadoEm = DateTime.UtcNow
        };

        _db.Pacientes.Add(novoPaciente);
        await _db.SaveChangesAsync();

        return Ok(novoPaciente);
    }

    [HttpGet("listar")]
    public IActionResult ListarPacientes()
    {
        var lista = _db.Pacientes
            .OrderByDescending(p => p.CriadoEm)
            .ToList();

        return Ok(lista);
    }
    
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var paciente = await _db.Pacientes.FindAsync(id);

        if (paciente == null)
        {
            return NotFound(new { mensagem = "Paciente não encontrado." });
        }

        return Ok(paciente);
    }
    
    [HttpDelete("deletar/{id:int}")]
    public async Task<IActionResult> DeletarPaciente(int id)
    {
        var paciente = await _db.Pacientes.FindAsync(id);

        if (paciente == null)
        {
            return NotFound(new { mensagem = "Paciente não encontrado." });
        }

        // Se o paciente tiver foto cadastrada, remove o arquivo físico da pasta wwwroot
        if (!string.IsNullOrEmpty(paciente.FotoPerfil))
        {
            var caminhoAbsoluto = Path.Combine(
                Directory.GetCurrentDirectory(), 
                "wwwroot", 
                paciente.FotoPerfil.TrimStart('/')
            );

            if (System.IO.File.Exists(caminhoAbsoluto))
            {
                System.IO.File.Delete(caminhoAbsoluto);
            }
        }

        _db.Pacientes.Remove(paciente);
        await _db.SaveChangesAsync();

        return Ok(new { mensagem = "Paciente excluído com sucesso!" });
    }
}