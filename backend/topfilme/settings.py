"""
Django settings — Top Filme.

Comportamento dinâmico via env vars (prod no Railway) com fallback para
dev local. Variáveis importantes:

- SECRET_KEY             obrigatória em prod
- DEBUG                  'True' ou 'False' (default True = dev)
- ALLOWED_HOSTS          lista separada por vírgula
- DATABASE_URL           URL do Postgres em prod; se ausente usa SQLite local
- CORS_ALLOWED_ORIGINS   lista separada por vírgula
- CSRF_TRUSTED_ORIGINS   lista separada por vírgula (admin precisa)
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def _env_list(nome, default=""):
    """Converte 'a,b,c' da env var em lista limpa; ignora espaços e vazios."""
    raw = os.environ.get(nome, default)
    return [x.strip() for x in raw.split(",") if x.strip()]


def _env_bool(nome, default=False):
    valor = os.environ.get(nome)
    if valor is None:
        return default
    return valor.strip().lower() in ("1", "true", "yes", "on")


# ─── Core ──────────────────────────────────────────────────────────

SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "django-insecure-0q-3x04_wkon7d^zc@dc=_bkf61749r$=x@6s6ezm9s7=xs*27",
)

DEBUG = _env_bool("DEBUG", default=True)

ALLOWED_HOSTS = _env_list("ALLOWED_HOSTS", default="localhost,127.0.0.1,*")


# ─── Apps / middleware ─────────────────────────────────────────────

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # whitenoise logo após security para servir arquivos estáticos em prod
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ─── DRF ───────────────────────────────────────────────────────────

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}


# ─── CORS ──────────────────────────────────────────────────────────

CORS_ALLOWED_ORIGINS = _env_list(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173",
)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept", "accept-encoding", "authorization", "content-type", "dnt",
    "origin", "user-agent", "x-csrftoken", "x-requested-with",
    "x-empresa-token",
]

# CSRF em prod: o admin do Django exige que o host do browser esteja aqui.
# Em dev (DEBUG=True) o Django é permissivo e não precisa.
CSRF_TRUSTED_ORIGINS = _env_list("CSRF_TRUSTED_ORIGINS", default="")


# ─── URLs / templates / WSGI ───────────────────────────────────────

ROOT_URLCONF = "topfilme.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "topfilme.wsgi.application"


# ─── Banco: Postgres em prod via DATABASE_URL, SQLite em dev ───────

DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    import dj_database_url
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=not DEBUG,
        ),
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ─── Password validators ───────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ─── i18n / tz ─────────────────────────────────────────────────────

LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True


# ─── Static files (admin em prod via whitenoise) ───────────────────

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# ─── Modelo de User custom ─────────────────────────────────────────

AUTH_USER_MODEL = "api.Usuario"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ─── Segurança adicional em produção ───────────────────────────────

if not DEBUG:
    # Railway serve atrás de proxy TLS: respeita header X-Forwarded-Proto
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
