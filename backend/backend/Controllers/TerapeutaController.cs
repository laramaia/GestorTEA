using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class TerapeutaController : CrudController<Terapeuta>
{
    public TerapeutaController(AppDbContext db) : base(db)
    { }

    [NonAction]
    public override Task<IActionResult> Criar([FromBody] Terapeuta entidade)
    {
        return base.Criar(entidade);
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> CriarTerapeuta([FromBody] TerapeutaCadastroDto terapeutaDto)
    {
        var terapeuta = new Terapeuta
        {
            NomeCompleto = terapeutaDto.NomeCompleto,
            Sexo = terapeutaDto.Sexo,
            NumeroLicenca = terapeutaDto.NumeroLicenca,
            Especializacao = terapeutaDto.Especializacao,
            Email = terapeutaDto.Email,
            NumeroCelular = terapeutaDto.NumeroCelular,
            SenhaHash = terapeutaDto.Senha 
        };

        return await base.Criar(terapeuta);
    }
}