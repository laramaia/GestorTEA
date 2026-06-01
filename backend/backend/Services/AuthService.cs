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

        // O construtor recebe o IConfiguration para conseguirmos ler o appsettings.json
        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Transforma a senha em texto limpo em um Hash seguro usando BCrypt.
        /// </summary>
        public string CriarSenhaHash(string senha)
        {
            return BCrypt.Net.BCrypt.HashPassword(senha);
        }

        /// <summary>
        /// Compara a senha digitada no login com o Hash salvo no banco de dados.
        /// </summary>
        public bool VerificarSenha(string senhaDigitada, string senhaHashBanco)
        {
            return BCrypt.Net.BCrypt.Verify(senhaDigitada, senhaHashBanco);
        }

        /// <summary>
        /// Gera o Token JWT contendo as informações (Claims) do Terapeuta.
        /// </summary>
        public string GerarTokenJwt(Terapeuta terapeuta)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var secretKey = _configuration["JwtSettings:SecretKey"] ?? throw new ArgumentNullException("Chave JWT não configurada no appsettings.json.");
            var key = Encoding.ASCII.GetBytes(secretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, terapeuta.TerapeutaId.ToString()),
                new Claim(ClaimTypes.Name, terapeuta.NomeCompleto),
                new Claim(ClaimTypes.Email, terapeuta.Email ?? string.Empty),
                new Claim("Especializacao", terapeuta.Especializacao) // Claim personalizada
            };

            // Tempo de expiração lido do appsettings (ou 2 horas por padrão se não achar)
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

            // Retorna token
            return tokenHandler.WriteToken(token);
        }
    }
}