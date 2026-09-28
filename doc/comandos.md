# Como rodar o Top Filme localmente

## Terminais necessários

Precisa de **dois terminais abertos ao mesmo tempo**: um para o backend Django e outro para o frontend Vite.

### Terminal 1 — Backend (porta 8000)

```powershell
cd backend
venv\Scripts\activate
python manage.py runserver 8000
```

Backend fica em `http://localhost:8000`.
Admin do Django em `http://localhost:8000/admin/`.

### Terminal 2 — Frontend (porta 5173)

```powershell
cd top-filme
npm run dev
```

Frontend fica em `http://localhost:5173`.

---

## Credenciais para gravação e teste

### Usuário B2C (app do usuário final)

Login em `http://localhost:5173/auth`.
Qualquer email do seed serve. Todos têm senha `1234`.

Exemplos:
- `carol@mail.com`
- `mateus@mail.com`
- `pedro@mail.com`
- `bia@mail.com`
- (lista completa em `backend/api/management/commands/seed.py`)

### Empresa B2B (painel de inteligência)

Login em `http://localhost:5173/empresas/login`.

- Email: `demo@netflix.demo.topfilme.local`
- Senha: `empresa1234`
- Assinatura ativa (já libera o dashboard)

Outras empresas no seed (assinatura pendente):
- `demo@globo.demo.topfilme.local` / `empresa1234`
- `demo@prime.demo.topfilme.local` / `empresa1234`

### Admin Django

Login em `http://localhost:8000/admin/`.

- Usuário: `admin`
- Senha: `admin123`

No admin dá para ativar/desativar assinaturas, ver usuários, análises registradas e empresas.

---

## Comandos úteis do backend

### Repopular banco do zero

```powershell
cd backend
venv\Scripts\activate
python manage.py seed --limpar
```

Isso apaga os dados do seed e recria: 15 usuários, ~86 análises com timestamps distribuídos entre 18/06/2026 e hoje, 3 empresas demo.

### Rodar apenas as migrations (sem seed)

```powershell
python manage.py migrate
```

### Criar novo superuser

```powershell
python manage.py createsuperuser
```

---

## Build de produção do frontend

```powershell
cd top-filme
npm run build
```

Gera pasta `top-filme/dist/`.

---

## Deploy no Railway (produção existente)

O frontend está publicado no Railway com deploy automático:

```powershell
git push origin master
```

O Railway monitora o branch `master` e rebuilda automaticamente. **Só o frontend está publicado** — o backend Django roda apenas localmente por enquanto.

---

## Notas importantes

- O frontend em produção (Railway) **não conecta no backend local** — ele usa o mock antigo em `sessionStorage`.
- Para a gravação do vídeo, use ambos localmente (`localhost:5173` + `localhost:8000`).
- A URL `localhost:5173` aparece na barra do navegador. Grave em tela cheia (F11) ou recorte a área com OBS para esconder isso.
