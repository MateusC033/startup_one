"""
Popula banco com base inicial de teste — coerente com o período 18/06/2026 → hoje.

15 usuários (colegas/amigos fictícios) e ~86 análises distribuídas no tempo,
respostas variadas mas com padrões plausíveis (pico noturno, quintas emocionais etc).

Uso: python manage.py seed [--limpar]
"""

import random
from datetime import datetime, timedelta, time
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.utils import timezone

from api.models import Usuario, Analise, Empresa, Assinatura


# ── Configuração ─────────────────────────────────────────────────────

USUARIOS = [
    # (nickname, email, nascimento)
    ("carol",    "carol@mail.com",    "1998-03-15"),
    ("pedro",    "pedro@mail.com",    "1996-11-02"),
    ("bia",      "bia@mail.com",      "2001-05-20"),
    ("thiago",   "thiago@mail.com",   "1994-08-10"),
    ("lu",       "lu@mail.com",       "1999-12-01"),
    ("gabi",     "gabi@mail.com",     "2000-07-18"),
    ("rafa",     "rafa@mail.com",     "1997-02-25"),
    ("ju",       "ju@mail.com",       "2002-09-30"),
    ("mari",     "mari@mail.com",     "1995-04-12"),
    ("bruno",    "bruno@mail.com",    "1993-06-07"),
    ("clara",    "clara@mail.com",    "2000-10-22"),
    ("victor",   "victor@mail.com",   "1998-01-14"),
    ("sofia",    "sofia@mail.com",    "1996-05-09"),
    ("felipe",   "felipe@mail.com",   "1999-11-28"),
    ("mateus",   "mateus@mail.com",   "1997-09-05"),
]

# Distribuições realistas (soma 100)
Q1 = [("sentir",32),("rir",28),("pensar",22),("acao",18)]
Q2 = [("sozinho",44),("amigos",26),("especial",18),("familia",12)]
Q3 = [("medio",50),("intenso",30),("relaxar",20)]
Q4 = [("aliviado",31),("pensativo",27),("inspirado",24),("animado",18)]
Q5 = [("real",30),("epico",25),("intimo",23),("surpresa",22)]

# Recomendações plausíveis por perfil emocional dominante (Q1)
POSTER_BASE = "https://image.tmdb.org/t/p/w500"
FILMES = {
    "sentir": [
        {"id": 6,  "titulo": "Parasita",     "poster": f"{POSTER_BASE}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"},
        {"id": 29, "titulo": "La La Land",   "poster": f"{POSTER_BASE}/AvMietG6xuobpSSdmVnKuTjv4bL.jpg"},
        {"id": 43, "titulo": "Cinema Paradiso","poster": f"{POSTER_BASE}/dw7X9YPjjAfIxKHW04V64Bb9TB0.jpg"},
        {"id": 33, "titulo": "Brilho Eterno", "poster": f"{POSTER_BASE}/mPa31QlUnTe2p9GHFibv0UIiiqR.jpg"},
        {"id": 41, "titulo": "Um Sonho de Liberdade","poster": f"{POSTER_BASE}/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg"},
    ],
    "rir": [
        {"id": 8,  "titulo": "Se Beber, Não Case!","poster": f"{POSTER_BASE}/m0tQyMdp3fy5ooUOQkJMd1fQKBJ.jpg"},
        {"id": 18, "titulo": "Shrek",              "poster": f"{POSTER_BASE}/wxeqfC221YMptRRdzxlijAh7q8l.jpg"},
        {"id": 44, "titulo": "Meu Malvado Favorito","poster": f"{POSTER_BASE}/rYZzutMXxvirK9gK01iLo3Blaj3.jpg"},
        {"id": 49, "titulo": "Escola de Rock",     "poster": f"{POSTER_BASE}/yZP86gshxviJ6Shfi3w0Tt4LWrq.jpg"},
        {"id": 25, "titulo": "O Grande Hotel Budapeste","poster": f"{POSTER_BASE}/yabOguSrb8ffUXCkI6t8Rw7xtSh.jpg"},
    ],
    "pensar": [
        {"id": 1,  "titulo": "Interestelar", "poster": f"{POSTER_BASE}/tR1XVa5bxgdh2bRw2u0DzrgkO2l.jpg"},
        {"id": 32, "titulo": "O Show de Truman","poster": f"{POSTER_BASE}/3mEoGWyJCZTSoYyjFD3gFd6hzU4.jpg"},
        {"id": 30, "titulo": "Ela",          "poster": f"{POSTER_BASE}/yyDGhBY8RYXyXYADeFq1BDxpLkl.jpg"},
        {"id": 22, "titulo": "Soul",         "poster": f"{POSTER_BASE}/1G7QNn1sUShae0Rf9k9D99wVFg5.jpg"},
        {"id": 31, "titulo": "Blade Runner 2049","poster": f"{POSTER_BASE}/49pANIZXRAdHUiWjjBv4vxPeqRC.jpg"},
    ],
    "acao": [
        {"id": 5,  "titulo": "Mad Max: Estrada da Fúria","poster": f"{POSTER_BASE}/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg"},
        {"id": 34, "titulo": "Top Gun: Maverick","poster": f"{POSTER_BASE}/kPbuLGVSJHATkW9fX9L3h1wM0Pa.jpg"},
        {"id": 46, "titulo": "Tropa de Elite","poster": f"{POSTER_BASE}/zpuKCrYAXDgX1IErMglua92ofbZ.jpg"},
        {"id": 15, "titulo": "Matrix",        "poster": f"{POSTER_BASE}/lDqMDI3xpbB9UQRyeXfei0MXhqb.jpg"},
        {"id": 11, "titulo": "John Wick",     "poster": f"{POSTER_BASE}/lBcQGk1ygGM2wYmpypFrPp0YohN.jpg"},
    ],
}


