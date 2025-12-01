# Guia de Deploy - Marmitaria Pimenta Doce

## Opções de Deploy

### 1. Vercel (Recomendado) ⭐

A forma mais simples e rápida de fazer deploy.

#### Passos:

1. **Criar repositório no GitHub**:
```bash
cd f:\Projetos Antigravity\marmitaria-pimenta-doce
git init
git add .
git commit -m "Initial commit"
git remote add origin <seu-repositorio-github>
git push -u origin main
```

2. **Deploy no Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente (ver abaixo)
   - Clique em "Deploy"

3. **Configurar Banco de Dados** (Importante!):
   - Para produção, **não use SQLite**
   - Opções recomendadas:
     - **Vercel Postgres** (integrado)
     - **Neon** (PostgreSQL gratuito)
     - **Supabase** (PostgreSQL gratuito)

4. **Variáveis de Ambiente no Vercel**:
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

#### Configurar PostgreSQL para Produção

1. Atualize `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
}
```

2. Execute no terminal local:
```bash
npx prisma migrate deploy
npx prisma generate
```

3. Faça commit e push:
```bash
git add .
git commit -m "Configure PostgreSQL for production"
git push
```

---

### 2. Railway.app

Alternativa gratuita com PostgreSQL incluído.

#### Passos:

1. Acesse [railway.app](https://railway.app)
2. Crie novo projeto
3. Adicione PostgreSQL (automaticamente cria DATABASE_URL)
4. Deploy do GitHub repo
5. Railway detectará Next.js automaticamente

**Build Command**: `npm install && npx prisma generate && npm run build`
**Start Command**: `npm start`

---

### 3. Render.com

Opção gratuita com PostgreSQL.

#### Passos:

1. Crie conta em [render.com](https://render.com)
2. Crie PostgreSQL database (Free tier)
3. Copie a `DATABASE_URL`
4. Crie Web Service:
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm start`
5. Adicione variável de ambiente `DATABASE_URL`

---

### 4. Deploy Manual (VPS/Servidor próprio)

Se você tem um servidor Linux (Ubuntu/Debian):

#### Requisitos:
- Node.js 18+
- PostgreSQL
- PM2 (gerenciador de processos)

#### Passos:

1. **Instalar dependências no servidor**:
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt install postgresql postgresql-contrib

# PM2
sudo npm install -g pm2
```

2. **Configurar PostgreSQL**:
```bash
sudo -u postgres psql
CREATE DATABASE marmitaria;
CREATE USER marmitaria_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE marmitaria TO marmitaria_user;
\q
```

3. **Clonar e configurar projeto**:
```bash
git clone <seu-repo>
cd marmitaria-pimenta-doce
npm install
```

4. **Criar arquivo `.env`**:
```bash
echo 'DATABASE_URL="postgresql://marmitaria_user:sua_senha_segura@localhost:5432/marmitaria"' > .env
```

5. **Build e migração**:
```bash
npx prisma generate
npx prisma migrate deploy
npm run build
```

6. **Iniciar com PM2**:
```bash
pm2 start npm --name "marmitaria" -- start
pm2 save
pm2 startup
```

7. **Configurar Nginx (opcional)**:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Configurações Importantes

### Migração de SQLite para PostgreSQL

Se você já tem dados no SQLite local e quer migrar:

1. **Opção 1 - Recriar dados manualmente**
   - Mais simples para poucos dados
   - Recadastre produtos, clientes, etc.

2. **Opção 2 - Exportar/Importar**
   ```bash
   # Exportar dados do SQLite
   npx prisma db seed
   
   # Ou usar ferramentas como pgloader
   ```

### Otimizações de Produção

1. **Adicionar no `package.json`**:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

2. **Criar `prisma/seed.ts` (dados iniciais)**:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Adicione dados iniciais aqui se necessário
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Variáveis de Ambiente Completas

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Next.js (opcional)
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
```

---

## Checklist de Deploy ✅

Antes de fazer deploy, verifique:

- [ ] `.env.example` criado (sem dados sensíveis)
- [ ] `.gitignore` contém `.env` e `dev.db`
- [ ] `DATABASE_URL` configurada para PostgreSQL
- [ ] Schema Prisma atualizado para `provider = "postgresql"`
- [ ] Testado build local: `npm run build`
- [ ] Migrações testadas: `npx prisma migrate deploy`
- [ ] Código commitado no GitHub
- [ ] Variáveis de ambiente configuradas na plataforma
- [ ] SSL configurado (HTTPS)

---

## Troubleshooting Comum

### Erro: "Prisma Client não gerado"
```bash
npx prisma generate
```

### Erro: "Cannot find module '@prisma/client'"
```bash
npm install @prisma/client
npx prisma generate
```

### Erro de conexão com PostgreSQL
- Verifique se `DATABASE_URL` está correta
- Confirme que `?sslmode=require` está na URL
- Teste conexão: `npx prisma db push`

### Erro de build no Vercel/Railway
- Adicione `postinstall` script no package.json
- Certifique-se que Prisma está em `dependencies`, não `devDependencies`

---

## Monitoramento e Manutenção

### Logs (PM2)
```bash
pm2 logs marmitaria
pm2 monit
```

### Backup do Banco (PostgreSQL)
```bash
pg_dump -U marmitaria_user marmitaria > backup.sql
```

### Restore
```bash
psql -U marmitaria_user marmitaria < backup.sql
```

---

## Próximos Passos Após Deploy

1. Cadastre os dados iniciais
2. Configure backup automático do banco
3. Configure domínio personalizado
4. Ative HTTPS (Let's Encrypt)
5. Configure alertas de erro (Sentry)
6. Implemente autenticação se necessário

---

## Suporte

Para problemas com deploy, verifique:
- Logs da plataforma
- Documentação do Prisma: https://www.prisma.io/docs
- Documentação do Next.js: https://nextjs.org/docs
