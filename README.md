# Marmitaria Pimenta Doce

Sistema completo de gestão para marmitaria, desenvolvido com Next.js, TypeScript, Prisma e SQLite.

## 🚀 Funcionalidades

- **Dashboard** com métricas em tempo real
- **Cadastros**: Insumos, Fornecedores, Clientes, Produtos
- **Composição de Custos**: Cálculo automático de custos e margens
- **Vendas**: Interface POS para lançamento de vendas
- **Cardápio**: Visualização dos produtos disponíveis
- **Financeiro**: Contas a pagar, receber e controle de devedores

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd marmitaria-pimenta-doce
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse http://localhost:3000

## 🏗️ Build para Produção

```bash
npm run build
npm start
```

## 📦 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Faça push do código para GitHub
2. Conecte seu repositório no Vercel
3. Configure a variável de ambiente `DATABASE_URL`
4. Deploy automático!

**Nota**: Para produção, recomenda-se usar PostgreSQL ao invés de SQLite.

### Deploy Manual

1. Build da aplicação:
```bash
npm run build
```

2. Configure o banco de dados de produção no `.env`:
```
DATABASE_URL="seu-database-url-aqui"
```

3. Execute as migrações:
```bash
npx prisma migrate deploy
```

4. Inicie a aplicação:
```bash
npm start
```

## 🗄️ Banco de Dados

### Desenvolvimento
O projeto usa SQLite por padrão para facilitar o desenvolvimento local.

### Produção
Para produção, recomenda-se PostgreSQL:

1. Atualize o `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Atualize a `DATABASE_URL` no `.env`:
```
DATABASE_URL="postgresql://user:password@host:port/database"
```

3. Execute as migrações:
```bash
npx prisma migrate deploy
```

## 🛠️ Tecnologias

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Styling**: Vanilla CSS (CSS Modules)

## 📚 Estrutura do Projeto

```
marmitaria-pimenta-doce/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── migrations/        # Migrações
├── src/
│   ├── app/
│   │   ├── api/          # API Routes
│   │   ├── customers/    # Página de clientes
│   │   ├── ingredients/  # Página de insumos
│   │   ├── products/     # Página de produtos
│   │   ├── sales/        # Página de vendas
│   │   ├── suppliers/    # Página de fornecedores
│   │   ├── financial/    # Página financeira
│   │   ├── menu/         # Página de cardápio
│   │   └── layout.tsx    # Layout principal
│   ├── components/       # Componentes React
│   └── lib/             # Utilitários
├── .env                 # Variáveis de ambiente (não commitar)
├── .env.example         # Exemplo de variáveis
└── package.json
```

## 🔐 Variáveis de Ambiente

```env
DATABASE_URL="file:./dev.db"
```

## 📖 Uso

1. **Cadastre Insumos**: Adicione os ingredientes com seus custos
2. **Cadastre Produtos**: Crie produtos e defina a composição com os insumos
3. **Registre Vendas**: Lance vendas e acompanhe pagamentos
4. **Gerencie Finanças**: Controle contas a pagar e receber

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é privado e proprietário.
