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

### 1.3 Nome de domínio público

1. Na aba **Settings** → **Networking** → **Generate Domain**
2. Anotar o domínio gerado — algo como `topfilme-api-production.up.railway.app`
3. **Este domínio vai nas env vars** (próxima fase)

---

## Fase 2 — Variáveis de ambiente

### 2.1 Backend — conectar ao Postgres

1. Aba **Variables** do serviço backend
2. Clicar em **"+ New Variable"** → **Add Reference**
3. Selecionar o Postgres → variável `DATABASE_URL`
4. Isso cria uma referência dinâmica (não precisa copiar URL)

### 2.2 Backend — demais variáveis

Adicionar manualmente (**Variables** → **Raw Editor** permite colar tudo):

```
SECRET_KEY=<gerar nova — ver 2.3>
DEBUG=False
ALLOWED_HOSTS=topfilme-api-production.up.railway.app
CORS_ALLOWED_ORIGINS=https://<DOMINIO_FRONTEND>
CSRF_TRUSTED_ORIGINS=https://topfilme-api-production.up.railway.app
```

Substituir:
- `topfilme-api-production.up.railway.app` pelo domínio gerado em 1.3
- `<DOMINIO_FRONTEND>` pelo domínio do serviço frontend (ver aba do frontend)

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

### 3.1 Criar superuser em produção

Após deploy bem-sucedido:

1. Aba **Settings** → **Shell** (ou usar `railway shell` no CLI)
2. Rodar: `python manage.py createsuperuser`
3. Informar email, nickname e senha

### 3.2 Testar admin

Abrir `https://topfilme-api-production.up.railway.app/admin/` → login →
confirmar que o CSS carregou (whitenoise) e que dá para navegar.

---

## Fase 4 — Frontend aponta para o backend

### 4.1 Configurar VITE_API_URL

1. Serviço **frontend** no Railway → aba **Variables**
2. Adicionar:
   ```
   VITE_API_URL=https://topfilme-api-production.up.railway.app/api
   ```
   (atenção: inclui `/api` no final, sem barra depois)
3. Salvar — Railway rebuilda o frontend automaticamente

### 4.2 Confirmar CORS

No serviço **backend**, verificar que `CORS_ALLOWED_ORIGINS` inclui o domínio
exato do frontend (com `https://`, sem barra no final).

Se o domínio do frontend ainda não existia quando configuramos (Fase 2),
adicionar agora e redeployar o backend.

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

Para popular com dados de demonstração em algum momento:

```bash
# via shell do Railway:
python manage.py seed
```

> Cuidado: `seed --limpar` apaga todos os usuários do seed. Em produção,
> rodar apenas `seed` sem flag (vai só adicionar, não limpar).

### 5.2 Credencial de empresa de teste

O comando `seed` cria 3 empresas demo:

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
O release command deve rodar `migrate --no-input`. Se não rodou, abrir
shell e executar manualmente: `python manage.py migrate`.

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
- [ ] Postgres criado no Railway
- [ ] Backend criado no Railway com Root Directory `backend`
- [ ] `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`,
      `CSRF_TRUSTED_ORIGINS` configuradas no backend
- [ ] `DATABASE_URL` referenciando o Postgres
- [ ] `VITE_API_URL` configurada no serviço frontend
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
