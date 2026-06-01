using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public AuthController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] TerapeutaCadastroDto dto)
        {
            // Valida se as anotações do DTO são válidas
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _context.Terapeutas.AnyAsync(t => t.Email == dto.Email))
            {
                return BadRequest(new { mensagem = "Este e-mail já está cadastrado." });
            }

            // Mapeia DTO para o Model
            var novoTerapeuta = new Terapeuta
            {
                NomeCompleto = dto.NomeCompleto,
                NumeroLicenca = dto.NumeroLicenca,
                Especializacao = dto.Especializacao,
                Email = dto.Email,
                NumeroCelular = dto.NumeroCelular,
                Ativo = true, 
                SenhaHash = _authService.CriarSenhaHash(dto.Senha) 
            };

            _context.Terapeutas.Add(novoTerapeuta);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Cadastro realizado com sucesso!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] TerapeutaLoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var terapeuta = await _context.Terapeutas.FirstOrDefaultAsync(t => t.Email == dto.Email);

            if (terapeuta == null || !_authService.VerificarSenha(dto.Senha, terapeuta.SenhaHash))
            {
                return Unauthorized(new { mensagem = "E-mail ou senha incorretos." });
            }

            if (!terapeuta.Ativo)
            {
                return Forbid("Esta conta de terapeuta está inativa.");
            }

            var token = _authService.GerarTokenJwt(terapeuta);

            return Ok(new
            {
                token = token,
                usuario = new
                {
                    id = terapeuta.TerapeutaId,
                    nome = terapeuta.NomeCompleto,
                    email = terapeuta.Email
                }
            });
        }
    }
}