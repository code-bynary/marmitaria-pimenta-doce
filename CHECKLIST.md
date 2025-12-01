# Deploy Checklist - Marmitaria Pimenta Doce

## Pré-Deploy

### 1. Preparação do Código
- [x] README.md criado
- [x] DEPLOY.md criado com guias completos
- [x] .env.example criado
- [x] .gitignore atualizado (inclui .env e *.db)
- [x] package.json com scripts de deploy
- [x] vercel.json criado

### 2. Antes de Fazer Deploy

- [ ] Testar build local:
  ```bash
  npm run build
  npm start
  ```

- [ ] Verificar se todas as páginas carregam
- [ ] Testar criação de dados (ingredientes, produtos, etc.)
- [ ] Verificar se as vendas estão registrando corretamente

### 3. Preparar Repositório Git

- [ ] Inicializar Git (se ainda não foi):
  ```bash
  git init
  ```

- [ ] Adicionar arquivos:
  ```bash
  git add .
  ```

- [ ] Fazer commit:
  ```bash
  git commit -m "Projeto completo - Marmitaria Pimenta Doce"
  ```

- [ ] Criar repositório no GitHub e fazer push:
  ```bash
  git remote add origin https://github.com/seu-usuario/marmitaria-pimenta-doce.git
  git branch -M main
  git push -u origin main
  ```

## Deploy na Vercel (Recomendado)

### 1. Escolher Banco de Dados

**IMPORTANTE**: SQLite não funciona em produção no Vercel!

Escolha uma das opções:

#### Opção A: Vercel Postgres (Recomendado)
- [ ] Criar projeto no Vercel
- [ ] Ir em Storage → Create Database → Postgres
- [ ] Copiar DATABASE_URL automaticamente gerada

#### Opção B: Neon (PostgreSQL Gratuito)
- [ ] Criar conta em https://neon.tech
- [ ] Criar novo projeto
- [ ] Copiar connection string

#### Opção C: Supabase (PostgreSQL Gratuito)
- [ ] Criar conta em https://supabase.com
- [ ] Criar novo projeto
- [ ] Ir em Settings → Database
- [ ] Copiar connection string (modo "URI")

### 2. Atualizar Schema Prisma

- [ ] Editar `prisma/schema.prisma`:
  ```prisma
  datasource db {
    provider = "postgresql"
  }
  ```

- [ ] Fazer commit:
  ```bash
  git add prisma/schema.prisma
  git commit -m "Mudar para PostgreSQL"
  git push
  ```

### 3. Deploy no Vercel

1. [ ] Acessar https://vercel.com
2. [ ] Clicar em "Add New Project"
3. [ ] Importar repositório do GitHub
4. [ ] Adicionar variável de ambiente:
   - Nome: `DATABASE_URL`
   - Valor: `postgresql://...` (do passo 1)
5. [ ] Clicar em "Deploy"

### 4. Executar Migrações

Após o primeiro deploy:

- [ ] No painel do Vercel, ir em Settings → Functions
- [ ] Ou executar localmente apontando para o banco de produção:
  ```bash
  # Temporariamente mudar .env para apontar para produção
  npx prisma migrate deploy
  ```

**DICA**: Melhor opção é criar um script one-time:
```bash
# No terminal, com DATABASE_URL de produção
DATABASE_URL="sua-url-postgresql" npx prisma migrate deploy
```

## Deploy no Railway

- [ ] Acessar https://railway.app
- [ ] Criar novo projeto
- [ ] Adicionar PostgreSQL (cria DATABASE_URL automaticamente)
- [ ] Conectar repositório GitHub
- [ ] Railway detecta Next.js automaticamente
- [ ] Deploy! ✅

## Pós-Deploy

### 1. Verificar Deploy
- [ ] Abrir URL do deploy
- [ ] Testar todas as páginas
- [ ] Criar dados de teste

### 2. Cadastrar Dados Iniciais
- [ ] Cadastrar insumos principais
- [ ] Criar produtos
- [ ] Testar vendas

### 3. Configurações Opcionais
- [ ] Configurar domínio personalizado
- [ ] Ativar HTTPS (automático no Vercel/Railway)
- [ ] Configurar backups do banco (se necessário)

## Troubleshooting

### "Prisma Client não gerado"
```bash
# Vercel deve executar automaticamente, mas se falhar:
# Adicione no package.json (já está adicionado):
"postinstall": "prisma generate"
```

### "Cannot connect to database"
- [ ] Verificar se DATABASE_URL está correta
- [ ] Confirmar que `?sslmode=require` está na URL (PostgreSQL)
- [ ] Testar conexão localmente com a URL de produção

### "Build failed"
- [ ] Verificar logs no painel da plataforma
- [ ] Confirmar que `prisma generate` está rodando
- [ ] Verificar se @prisma/client está em `dependencies`, não `devDependencies`

### Páginas vazias/erros 500
- [ ] Verificar se migrações foram executadas
- [ ] Checar logs da aplicação
- [ ] Confirmar que DATABASE_URL está correta

## URLs Úteis

Depois do deploy, guardar:

- [ ] URL da aplicação: __________________
- [ ] URL do banco de dados: __________________
- [ ] Repositório GitHub: __________________
- [ ] Painel Vercel/Railway: __________________

## Backup

### PostgreSQL (Linha de Comando)
```bash
# Exportar
pg_dump -h host -U user -d database > backup.sql

# Importar
psql -h host -U user -d database < backup.sql
```

### Supabase/Neon
- [ ] Usar dashboard web para backups automáticos
- [ ] Configurar snapshots se disponível

---

## 🎉 Deploy Completo!

Após completar todos os itens acima, seu sistema estará no ar e pronto para uso!

**Próximos passos sugeridos**:
1. Treinar usuários no sistema
2. Cadastrar produtos reais
3. Configurar backup automático
4. Monitorar uso e performance
