"""
Garante que o superuser definido pelas env vars existe.
Idempotente: pode rodar em todo deploy sem erro.

Env vars esperadas:
- DJANGO_SUPERUSER_USERNAME   (obrigatório para criação)
- DJANGO_SUPERUSER_PASSWORD   (obrigatório para criação)
- DJANGO_SUPERUSER_EMAIL      (opcional)

Comportamento:
- Se as env vars não estiverem definidas, apenas loga e sai (0).
  Útil em dev local onde o superuser já foi criado manualmente.
- Se o usuário com esse username já existe, não faz nada.
- Se não existe, cria com is_staff=True e is_superuser=True.
"""

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Garante que o superuser definido pelas DJANGO_SUPERUSER_* vars existe."

    def handle(self, *args, **opts):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "")

        if not username or not password:
            self.stdout.write(self.style.WARNING(
                "DJANGO_SUPERUSER_USERNAME e DJANGO_SUPERUSER_PASSWORD "
                "não definidas — pulando criação de superuser."
            ))
            return

        User = get_user_model()
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.SUCCESS(
                f"Superuser '{username}' já existe — nada a fazer."
            ))
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(
            f"Superuser '{username}' criado com sucesso."
        ))
