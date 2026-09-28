from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    """Usuário B2C do app (assiste filmes)."""
    nickname = models.CharField(max_length=60, blank=True)
    nascimento = models.DateField(null=True, blank=True)
    aceite_lgpd = models.BooleanField(default=False)
    aceite_lgpd_data = models.DateTimeField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nickname or self.username


class Analise(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="analises")
    respostas = models.JSONField()             # {"q1":"sentir","q2":"sozinho",...}
    recomendacoes = models.JSONField()         # [{"id":1,"titulo":"..."}, ...]
    quick_mood = models.CharField(max_length=20, blank=True, null=True)
    marcado_visto = models.BooleanField(default=False)
    criado_em = models.DateTimeField()         # sem auto_now — permite seed histórico

    class Meta:
        ordering = ["-criado_em"]

    def __str__(self):
        return f"{self.usuario} · {self.criado_em:%d/%m %H:%M}"


class Empresa(models.Model):
    nome = models.CharField(max_length=120)
    email_corp = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=200)  # hash simples via Django utils
    cnpj = models.CharField(max_length=20, blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome


class Assinatura(models.Model):
    PLANO_CHOICES = [
        ("relatorio", "Relatório Psicográfico"),
        ("painel",    "Painel de Inteligência"),
        ("teste",     "Teste de Hipótese"),
    ]
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="assinaturas")
    plano = models.CharField(max_length=20, choices=PLANO_CHOICES, default="painel")
    ativo = models.BooleanField(default=True)   # liberado temporariamente: novos cadastros já ativos
    mes_atual = models.PositiveIntegerField(default=1)  # nº de meses ativos (mock para o painel)
    inicio = models.DateTimeField(null=True, blank=True)
    fim = models.DateTimeField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]

    def __str__(self):
        status = "ativa" if self.ativo else "pendente"
        return f"{self.empresa.nome} · {self.get_plano_display()} · {status}"


class EmpresaToken(models.Model):
    """Token simples para empresa (paralelo ao Token do DRF que é pra User)."""
    empresa = models.OneToOneField(Empresa, on_delete=models.CASCADE, related_name="token")
    key = models.CharField(max_length=64, unique=True, db_index=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"token · {self.empresa.nome}"
