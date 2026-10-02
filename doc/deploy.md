# Deploy em produção — Top Filme

Guia passo-a-passo para colocar backend + frontend em produção no Railway,
com Postgres gerenciado. **Dev local continua com SQLite** sem mudanças.

> **Importante:** Railway tem auto-deploy no push para `master`. Siga a ordem
> abaixo para não quebrar o frontend em produção antes do backend estar no ar.

---

## Arquitetura final

```
Railway Project "startup_one"
├── Service: Frontend   ← já existe hoje
├── Service: Backend    ← vamos criar
└── Service: Postgres   ← vamos criar (banco gerenciado Railway)
```

---

## Pré-requisitos

- Conta Railway com o projeto `startup_one` já criado
- Projeto conectado ao GitHub `MateusC033/startup_one`
- **Não dar push ainda.** Preparação primeiro, deploy depois.

---

## Ordem recomendada

**Fase 1 — Criar Postgres e Backend no Railway (sem push)**
**Fase 2 — Configurar variáveis de ambiente**
**Fase 3 — Push dos commits locais e observar deploy**
**Fase 4 — Configurar frontend com URL do backend**
**Fase 5 — Validar**

---

## Fase 1 — Criar serviços no Railway

### 1.1 Postgres

1. Abrir o projeto `startup_one` no Railway
2. Clicar em **"+ New"** → **Database** → **Add PostgreSQL**
3. Esperar provisionamento (~30 segundos)
4. Clicar no serviço criado → aba **Variables** → confirmar que existe `DATABASE_URL` disponível
   (Railway gera automaticamente)

### 1.2 Backend

1. No mesmo projeto, **"+ New"** → **GitHub Repo** → selecionar `MateusC033/startup_one`
2. **Settings** do novo serviço:
   - **Service Name:** `topfilme-api` (ou similar)
   - **Root Directory:** `backend` (importante — monorepo)
   - **Build Command:** deixar em branco (Railway detecta pelo `requirements.txt`)
   - **Start Command:** deixar em branco (vai usar o `Procfile` / `railway.toml`)
3. **NÃO fazer deploy ainda** — primeiro configurar env vars (Fase 2)

### 1.3 Gerar domínio público do backend

1. Na aba **Settings** → **Networking** → **Generate Domain**
2. Railway cria um domínio automático (algo como `backend-production-xxxx.up.railway.app`)
3. **Não precisa anotar** — vamos referenciar via variável automática do Railway

> **Importante:** o nome do serviço precisa ser exatamente **`backend`** (minúsculo).
> Se Railway colocou outro nome (ex: `startup_one`), renomear em Settings → nome
> do serviço. As referências entre serviços dependem desse nome bater.

---

## Fase 2 — Variáveis de ambiente (via Railway Reference Variables)

Em vez de copiar/colar domínios literais (que podem mudar), usamos referências
dinâmicas do Railway. Cada serviço expõe automaticamente variáveis como
`RAILWAY_PUBLIC_DOMAIN`, e outros serviços podem referenciar via
`${{servico.VARIAVEL}}`.

### 2.1 Backend — Variables

Na aba **Variables** do serviço backend, usar o **Raw Editor** e colar:

```
SECRET_KEY=<gerar nova — ver 2.3>
DEBUG=False
DATABASE_URL=${{Postgres.DATABASE_URL}}
ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}
CSRF_TRUSTED_ORIGINS=https://${{RAILWAY_PUBLIC_DOMAIN}}
CORS_ALLOWED_ORIGINS=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}
```

**Como ler isso:**
- `${{Postgres.DATABASE_URL}}` — pega a `DATABASE_URL` do serviço chamado `Postgres`
  (nome padrão do serviço Postgres gerado em 1.1)
- `${{RAILWAY_PUBLIC_DOMAIN}}` sem prefixo de serviço — referência ao próprio
  serviço (equivalente a `${{backend.RAILWAY_PUBLIC_DOMAIN}}` quando configurado
  dentro do serviço `backend`)
- `${{frontend.RAILWAY_PUBLIC_DOMAIN}}` — pega o domínio público do serviço frontend

**Vantagens:**
- Se Railway regenerar o domínio (ou se recriarmos um serviço), as referências
  continuam resolvendo corretamente — sem precisar editar nenhuma variável
- Nenhum domínio hard-coded no doc, no código ou nas variáveis

### 2.2 Confirmar nomes de serviço

As referências acima assumem que os serviços se chamam exatamente:

| Serviço  | Nome esperado |
|---|---|
| Backend  | `backend` |
| Frontend | `frontend` |
| Postgres | `Postgres` |

