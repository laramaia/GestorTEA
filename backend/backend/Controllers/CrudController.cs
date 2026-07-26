using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class CrudController<TEntity> : ControllerBase where TEntity : class
{
    protected readonly AppDbContext _db;

    public CrudController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("listar")]
    public virtual async Task<IActionResult> ObterTodos()
    {
        var lista = await _db.Set<TEntity>().AsNoTracking().ToListAsync();
        return Ok(lista);
    }

    [HttpGet("{id:int}")]
    public virtual async Task<IActionResult> ObterPorId(int id)
    {
        var entidade = await _db.Set<TEntity>().FindAsync(id);

        if (entidade == null)
            return NotFound(new { mensagem = $"{typeof(TEntity).Name} não encontrado(a)." });

        return Ok(entidade);
    }

    [HttpPost("inserir")]
    public virtual async Task<IActionResult> Criar([FromBody] TEntity entidade)
    {
        _db.Set<TEntity>().Add(entidade);
        await _db.SaveChangesAsync();

        var idValor = ObterValorChavePrimaria(entidade);

        return CreatedAtAction(nameof(ObterPorId), new { id = idValor }, entidade);
    }

    [HttpPut("atualizar/{id:int}")]
    public virtual async Task<IActionResult> Atualizar(int id, [FromBody] TEntity entidade)
    {
        var idEntidade = ObterValorChavePrimaria(entidade);

        if (idEntidade != null && Convert.ToInt32(idEntidade) != 0 && Convert.ToInt32(idEntidade) != id)
        {
            return BadRequest(new { mensagem = "O ID da URL difere do ID informado no objeto." });
        }

        var existe = await _db.Set<TEntity>().FindAsync(id);
        if (existe == null)
            return NotFound(new { mensagem = $"{typeof(TEntity).Name} não encontrado(a)." });

        _db.Entry(existe).CurrentValues.SetValues(entidade);
        await _db.SaveChangesAsync();

        return Ok(existe);
    }

    [HttpDelete("deletar/{id:int}")]
    public virtual async Task<IActionResult> Deletar(int id)
    {
        var entidade = await _db.Set<TEntity>().FindAsync(id);

        if (entidade == null)
            return NotFound(new { mensagem = $"{typeof(TEntity).Name} não encontrado(a)." });

        _db.Set<TEntity>().Remove(entidade);
        await _db.SaveChangesAsync();

        return Ok(new { mensagem = $"{typeof(TEntity).Name} removido(a) com sucesso." });
    }

    private object? ObterValorChavePrimaria(TEntity entidade)
    {
        var keyName = _db.Model.FindEntityType(typeof(TEntity))?
            .FindPrimaryKey()?
            .Properties.Select(x => x.Name).FirstOrDefault();

        if (string.IsNullOrEmpty(keyName)) return null;

        return _db.Entry(entidade).Property(keyName).CurrentValue;
    }
}