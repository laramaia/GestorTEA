using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AtualizaFase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Enunciado",
                table: "Fases",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Opcoes_FaseId",
                table: "Opcoes",
                column: "FaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Opcoes_Fases_FaseId",
                table: "Opcoes",
                column: "FaseId",
                principalTable: "Fases",
                principalColumn: "FaseId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Opcoes_Fases_FaseId",
                table: "Opcoes");

            migrationBuilder.DropIndex(
                name: "IX_Opcoes_FaseId",
                table: "Opcoes");

            migrationBuilder.DropColumn(
                name: "Enunciado",
                table: "Fases");
        }
    }
}
