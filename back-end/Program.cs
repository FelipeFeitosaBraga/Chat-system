using back_end.Hubs;
using back_end.Rotes;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Substitua pelo domínio do frontend
              .AllowAnyHeader()                    // Permite qualquer cabeçalho
              .AllowAnyMethod()                    // Permite qualquer método HTTP (GET, POST, etc.)
              .AllowCredentials();                 // Permite cookies e credenciais
    });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();
app.MapHub<ChatHub>("/chatHub");

app.AddRotasUser();
app.AddMessageUser();

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

app.Run();
