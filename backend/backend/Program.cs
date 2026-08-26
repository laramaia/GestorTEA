using backend.Data;
using backend.Services;
using backend.Models; 
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<AuthService>();

var chaveSecreta = builder.Configuration["JwtSettings:SecretKey"] ?? throw new ArgumentNullException("Chave JWT não configurada.");
var key = Encoding.ASCII.GetBytes(chaveSecreta);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JwtSettings:Emissor"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JwtSettings:Audiencia"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero 
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000", 
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://127.0.0.1/51264",
                    "https://desenvolve-tea.vercel.app")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var authService = services.GetRequiredService<AuthService>();
        context.Database.Migrate();
        DbInitializer.SeedAdmin(context, authService);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocorreu um erro ao popular o banco de dados.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
provider.Mappings[".avif"] = "image/avif";
provider.Mappings[".webp"] = "image/webp";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();

public static class DbInitializer
{
    public static void SeedAdmin(AppDbContext context, AuthService authService)
    {
        if (!context.Usuarios.Any(u => u.Email == "admin@gmail.com"))
        {
            var admin = new Admin
            {
                NomeCompleto = "Administrador",
                Email = "admin@gmail.com",
                SenhaHash = authService.CriarSenhaHash("Admin123"),
                Ativo = true,
            };

            context.Admins.Add(admin);
            context.SaveChanges();
        }
    }
}