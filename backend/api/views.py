import secrets
from collections import Counter
from datetime import timedelta

from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Count
from django.utils import timezone
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Usuario, Analise, Empresa, Assinatura, EmpresaToken
from .serializers import (
    RegistroSerializer, LoginSerializer, UsuarioSerializer, AnaliseSerializer,
    EmpresaRegistroSerializer, EmpresaLoginSerializer, EmpresaSerializer,
)


# ═══ B2C ═════════════════════════════════════════════════════════════

@api_view(["POST"])
@permission_classes([AllowAny])
def registro(request):
    s = RegistroSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    user = s.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "user": UsuarioSerializer(user).data,
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    s = LoginSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    user = s.validated_data["user"]
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "user": UsuarioSerializer(user).data,
    })


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response({"detail": "sessão encerrada."})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UsuarioSerializer(request.user).data)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def registrar_analise(request):
    data = dict(request.data)
    a = Analise.objects.create(
        usuario=request.user,
        respostas=data.get("respostas", {}),
        recomendacoes=data.get("recomendacoes", []),
        quick_mood=data.get("quick_mood") or None,
        criado_em=timezone.now(),
    )
    return Response(AnaliseSerializer(a).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def minhas_analises(request):
    qs = request.user.analises.all()[:20]
    return Response(AnaliseSerializer(qs, many=True).data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def meu_perfil(request):
    """Agregações do usuário para o card 'Seu perfil'."""
    analises = request.user.analises.all()
    total = analises.count()

    counter = Counter()
    for a in analises:
        q1 = (a.respostas or {}).get("q1")
        if q1:
            counter[q1] += 1

    LABELS = {"rir": "Levinho", "sentir": "Sentir algo", "acao": "Ação", "pensar": "Curioso"}
    distribuicao = []
    for chave in ["sentir", "rir", "pensar", "acao"]:
        n = counter.get(chave, 0)
        pct = round((n / total) * 100) if total else 0
        distribuicao.append({"key": chave, "label": LABELS[chave], "valor": pct, "n": n})

    dominante = max(distribuicao, key=lambda d: d["valor"]) if total else None

    return Response({
        "total": total,
        "humor_dominante": dominante,
        "distribuicao": distribuicao,
    })


# ═══ B2B ═════════════════════════════════════════════════════════════

def _empresa_do_token(request):
    """Extrai empresa a partir do cabeçalho 'X-Empresa-Token'."""
    key = request.headers.get("X-Empresa-Token", "").strip()
    if not key:
        return None
    try:
        return EmpresaToken.objects.select_related("empresa").get(key=key).empresa
    except EmpresaToken.DoesNotExist:
        return None


@api_view(["POST"])
@permission_classes([AllowAny])
def empresa_registro(request):
    s = EmpresaRegistroSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    d = s.validated_data
    empresa = Empresa.objects.create(
        nome=d["nome"],
        email_corp=d["email_corp"],
        password_hash=make_password(d["password"]),
        cnpj=d.get("cnpj") or None,
    )
    Assinatura.objects.create(empresa=empresa, plano=d.get("plano", "painel"), ativo=False)
    token = EmpresaToken.objects.create(empresa=empresa, key=secrets.token_hex(24))
    return Response({
        "token": token.key,
        "empresa": EmpresaSerializer(empresa).data,
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def empresa_login(request):
    s = EmpresaLoginSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    d = s.validated_data
    try:
        empresa = Empresa.objects.get(email_corp=d["email_corp"])
    except Empresa.DoesNotExist:
        return Response({"detail": "credenciais inválidas."}, status=401)
    if not check_password(d["password"], empresa.password_hash):
        return Response({"detail": "credenciais inválidas."}, status=401)
    token, _ = EmpresaToken.objects.get_or_create(
        empresa=empresa, defaults={"key": secrets.token_hex(24)}
    )
    return Response({
        "token": token.key,
        "empresa": EmpresaSerializer(empresa).data,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def empresa_logout(request):
    empresa = _empresa_do_token(request)
    if empresa:
        EmpresaToken.objects.filter(empresa=empresa).delete()
    return Response({"detail": "sessão encerrada."})


@api_view(["GET"])
@permission_classes([AllowAny])
def empresa_me(request):
    empresa = _empresa_do_token(request)
    if not empresa:
        return Response({"detail": "não autenticado."}, status=401)
    return Response(EmpresaSerializer(empresa).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def dashboard_dados(request):
    """
    Agregações do dashboard.
    - Se empresa autenticada e assinatura ativa: dados completos.
    - Caso contrário: modo demonstração (mesmos dados hoje).
    """
    empresa = _empresa_do_token(request)
    tem_acesso = bool(empresa and empresa.assinaturas.filter(ativo=True).exists())

    analises = Analise.objects.all()
    total = analises.count()
    usuarios_unicos = Usuario.objects.filter(analises__isnull=False).distinct().count()

    # Distribuição Q1 (estado emocional)
    counter_q1 = Counter()
    counter_q2 = Counter()
    counter_q4 = Counter()
    horas = [0] * 24
    for a in analises:
        r = a.respostas or {}
        if r.get("q1"): counter_q1[r["q1"]] += 1
        if r.get("q2"): counter_q2[r["q2"]] += 1
        if r.get("q4"): counter_q4[r["q4"]] += 1
        horas[a.criado_em.hour] += 1

    def pct(counter, keys, labels):
        soma = sum(counter[k] for k in keys) or 1
        return [{"key": k, "label": labels[k], "valor": round(counter[k] / soma * 100)}
                for k in keys]

    LABELS_Q1 = {"sentir":"Sentir algo","rir":"Levinho","pensar":"Curioso","acao":"Ação"}
    LABELS_Q2 = {"sozinho":"Sozinho","amigos":"Com amigos","especial":"Alguém especial","familia":"Família"}
    LABELS_Q4 = {"aliviado":"Aliviado","pensativo":"Pensativo","inspirado":"Inspirado","animado":"Animado"}

    # Top filmes
    top = Counter()
    posters = {}
    for a in analises:
        for f in a.recomendacoes or []:
            titulo = f.get("titulo") or f.get("nome")
            if not titulo:
                continue
            top[titulo] += 1
            if f.get("poster") and titulo not in posters:
                posters[titulo] = f["poster"]
    top_filmes = [
        {"titulo": t, "frequencia": n, "poster": posters.get(t)}
        for t, n in top.most_common(8)
    ]

    # KPIs auxiliares
    agora = timezone.now()
    ha_30_dias = agora - timedelta(days=30)
    analises_30d = analises.filter(criado_em__gte=ha_30_dias).count()

    return Response({
        "acesso_completo": tem_acesso,
        "empresa": EmpresaSerializer(empresa).data if empresa else None,
        "kpis": {
            "total_analises": total,
            "usuarios_unicos": usuarios_unicos,
            "analises_30d": analises_30d,
        },
        "estado_emocional": pct(counter_q1, ["sentir","rir","pensar","acao"], LABELS_Q1),
        "destino_emocional": pct(counter_q4, ["aliviado","pensativo","inspirado","animado"], LABELS_Q4),
        "companhia": pct(counter_q2, ["sozinho","amigos","especial","familia"], LABELS_Q2),
        "horarios": horas,
        "top_filmes": top_filmes,
    })
