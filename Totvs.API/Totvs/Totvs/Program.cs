using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Totvs.Data.DbContext;
using Totvs.Service.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configurar Serviços, incluindo Autenticação e Autorização Global
ConfigureServices(builder.Services, builder.Configuration);

void ConfigureServices(IServiceCollection services, ConfigurationManager configuration)
{
    services.AddServices(configuration);
}

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Adicionar serviços de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevServer", policy =>
    {
        policy.WithOrigins("*")  
            .AllowAnyHeader()                 
            .AllowAnyMethod();                 
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowAngularDevServer");  // Adicione essa linha para habilitar o CORS

app.MapControllers();

// Seed initial data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();