def sortear_ponderado(opcoes):
    """Sorteia dentre lista de (chave, peso%) pesado."""
    total = sum(p for _, p in opcoes)
    r = random.random() * total
    acc = 0
    for k, p in opcoes:
        acc += p
        if r <= acc:
            return k
    return opcoes[-1][0]


def horario_plausivel(dia_base):
    """Retorna datetime com hora ponderada (pico noturno 19-23h)."""
    horas_pesos = [
        (0, 3), (1, 2), (2, 1), (3, 1), (4, 1), (5, 1), (6, 2), (7, 3),
        (8, 4), (9, 5), (10, 5), (11, 6), (12, 7), (13, 7), (14, 6), (15, 6),
        (16, 7), (17, 8), (18, 10), (19, 14), (20, 18), (21, 22), (22, 20), (23, 12),
    ]
    hora = sortear_ponderado(horas_pesos)
    minuto = random.randint(0, 59)
    naive = datetime.combine(dia_base, time(hora, minuto))
    return timezone.make_aware(naive)


# ── Comando ──────────────────────────────────────────────────────────

class Command(BaseCommand):
    help = "Popula o banco com usuários e análises iniciais."

    def add_arguments(self, parser):
        parser.add_argument("--limpar", action="store_true",
                            help="Remove usuários/empresas de seed antes de popular.")

    def handle(self, *args, **opts):
        if opts["limpar"]:
            emails = [u[1] for u in USUARIOS]
            Usuario.objects.filter(email__in=emails).delete()
            Empresa.objects.filter(email_corp__endswith="@demo.topfilme.local").delete()
            self.stdout.write(self.style.WARNING("Seed anterior removido."))

        random.seed(42)  # reprodutibilidade

        # ── Usuários ──
        criados = []
        for nick, email, nasc in USUARIOS:
            u, criado_agora = Usuario.objects.get_or_create(
                username=email,
                defaults={
                    "email": email,
                    "nickname": nick,
                    "nascimento": nasc,
                    "aceite_lgpd": True,
                    "aceite_lgpd_data": timezone.now(),
                },
            )
            if criado_agora:
                u.set_password("1234")
                u.save()
            criados.append(u)
        self.stdout.write(self.style.SUCCESS(f"{len(criados)} usuários prontos."))

        # ── Análises distribuídas 18/06/2026 → hoje ──
        inicio = timezone.make_aware(datetime(2026, 6, 18))
        hoje = timezone.now()
        total_dias = (hoje.date() - inicio.date()).days
        # Distribuição: surto inicial + baseline + pico atual
        dias_com_analise = []
        for d in range(total_dias):
            data = inicio + timedelta(days=d)
            # Peso: alto nas 2 primeiras semanas + últimos 10 dias, baixo no meio
            if d < 14:      peso = 4
            elif d > total_dias - 10: peso = 5
            else:           peso = 1
            dias_com_analise.extend([data.date()] * peso)

        random.shuffle(dias_com_analise)
        dias_escolhidos = dias_com_analise[:86]  # ~86 análises

        analises_criadas = 0
        for dia in dias_escolhidos:
            usuario = random.choice(criados)
            q1 = sortear_ponderado(Q1)
            q2 = sortear_ponderado(Q2)
            q3 = sortear_ponderado(Q3)
            q4 = sortear_ponderado(Q4)
            q5 = sortear_ponderado(Q5)
            recs = random.sample(FILMES[q1], 3)
            Analise.objects.create(
                usuario=usuario,
                respostas={"q1": q1, "q2": q2, "q3": q3, "q4": q4, "q5": q5},
                recomendacoes=recs,
                criado_em=horario_plausivel(dia),
            )
            analises_criadas += 1
        self.stdout.write(self.style.SUCCESS(f"{analises_criadas} análises inseridas."))

        # ── Empresas demo ──
        empresas_demo = [
            ("Netflix Brasil",  "demo@netflix.demo.topfilme.local", True),
            ("Globo Filmes",    "demo@globo.demo.topfilme.local",   False),
            ("Prime Video LatAm","demo@prime.demo.topfilme.local",  False),
        ]
        for nome, email, ativa in empresas_demo:
            emp, criada = Empresa.objects.get_or_create(
                email_corp=email,
                defaults={"nome": nome, "password_hash": make_password("empresa1234")},
            )
            if criada:
                Assinatura.objects.create(empresa=emp, plano="painel", ativo=ativa,
                                          inicio=timezone.now() if ativa else None)
        self.stdout.write(self.style.SUCCESS(f"{len(empresas_demo)} empresas demo prontas."))

        self.stdout.write(self.style.SUCCESS(
            f"\nSeed completo: {len(criados)} usuários · {analises_criadas} análises · {len(empresas_demo)} empresas.\n"
            f"Login usuário: qualquer email da lista + senha '1234'.\n"
            f"Login empresa: demo@netflix.demo.topfilme.local + senha 'empresa1234' (assinatura ATIVA).\n"
        ))
