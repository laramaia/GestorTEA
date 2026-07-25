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
            if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
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
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (usuario == null || !_authService.VerificarSenha(dto.Senha, usuario.SenhaHash))
            {
                return Unauthorized(new { mensagem = "E-mail ou senha incorretos." });
            }

            if (!usuario.Ativo)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { mensagem = "Esta conta de usuário está inativa." });
            }

            var token = _authService.GerarTokenJwt(usuario);

            return Ok(new
            {
                token = token,
                usuario = new
                {
                    id = usuario.UsuarioId,
                    nome = usuario.NomeCompleto,
                    email = usuario.Email,
                    perfil = usuario.Perfil.ToString()
                }
            });
        }
    }
}