Se algum tiver outro nome no Railway, ajustar as referências ou renomear o
serviço no painel (Settings → nome do serviço).

### 2.3 Gerar SECRET_KEY nova

Rodar localmente **com a venv ativa**:

```bash
cd backend
source venv/Scripts/activate     # Windows (Git Bash)
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copiar a saída (~50 caracteres) para a variável `SECRET_KEY` no Railway.
**Nunca commitar essa chave no git.**

---

## Fase 3 — Push e primeiro deploy

Agora que o serviço backend está criado e as env vars configuradas, Railway
está esperando o código. Push dos commits locais:

```bash
git push origin master
```

Observar no Railway (aba **Deployments** do serviço backend):

1. **Build** — Nixpacks detecta Python, instala `requirements.txt`
2. **Release command** — roda `python manage.py migrate --no-input` +
   `collectstatic --no-input` (do `Procfile` / `railway.toml`)
3. **Deploy** — inicia `gunicorn topfilme.wsgi:application`

Se falhar, ver **View Logs** do deploy. Erros comuns no fim deste doc.

### 3.1 Superuser criado automaticamente

O release command roda `python manage.py ensure_superuser`, que cria o
superuser a partir de três env vars **se elas estiverem configuradas**:

```
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_PASSWORD=<escolha uma senha forte>
DJANGO_SUPERUSER_EMAIL=mateuscaldeira.py@gmail.com
```

Adicionar essas três variáveis no serviço **backend** → **Variables** antes
do primeiro deploy. O `ensure_superuser` é idempotente:

- Primeira vez: cria o superuser com as credenciais informadas
- Deploys seguintes: detecta que já existe e faz no-op
- Se as três vars não estiverem definidas: command apenas loga aviso e sai

Sem shell, sem `railway run`, sem passo manual depois do deploy.

> **Trocar senha depois:** se precisar mudar a senha do admin, acessar
> `/admin/` com a atual, menu do usuário → "Change password". Ou deletar
> o usuário e redeployar com nova `DJANGO_SUPERUSER_PASSWORD` (o command
> recria quando não encontra o username).

### 3.2 Testar admin

Abrir o domínio do backend (ver em **Settings → Networking** se precisar
confirmar) + `/admin/` → login → confirmar que o CSS carregou (whitenoise)
e que dá para navegar.

---

## Fase 4 — Frontend aponta para o backend (via variável)

### 4.1 Configurar VITE_API_URL

1. Serviço **frontend** no Railway → aba **Variables**
2. Adicionar (via Raw Editor ou "+ New Variable"):
   ```
   VITE_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api
   ```
3. Salvar — Railway rebuilda o frontend automaticamente, resolvendo a
   referência no momento do build

> Atenção: Vite injeta variáveis em **build time** (viram constantes
> no bundle JS). Se o domínio do backend mudar depois, o frontend precisa
> ser redeployado para re-resolver a referência.

### 4.2 Confirmar CORS

Como `CORS_ALLOWED_ORIGINS` do backend já usa
`${{frontend.RAILWAY_PUBLIC_DOMAIN}}` (Fase 2.1), a configuração é
automática e não precisa de ajuste. Qualquer regeneração de domínio no
frontend é propagada no próximo redeploy do backend.

---

## Fase 5 — Validação end-to-end

Após o rebuild do frontend terminar:

1. **Landing** carrega
2. **Cadastro** (`/auth`) cria usuário real no Postgres de produção
3. **Quiz** → **Result** persiste análise (verificável no admin)
4. **Home** mostra o histórico recém-criado
5. **Login empresa** com credencial de teste (ver abaixo) → **Dashboard**
   carrega agregações do Postgres de produção

### 5.1 Dados em produção

**Estado inicial:** banco vazio. Isso é deliberado — o avaliador que acessar o
sistema vai fazer o próprio quiz e ver o dado dele aparecer.

**Caso queira popular com os dados demo** (15 usuários + 86 análises + 3 empresas),
há duas formas:

**Opção A — via Railway CLI (requer instalação local)**
```bash
# Uma vez: instalar e autenticar
npm install -g @railway/cli
railway login
railway link                 # escolhe o projeto startup_one

