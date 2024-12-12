using back_end.Repository;

namespace back_end.Rotes
{
    public static class UserRotas
    {
        public static void AddRotasUser(this WebApplication app)
        {
            var rotasUsers = app.MapGroup("users");

            rotasUsers.MapGet("", () => UserRepository.Users);
        }
    }
}
