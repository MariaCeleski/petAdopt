# PetAdopt - Plataforma de Adoção de Pets

Uma plataforma web moderna desenvolvida em Next.js 16.x para conectar animais de estimação abandonados com famílias que desejam adotar.

## 🚀 Tecnologias

- **Framework:** Next.js 16.x com App Router
- **UI Library:** React 19.x
- **Linguagem:** JavaScript ES2024
- **Styling:** CSS Modules + CSS Custom Properties
- **Database:** PostgreSQL com Prisma ORM
- **Authentication:** NextAuth.js v4
- **Upload de Imagens:** Cloudinary
- **Email:** SendGrid/Resend
- **Validação:** Zod
- **Testes:** Fast-check (Property-based testing)

## 📁 Estrutura do Projeto

```
petadopt-app/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Autenticação
│   │   │   ├── pets/          # Gerenciamento de pets
│   │   │   ├── upload/        # Upload de imagens
│   │   │   └── adoptions/     # Sistema de adoção
│   │   ├── contato/           # Página de contato
│   │   ├── globals.css        # Estilos globais
│   │   ├── layout.js          # Layout principal
│   │   └── page.js            # Homepage
│   ├── components/            # Componentes React
│   │   ├── common/            # Componentes de layout
│   │   │   ├── Header/
│   │   │   └── Footer/
│   │   ├── ui/                # Design system
│   │   │   ├── Button/
│   │   │   └── Input/
│   │   ├── auth/              # Componentes de autenticação
│   │   ├── pets/              # Componentes de pets
│   │   └── dashboard/         # Componentes do dashboard
│   ├── lib/                   # Utilitários e configurações
│   │   ├── auth.js            # Configuração NextAuth.js
│   │   ├── prisma.js          # Cliente Prisma
│   │   ├── errors.js          # Sistema de erros
│   │   ├── utils/             # Funções utilitárias
│   │   └── validation/        # Schemas Zod
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Bibliotecas e utilitários
│   └── styles/                # Estilos adicionais
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.js               # Dados iniciais
├── docs/                      # Documentação
├── .env.example               # Variáveis de ambiente exemplo
├── .env                       # Variáveis de ambiente locais
└── prisma.config.ts           # Configuração Prisma 7.x
```

## ⚡ Setup Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/petadopt_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Google OAuth
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu-cloudinary-cloud-name"
CLOUDINARY_API_KEY="sua-cloudinary-api-key"  
CLOUDINARY_API_SECRET="seu-cloudinary-api-secret"

# Email (SendGrid)
SENDGRID_API_KEY="sua-sendgrid-api-key"
EMAIL_FROM="noreply@petadopt.com"
```

### 3. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações (cria as tabelas)
npm run db:migrate

# Inserir dados iniciais (opcional)
npm run db:seed
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

## 🗄️ Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Linter ESLint
- `npm run db:generate` - Gerar cliente Prisma
- `npm run db:push` - Sincronizar schema com banco
- `npm run db:migrate` - Executar migrações
- `npm run db:studio` - Interface visual do banco
- `npm run db:seed` - Inserir dados iniciais

## 🔐 Autenticação

O sistema suporta:
- **Email/Senha** com validação de força
- **OAuth Google**
- **Verificação por email** obrigatória
- **Gerenciamento de sessão** com JWT

### Tipos de Usuário:
- `ADOPTER` - Pessoas que buscam adotar
- `INDIVIDUAL_OWNER` - Proprietários individuais
- `SHELTER_ADMIN` - Administradores de abrigos

## 📊 Modelos de Dados

### User
```typescript
{
  id: string
  email: string (único)
  name: string
  type: 'ADOPTER' | 'SHELTER_ADMIN' | 'INDIVIDUAL_OWNER'
  emailVerified: DateTime?
  // ... outros campos
}
```

### Pet
```typescript
{
  id: string
  name: string
  species: 'DOG' | 'CAT'
  breed: string
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
  status: 'AVAILABLE' | 'PENDING' | 'ADOPTED' | 'UNAVAILABLE'
  images: string[] // URLs das imagens
  // ... outros campos
}
```

### Adoption
```typescript
{
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
  adopterInfo: Json // Informações do formulário
  // ... outros campos
}
```

## 🎨 Design System

### Cores Primárias
- **Orange:** `#FF8C42` - Ação e energia
- **Blue:** `#4A90E2` - Confiança e estabilidade
- **Green:** `#2ECC71` - Sucesso e natureza

### Tipografia
- **Primary:** Poppins (headings)
- **Secondary:** Inter (body text)

### Componentes Base
- `Button` - Botões com variantes
- `Input` - Campos de entrada
- `Card` - Container de conteúdo
- `Modal` - Janelas modais
- `Badge` - Tags e status

## 🧪 Testes

O projeto utiliza **Property-based Testing** com fast-check:

```bash
# Executar todos os testes
npm test

# Executar testes de propriedades
npm run test:properties
```

### Propriedades Testadas:
- Validação de senha (mín. 8 caracteres)
- Campos obrigatórios de pets
- Validação de formato de imagens
- Consistência de filtros

## 📝 Convenções

### Arquivos e Pastas
- **PascalCase** para componentes (`PetCard.js`)
- **camelCase** para utilitários (`formatDate.js`)
- **kebab-case** para páginas (`pet-details/`)

### Commits
```
feat: adiciona sistema de upload
fix: corrige validação de email
docs: atualiza README
```

### Componentes
```javascript
// Estrutura padrão de componente
export default function ComponentName({ prop1, prop2 }) {
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
}
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Push para GitHub
2. Conectar ao Vercel
3. Configurar variáveis de ambiente
4. Deploy automático

### Variáveis de Produção
Certifique-se de configurar todas as variáveis no ambiente de produção:
- `DATABASE_URL`
- `NEXTAUTH_SECRET` (diferente do desenvolvimento)
- `NEXTAUTH_URL` (URL de produção)
- Credenciais OAuth e serviços externos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing-feature`)
3. Commit as mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License.

## 🆘 Suporte

- **Documentação:** [Docs](./docs/)
- **Issues:** [GitHub Issues](link-para-issues)
- **Discord:** [Comunidade](link-para-discord)

---

Desenvolvido com ❤️ para conectar pets com famílias amorosas.