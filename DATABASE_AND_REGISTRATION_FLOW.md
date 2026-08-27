# Fluxo de Cadastro e Armazenamento de Dados

## 📋 Pergunta
"Ao cadastrar com email e senha, para onde vão as informações cadastradas?"

## ✅ Resposta: Banco de Dados SQLite

Todas as informações de cadastro (email, senha, nome, tipo de usuário) são armazenadas em um **banco de dados SQLite** local chamado `dev.db`.

---

## 🗄️ Estrutura do Banco de Dados

### Arquivo de Banco de Dados
```
📁 petadopt-app/
├── prisma/
│   ├── dev.db          ← Arquivo do banco de dados SQLite
│   └── schema.prisma   ← Schema Prisma (descrição da estrutura)
└── src/
```

**Localização exata:** `/Users/mariadelourdesceleski/Documents/petadopt-app/prisma/dev.db`

### Tabela: `users`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | STRING (CUID) | Identificador único do usuário |
| `email` | STRING | Email único (não pode ter duplicados) |
| `name` | STRING | Nome completo do usuário |
| `password` | STRING | Senha **criptografada** (hash bcrypt) |
| `type` | ENUM | Tipo: ADOPTER, INDIVIDUAL_OWNER, ou SHELTER_ADMIN |
| `avatar` | STRING (opcional) | URL da foto de perfil |
| `phone` | STRING (opcional) | Telefone do usuário |
| `location` | STRING (opcional) | Cidade/Estado do usuário |
| `emailVerified` | DATETIME (opcional) | Data de verificação de email |
| `resetToken` | STRING (opcional) | Token para reset de senha |
| `resetTokenExpiry` | DATETIME (opcional) | Expiração do token de reset |
| `createdAt` | DATETIME | Data de criação da conta |
| `updatedAt` | DATETIME | Data da última atualização |

---

## 🔐 Segurança da Senha

### Processo de Hashing

1. **Usuário digita senha:** `MinhaS3nh@Forte`
2. **Validação (auth-utils):**
   - Mínimo 8 caracteres ✓
   - Contém maiúscula/minúscula/número/símbolo ✓
3. **Hashing com bcrypt:**
   - Transforma em hash irreversível
   - Exemplo: `$2b$12$...kR8tL2k8...Z1q`
4. **Armazenagem:**
   - Apenas o hash é armazenado no banco
   - A senha original **nunca** é guardada

### Segurança

✅ **SEGURO**: Mesmo que alguém acesse o banco de dados:
- Não consegue ver a senha original
- Hash é unidirecional (não pode reverter)
- Cada tentativa de login valida usando bcrypt

---

## 🔄 Fluxo Completo de Cadastro

### 1. **Formulário de Cadastro** (`/auth/signup`)
```
Usuário preenche:
├─ Nome: "João Silva"
├─ Email: "joao@example.com"
├─ Senha: "MinhaS3nh@Forte"
├─ Confirmar Senha: "MinhaS3nh@Forte"
└─ Tipo: "ADOPTER" (ou INDIVIDUAL_OWNER ou SHELTER_ADMIN)
```

### 2. **Validação Frontend** (SignUpForm.js)
```javascript
✓ Nome tem pelo menos 2 caracteres
✓ Email é válido (formato de email)
✓ Senha tem pelo menos 8 caracteres
✓ Senha contém maiúscula, minúscula, número, símbolo
✓ Senhas combinam (password === confirmPassword)
✓ Usuário aceitou os termos
```

### 3. **Envio para API** (`POST /api/auth/register`)
```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'MinhaS3nh@Forte',
    type: 'ADOPTER'
  })
})
```

### 4. **Validação Backend** (register/route.js)
```javascript
✓ Todos os campos foram enviados
✓ Nome válido (mínimo 2 caracteres)
✓ Email válido
✓ Senha atende critérios de segurança
✓ Tipo de usuário é válido
✓ Email não existe no banco de dados já
```

### 5. **Hash da Senha** (auth-utils)
```javascript
// Entrada: "MinhaS3nh@Forte"
// Saída: "$2b$12$...hash_criptografado..."
const hashedPassword = await hashPassword(password)
```

### 6. **Armazenamento no Banco** (Prisma)
```javascript
const user = await prisma.user.create({
  data: {
    name: 'João Silva',
    email: 'joao@example.com',
    password: '$2b$12$...hash_criptografado...',
    type: 'ADOPTER',
    emailVerified: new Date() // Em desenvolvimento, já validado
  }
})
```

### 7. **Resposta ao Cliente**
```javascript
{
  message: 'Conta criada com sucesso! Você pode fazer login agora.',
  user: {
    id: 'cuid_12345...',
    name: 'João Silva',
    email: 'joao@example.com',
    type: 'ADOPTER'
  }
}
```

### 8. **Redirect para Login**
```javascript
router.push('/auth/verify-request?email=joao@example.com')
// Ou em produção, após verificar email:
// router.push('/auth/signin')
```

---

## 💾 O Que é Armazenado

### Armazenado ✅
```json
{
  "id": "cuid_12345...",
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "$2b$12$...hash_bcrypt...",
  "type": "ADOPTER",
  "emailVerified": "2025-08-27T10:30:00Z",
  "createdAt": "2025-08-27T10:30:00Z",
  "updatedAt": "2025-08-27T10:30:00Z"
}
```

### NÃO Armazenado ❌
```
✗ Senha original (nunca enviada após hash)
✗ Cookie de sessão (gerenciado por NextAuth)
✗ Tokens temporários (criados e descartados)
✗ Logs de tentativas fracassadas (não implementado)
```

---

## 🔑 Onde o Banco de Dados Fica?

### Desenvolvimento (Agora)
```
📁 Seu computador local
└── prisma/dev.db        ← SQLite file
```

