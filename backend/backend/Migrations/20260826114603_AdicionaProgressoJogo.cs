using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaProgressoJogo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Progressos_Fases_FaseId",
                table: "Progressos");

            migrationBuilder.DropForeignKey(
                name: "FK_Progressos_Pacientes_PacienteId",
                table: "Progressos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Progressos",
                table: "Progressos");

            migrationBuilder.RenameTable(
                name: "Progressos",
                newName: "ProgressoJogos");

            migrationBuilder.RenameIndex(
                name: "IX_Progressos_PacienteId",
                table: "ProgressoJogos",
                newName: "IX_ProgressoJogos_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_Progressos_FaseId",
                table: "ProgressoJogos",
                newName: "IX_ProgressoJogos_FaseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProgressoJogos",
                table: "ProgressoJogos",
                column: "ProgressoJogoId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressoJogos_Fases_FaseId",
                table: "ProgressoJogos",
                column: "FaseId",
                principalTable: "Fases",
                principalColumn: "FaseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressoJogos_Pacientes_PacienteId",
                table: "ProgressoJogos",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "PacienteId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressoJogos_Fases_FaseId",
                table: "ProgressoJogos");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressoJogos_Pacientes_PacienteId",
                table: "ProgressoJogos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProgressoJogos",
                table: "ProgressoJogos");

            migrationBuilder.RenameTable(
                name: "ProgressoJogos",
                newName: "Progressos");

            migrationBuilder.RenameIndex(
                name: "IX_ProgressoJogos_PacienteId",
                table: "Progressos",
                newName: "IX_Progressos_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_ProgressoJogos_FaseId",
                table: "Progressos",
                newName: "IX_Progressos_FaseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Progressos",
                table: "Progressos",
                column: "ProgressoJogoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Progressos_Fases_FaseId",
                table: "Progressos",
                column: "FaseId",
                principalTable: "Fases",
                principalColumn: "FaseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Progressos_Pacientes_PacienteId",
                table: "Progressos",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "PacienteId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
