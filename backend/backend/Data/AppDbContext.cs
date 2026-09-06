using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    public DbSet<Usuario> Usuarios { get; set; }

    public DbSet<Admin> Admins { get; set; }

    public DbSet<Terapeuta> Terapeutas { get; set; }

    public DbSet<Paciente> Pacientes { get; set; }

    public DbSet<Fase> Fases { get; set; }

    public DbSet<Pergunta> Perguntas { get; set; }

    public DbSet<Opcao> Opcoes { get; set; }

    public DbSet<ProgressoJogo> ProgressoJogos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>()
            .HasDiscriminator<string>("Discriminator")
            .HasValue<Terapeuta>("Terapeuta")
            .HasValue<Admin>("Admin");

        modelBuilder.Entity<Fase>()
            .HasMany(f => f.Perguntas)
            .WithOne(p => p.Fase)
            .HasForeignKey(p => p.FaseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Pergunta>()
            .HasMany(p => p.Opcoes)
            .WithOne(o => o.Pergunta)
            .HasForeignKey(o => o.PerguntaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}