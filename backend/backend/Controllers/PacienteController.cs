using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class PacienteController : CrudController<Paciente>
{
    public PacienteController(AppDbContext db) : base(db)
    {
    }
    
    [NonAction]
    public override Task<IActionResult> Criar([FromBody] Paciente entidade)
    {
        return base.Criar(entidade);
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> CriarPaciente([FromForm] PacienteCadastroDto dto)
    {
        string? caminhoFoto = null;

        if (dto.Foto != null && dto.Foto.Length > 0)
        {
            var pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(pasta)) Directory.CreateDirectory(pasta);

            var nomeArquivo = $"{Guid.NewGuid()}{Path.GetExtension(dto.Foto.FileName)}";
            var caminhoAbsoluto = Path.Combine(pasta, nomeArquivo);

            await using (var stream = new FileStream(caminhoAbsoluto, FileMode.Create))
            {
                await dto.Foto.CopyToAsync(stream);
            }
            caminhoFoto = $"/uploads/{nomeArquivo}";
        }

        var paciente = new Paciente
        {
            NomeCompleto = dto.NomeCompleto,
            Sexo = dto.Sexo,
            Cpf = dto.Cpf,
            Endereco = dto.Endereco,
            FotoPerfil = caminhoFoto,
            DataNascimento = dto.DataNascimento,
            CriadoEm = DateTime.UtcNow,
            AtualizadoEm = DateTime.UtcNow
        };

        return await base.Criar(paciente);
    }
}