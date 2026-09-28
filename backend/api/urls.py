from django.urls import path

from . import views

urlpatterns = [
    # B2C
    path("register",      views.registro),
    path("login",         views.login),
    path("logout",        views.logout),
    path("me",            views.me),
    path("analises",      views.registrar_analise),
    path("analises/me",   views.minhas_analises),
    path("perfil/me",     views.meu_perfil),

    # B2B
    path("empresa/register", views.empresa_registro),
    path("empresa/login",    views.empresa_login),
    path("empresa/logout",   views.empresa_logout),
    path("empresa/me",       views.empresa_me),
    path("dashboard",        views.dashboard_dados),
]
