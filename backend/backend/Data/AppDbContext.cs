using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext: DbContext 
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Terapeuta> Terapeutas { get; set; }
    public DbSet<Paciente> Pacientes { get; set; }
    public DbSet<Fase> Fases { get; set; }
    public DbSet<Opcao> Opcoes { get; set; }
    public DbSet<ProgressoJogo> ProgressoJogos { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>()
            .HasDiscriminator<string>("Discriminator")
            .HasValue<Terapeuta>("Terapeuta")
            .HasValue<Admin>("Admin");
    }
}