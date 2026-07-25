namespace backend.Models;

public class Admin : Usuario
{
    public Admin()
    {
        Perfil = PerfilEnum.Admin;
    }
}