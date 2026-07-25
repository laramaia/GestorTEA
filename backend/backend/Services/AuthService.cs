using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;

        // Leitura do appsettings.json
        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CriarSenhaHash(string senha)
        {
            return BCrypt.Net.BCrypt.HashPassword(senha);
        }

        public bool VerificarSenha(string senhaDigitada, string senhaHashBanco)
        {
            return BCrypt.Net.BCrypt.Verify(senhaDigitada, senhaHashBanco);
        }

        public string GerarTokenJwt(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var secretKey = _configuration["JwtSettings:SecretKey"] 
                            ?? throw new ArgumentNullException(null, "Chave JWT não configurada no appsettings.json.");
            var key = Encoding.ASCII.GetBytes(secretKey);
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.UsuarioId.ToString()),
                new Claim(ClaimTypes.Name, usuario.NomeCompleto),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Perfil.ToString()), 
                // new Claim("ClinicaId", usuario.ClinicaId.ToString())   
            };
            
            if (usuario is Terapeuta terapeuta)
            {
                claims.Add(new Claim("Especializacao", terapeuta.Especializacao));
                claims.Add(new Claim("NumeroLicenca", terapeuta.NumeroLicenca));
            }

            var expiracaoHoras = double.Parse(_configuration["JwtSettings:ExpiracaoEmHoras"] ?? "2");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(expiracaoHoras),
                Issuer = _configuration["JwtSettings:Emissor"],
                Audience = _configuration["JwtSettings:Audiencia"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}