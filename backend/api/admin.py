from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils import timezone

from .models import Usuario, Analise, Empresa, Assinatura, EmpresaToken


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ("username", "email", "nickname", "aceite_lgpd", "criado_em")
    list_filter = ("aceite_lgpd", "is_staff")
    search_fields = ("username", "email", "nickname")
    fieldsets = UserAdmin.fieldsets + (
        ("Top Filme", {"fields": ("nickname", "nascimento", "aceite_lgpd", "aceite_lgpd_data")}),
    )


@admin.register(Analise)
class AnaliseAdmin(admin.ModelAdmin):
    list_display = ("usuario", "criado_em", "quick_mood", "marcado_visto")
    list_filter = ("criado_em", "marcado_visto")
    search_fields = ("usuario__username", "usuario__nickname")
    date_hierarchy = "criado_em"


@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ("nome", "email_corp", "cnpj", "criado_em")
    search_fields = ("nome", "email_corp")


@admin.register(Assinatura)
class AssinaturaAdmin(admin.ModelAdmin):
    list_display = ("empresa", "plano", "ativo", "inicio", "fim")
    list_filter = ("ativo", "plano")
    search_fields = ("empresa__nome",)
    actions = ["ativar_assinaturas", "desativar_assinaturas"]

    @admin.action(description="Ativar assinaturas selecionadas")
    def ativar_assinaturas(self, request, queryset):
        agora = timezone.now()
        queryset.update(ativo=True, inicio=agora)
        self.message_user(request, f"{queryset.count()} assinatura(s) ativada(s).")

    @admin.action(description="Desativar assinaturas selecionadas")
    def desativar_assinaturas(self, request, queryset):
        queryset.update(ativo=False, fim=timezone.now())
        self.message_user(request, f"{queryset.count()} assinatura(s) desativada(s).")


@admin.register(EmpresaToken)
class EmpresaTokenAdmin(admin.ModelAdmin):
    list_display = ("empresa", "key", "criado_em")
    readonly_fields = ("key", "criado_em")
