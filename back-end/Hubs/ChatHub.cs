using back_end.Repository;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace back_end.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            var user = Context?.GetHttpContext()?.Request.Query["user"];
            Log.Information("User {@user} connected. ConnectionId: {@ConnectionId}, Clients: {@Clients}", user, Context?.ConnectionId, Clients.All);
            UserRepository.Users.Add(new()
            {
                Id = Context?.ConnectionId ?? throw new Exception("ConnectionId não definido"),
                Nome = user.ToString() ?? throw new Exception("User não definido")
            });
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (!string.IsNullOrEmpty(Context?.ConnectionId))
                UserRepository.Users = UserRepository.Users
                    .Where(u => u.Id != Context.ConnectionId)
                    .ToList();
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string user, string message)
        {
            // Envia a mensagem para todos os clientes conectados
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendMessageTo(string de, string para, string mensagem)
        {
            var userIdPara = UserRepository.Users.Find(u => u.Nome == para);
            var userIdDe = UserRepository.Users.Find(u => u.Nome == de);
            await Clients.User(userIdPara?.Id ?? throw new Exception("User Para não encontrado"))
                .SendAsync("ReceiveMessage", userIdDe?.Id ?? throw new Exception("User De não encontrado"), mensagem);
        }
    }
}