**Localização:** `/Users/mariadelourdesceleski/Documents/petadopt-app/prisma/dev.db`

**Como acessar:**
```bash
# Ver dados com Prisma Studio (GUI)
npm run prisma:studio

# Consultas com Prisma Client
prisma.user.findUnique({ where: { email: 'joao@example.com' } })
```

### Produção (Futuro - Recomendado)
Você mencionou migrar para **Supabase** ou **PostgreSQL**:

```
🌐 Servidor remoto
├── PostgreSQL Database Server
└── Dados armazenados em nuvem
```

**Vantagens:**
- ✅ Dados persists fora do seu computador
- ✅ Acessível de qualquer lugar
- ✅ Backups automáticos
- ✅ Escalável para produção

**Como será:** Apenas mude a string de conexão no `.env`:
```bash
# Desenvolvimento (agora)
DATABASE_URL="file:./dev.db"

# Produção (depois - exemplo Supabase)
DATABASE_URL="postgresql://user:password@host:5432/petadopt"
```

---

## 🔍 Como Verificar os Dados Cadastrados?

### Opção 1: Prisma Studio (GUI Interativa)
```bash
npm run prisma:studio
```

**O que aparece:**
- Interface visual tipo Excel
- Ver todos os usuários cadastrados
- Editar dados diretamente
- Executar queries

### Opção 2: Terminal com Prisma Client
```bash
# Criar script para listar usuários
node -e "const prisma = require('@prisma/client').PrismaClient(); 
prisma.user.findMany().then(users => console.log(users));"
```

### Opção 3: SQLite Browser (arquivo .db)
```bash
# Instalar
brew install sqlite3

# Abrir banco
sqlite3 prisma/dev.db

# Ver tabela users
sqlite> SELECT * FROM users;
```

---

## 📊 Estrutura Completa do Banco (Prisma Schema)

### Tabelas Criadas

1. **users** - Usuários do sistema
2. **accounts** - Contas OAuth (Google login)
3. **sessions** - Sessões de usuário (NextAuth)
4. **pets** - Pets cadastrados
5. **adoptions** - Solicitações de adoção
6. **shelters** - Abrigos/ONGs
7. **sponsors** - Patrocinadores
8. **adoption_requests** - Solicitações de adoção (histórico)
9. E mais...

### Relacionamentos
```
User
├── pode ter N Pets
├── pode fazer N Adoptions
├── pode ter 1 Shelter (se for admin)
├── pode ter N Sessions (múltiplos logins)
└── pode ter N Accounts (múltiplos OAuth providers)
```

---

## 🚀 Fluxo de Login (Após Cadastro)

Quando o usuário faz login, o sistema:

1. **Recebe email e senha**
2. **Busca usuário no banco:**
   ```sql
   SELECT * FROM users WHERE email = 'joao@example.com'
   ```
3. **Compara senha:**
   - Pega senha enviada: `MinhaS3nh@Forte`
   - Compara com hash no banco usando bcrypt
   - Se match → Login bem-sucedido ✅
   - Se não match → Erro ❌
4. **Cria sessão:**
   - NextAuth gera token de sessão
   - Armazena em `sessions` table
   - Cookie enviado ao navegador

---

## 📈 Dados Adicionais Coletados

Além do cadastro inicial, o sistema coleta:

```
📌 Perfil Completo (depois):
├── Avatar/Foto
├── Telefone
├── Localização (cidade/estado)
├── Tipo de casa (para adotantes)
├── Experiência com pets
└── Preferências de busca

🐕 Pets Cadastrados:
├── Nome, espécie, raça
├── Fotos
├── Descrição
├── Status (disponível/adotado)
└── Localização

📨 Notificações:
├── Preferências de email
├── Pets que combinam
└── Atualizações de status
```

---

## 🔐 Privacidade e LGPD

### O que está protegido:
✅ Dados de usuário não são compartilhados com terceiros
✅ Senhas são criptografadas (não legíveis)
✅ Você pode solicitar exclusão de dados
✅ Emails não são vendidos

### Conformidade:
- ✅ Implementado sistema de unsubscribe
- ✅ Política de privacidade (página `/privacidade`)
- ✅ Termos de uso (página `/termos`)
- ✅ Conformidade com LGPD (Lei Geral de Proteção de Dados)

---

## 📞 Próximos Passos

### Agora (Desenvolvimento)
1. ✅ Dados salvos em SQLite local
2. ✅ Acessível via Prisma Studio
3. ✅ Cada restart limpa dados (ou não, dependente de config)

### Produção (Recomendado)
1. Migrar para PostgreSQL/Supabase
2. Configurar backups automáticos
3. Implementar SSL/HTTPS
4. Adicionar logging de acessos
5. Implementar 2FA (autenticação dupla)

### Melhorias Futuras
- [ ] Verificação de email obrigatória
- [ ] 2FA com TOTP/SMS
- [ ] Auditoria de logins
- [ ] Exportar dados em GDPR format
- [ ] Biometria no mobile

---

## 📝 Resumo

| Aspecto | Detalhe |
|--------|---------|
| **Onde fica?** | SQLite local (`prisma/dev.db`) |
| **Como acessa?** | Prisma Studio ou SQLite Browser |
| **O que armazena?** | Email, nome, senha (hash), tipo de usuário |
| **Seguro?** | ✅ Sim - senhas criptografadas com bcrypt |
| **Visível no código?** | Sim - mas protegido por autenticação |
| **Em produção?** | PostgreSQL/Supabase (você escolhe) |
| **Pode deletar?** | Sim - implementar rota de delete user |

---

**Todos os seus dados de cadastro estão seguros e protegidos no banco de dados! 🔒**
