from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import serializers

from .models import Usuario, Analise, Empresa, Assinatura


# ─── B2C ─────────────────────────────────────────────────────────

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)
    aceite_lgpd = serializers.BooleanField(write_only=True)

    class Meta:
        model = Usuario
        fields = ("username", "email", "nickname", "nascimento", "password", "aceite_lgpd")
        extra_kwargs = {
            "email": {"required": False, "allow_blank": True},
            "username": {"required": False, "allow_blank": True},
            "nascimento": {"required": False, "allow_null": True},
        }

    def validate_aceite_lgpd(self, value):
        if not value:
            raise serializers.ValidationError("É preciso aceitar os termos de uso de dados.")
        return value

    def create(self, validated):
        pwd = validated.pop("password")
        validated.pop("aceite_lgpd")
        # username = email se não vier explícito
        if not validated.get("username"):
            validated["username"] = validated.get("email") or validated.get("nickname")
        user = Usuario(**validated)
        user.set_password(pwd)
        user.aceite_lgpd = True
        user.aceite_lgpd_data = timezone.now()
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    identificador = serializers.CharField()  # aceita email ou username
    password = serializers.CharField()

    def validate(self, data):
        ident = data["identificador"]
        # Se parece email, procura por email primeiro
        try:
            user_obj = Usuario.objects.get(email=ident)
            username = user_obj.username
        except Usuario.DoesNotExist:
            username = ident

        user = authenticate(username=username, password=data["password"])
        if not user:
            raise serializers.ValidationError("Credenciais inválidas.")
        data["user"] = user
        return data


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ("id", "username", "email", "nickname", "nascimento",
                  "aceite_lgpd", "aceite_lgpd_data", "criado_em")
        read_only_fields = fields


class AnaliseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analise
        fields = ("id", "respostas", "recomendacoes", "quick_mood",
                  "marcado_visto", "criado_em")
        read_only_fields = ("id", "criado_em")


# ─── B2B ─────────────────────────────────────────────────────────

class EmpresaRegistroSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=120)
    email_corp = serializers.EmailField()
    password = serializers.CharField(min_length=4, write_only=True)
    cnpj = serializers.CharField(max_length=20, required=False, allow_blank=True)
    plano = serializers.ChoiceField(choices=Assinatura.PLANO_CHOICES, default="painel")

    def validate_email_corp(self, value):
        if Empresa.objects.filter(email_corp=value).exists():
            raise serializers.ValidationError("Email corporativo já cadastrado.")
        return value


class EmpresaLoginSerializer(serializers.Serializer):
    email_corp = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class EmpresaSerializer(serializers.ModelSerializer):
    assinatura_ativa = serializers.SerializerMethodField()
    plano_ativo = serializers.SerializerMethodField()
    mes_atual = serializers.SerializerMethodField()
    inicio_assinatura = serializers.SerializerMethodField()

    class Meta:
        model = Empresa
        fields = ("id", "nome", "email_corp", "cnpj", "criado_em",
                  "assinatura_ativa", "plano_ativo", "mes_atual", "inicio_assinatura")

    def _assinatura_ativa(self, obj):
        return obj.assinaturas.filter(ativo=True).first()

    def get_assinatura_ativa(self, obj):
        return self._assinatura_ativa(obj) is not None

    def get_plano_ativo(self, obj):
        a = self._assinatura_ativa(obj)
        return a.get_plano_display() if a else None

    def get_mes_atual(self, obj):
        a = self._assinatura_ativa(obj)
        return a.mes_atual if a else 0

    def get_inicio_assinatura(self, obj):
        a = self._assinatura_ativa(obj)
        return a.inicio.isoformat() if a and a.inicio else None