# Rodar o comando no serviço backend
railway run --service backend python manage.py seed
```

**Opção B — via management command habilitado por env var temporária**
Alternativa se não quiser mexer com CLI:

1. No serviço backend → **Variables** → adicionar `RUN_SEED_ON_DEPLOY=1`
2. Fazer um redeploy manual (botão **Deploy** na aba Deployments)
3. **Imediatamente após o deploy terminar**, remover a variável
   `RUN_SEED_ON_DEPLOY` para não repopular em deploys futuros

(Essa opção B exige que o `seed` seja chamado condicionalmente no release
command — ver `backend/Procfile`. Hoje não está habilitada; posso configurar
se preferir.)

### 5.2 Credencial de empresa de teste

Se e quando o `seed` for executado, cria 3 empresas demo:

- `demo@netflix.demo.topfilme.local` / `empresa1234` (assinatura 2º mês)
- `demo@globo.demo.topfilme.local` / `empresa1234` (1º mês)
- `demo@prime.demo.topfilme.local` / `empresa1234` (3º mês)

Sem rodar `seed`, nenhuma empresa existe em produção.

---

## Erros comuns no deploy

### "Application failed to respond"
Procfile ou start command errado. Confirmar que `gunicorn topfilme.wsgi:application`
está no `Procfile` ou no `railway.toml`.

### "DisallowedHost" no admin
Falta o domínio no `ALLOWED_HOSTS`. Adicionar na env var e redeployar.

### "CSRF verification failed" no admin
Falta o domínio no `CSRF_TRUSTED_ORIGINS`. Inclui `https://` no começo,
sem barra no final.

### "CORS blocked" no frontend
`CORS_ALLOWED_ORIGINS` não tem o domínio do frontend. Também verificar que
o header `X-Empresa-Token` está em `CORS_ALLOW_HEADERS` (já está no
`settings.py` por padrão).

### Admin sem CSS
Whitenoise não configurado ou `collectstatic` não rodou. Confirmar no
log do release command que `collectstatic` executou sem erro.

### Migrations não aplicaram
O release command deve rodar `migrate --no-input`. Se falhou, verificar o log
do release no painel do Railway e corrigir o erro. Para forçar nova tentativa:
botão **Redeploy** na aba Deployments.

### "psycopg2 not found"
`requirements.txt` sem `psycopg2-binary` — verificar que o arquivo
versionado tem a linha.

---

## Rollback de emergência

Se o deploy quebrar e você precisar voltar ao estado anterior:

1. Railway → aba **Deployments** do serviço afetado
2. Encontrar o último deploy que funcionava
3. Menu **⋯** → **Redeploy**

Para rollback do frontend: desvincular `VITE_API_URL` temporariamente e
redeployar — a Landing e páginas estáticas voltam a funcionar (sem backend).

---

## Checklist final antes do push

- [ ] `backend/requirements.txt` versionado com todas as dependências
- [ ] `backend/Procfile` e `backend/railway.toml` versionados
- [ ] `backend/runtime.txt` com `python-3.11.9`
- [ ] `backend/.gitignore` ignorando `db.sqlite3`, `venv/`, `__pycache__/`,
      `staticfiles/`
- [ ] `backend/topfilme/settings.py` lendo env vars com fallback dev
- [ ] Postgres criado no Railway (nome do serviço: `Postgres`)
- [ ] Backend criado no Railway com Root Directory `backend` (nome do serviço: `backend`)
- [ ] Serviço do frontend confirmado com nome `frontend`
- [ ] No backend: `SECRET_KEY` gerada e configurada
- [ ] No backend: `DEBUG=False`
- [ ] No backend: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] No backend: `ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}`
- [ ] No backend: `CSRF_TRUSTED_ORIGINS=https://${{RAILWAY_PUBLIC_DOMAIN}}`
- [ ] No backend: `CORS_ALLOWED_ORIGINS=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}`
- [ ] No backend: `DJANGO_SUPERUSER_USERNAME` definida
- [ ] No backend: `DJANGO_SUPERUSER_PASSWORD` definida (senha forte)
- [ ] No backend: `DJANGO_SUPERUSER_EMAIL` definida
- [ ] No frontend: `VITE_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api`
- [ ] Testou localmente que `python manage.py runserver` ainda funciona
      com SQLite (fallback do settings)

---

## Como validar que dev local continua funcionando

Antes do push, confirmar que o modo dev ainda está OK:

```bash
cd backend
source venv/Scripts/activate
python manage.py runserver 8000
```

- Deve usar SQLite (`DATABASE_URL` não está no ambiente)
- Deve rodar em `localhost:8000`
- Admin em `localhost:8000/admin/` funciona (DEBUG=True serve static)
- API responde em `localhost:8000/api/dashboard`

Frontend em paralelo:

```bash
cd top-filme
npm run dev
```

- Deve bater em `http://localhost:8000/api` por fallback (sem `VITE_API_URL`)
