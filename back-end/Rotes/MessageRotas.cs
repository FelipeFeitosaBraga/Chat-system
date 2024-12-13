using back_end.Repository;

namespace back_end.Rotes
{
    public static class MessageRotas
    {
        public static void AddMessageUser(this WebApplication app)
        {
            var rotasMessages = app.MapGroup("messages");

            rotasMessages.MapGet("all", () => MessageRepository.Mensagens.Where(m => m.Para == "todos"));
            rotasMessages.MapGet("", (string de, string para) => MessageRepository.Mensagens.Where(m => (m.De == de && m.Para == para) || (m.Para == de && m.De == para)));
        }
    }
}
