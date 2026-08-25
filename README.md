# 🐾 PetAdopt - Plataforma de Adoção de Pets

Plataforma moderna para conectar pets disponíveis para adoção com famílias interessadas. Desenvolvida com Next.js 16, React 19, Prisma e NextAuth.js.

## 🎯 Links Importantes

### 📋 **Kanban & Gerenciamento de Tasks**
- 🎯 **[Kanban Principal (Projeto #7)](https://github.com/users/MariaCeleski/projects/7)** - Task Management Oficial
- 📊 **[Kanban Alternativo (Projeto #6)](https://github.com/users/MariaCeleski/projects/6)** - PetAdopt Development Board  
- 📄 **[Kanban Local](./docs/KANBAN.md)** - Versão markdown com detalhes completos

### 🚀 **Status do Projeto**
- ✅ **12/81 tasks concluídas** (14.8%)
- 🏗️ **MVP Core**: 47% implementado
- 📈 **Próximo Milestone**: Checkpoint Core (Task 10)

### 🔗 **Acesso Rápido aos Kanbans**

#### Opção 1 - Projeto Personal (Recomendado):
```
https://github.com/users/MariaCeleski/projects/7
```

#### Opção 2 - Development Board:
```
https://github.com/users/MariaCeleski/projects/6
```

#### Opção 3 - Via Perfil GitHub:
1. Acesse: https://github.com/MariaCeleski
2. Clique na aba **"Projects"**
3. Selecione **"PetAdopt - Task Management"**

---

## 🏗️ **Arquitetura do Projeto**

- **Frontend**: Next.js 16.x + React 19.x + CSS Modules
- **Backend**: API Routes + Prisma ORM + SQLite
- **Autenticação**: NextAuth.js (Credentials + Google OAuth)
- **Upload**: Cloudinary com otimização automática
- **Validação**: Zod schemas com sanitização
- **Testes**: Jest + Testing Library + Playwright (E2E)
- **CI/CD**: GitHub Actions com 6 workflows

## ✅ **Tasks Implementadas**

### 🏗️ **Infraestrutura**
- ✅ Setup completo do projeto Next.js 16.x
- ✅ Schema Prisma com todos os models
- ✅ Configuração de banco com pooling

### 🔐 **Autenticação**  
- ✅ NextAuth.js configurado (Credentials + Google)
- ✅ Páginas de login, registro e reset de senha
- ✅ Correções de hidratação SSR

### 🎨 **Componentes UI**
- ✅ Sistema completo de componentes (Button, Input, Select, Modal, etc.)
- ✅ Layout responsivo com Navigation e Sidebar
- ✅ Design system com CSS Modules

### 📸 **Upload de Imagens**
- ✅ Integração Cloudinary com otimização
- ✅ API route /api/upload com rate limiting
- ✅ Validação de formato e tamanho

### 🐕 **CRUD de Pets**
- ✅ Schemas Zod completos para validação
- ✅ API routes /api/pets (GET, POST, PATCH, DELETE)
- 🔄 Componentes de gerenciamento (em progresso)

## 🚀 **Próximas Tasks**

### 📋 **Issues Criadas no GitHub:**
- **[Issue #11](https://github.com/MariaCeleski/petAdopt/issues/11)** - Task 7.4: Componentes pet management
- **[Issue #12](https://github.com/MariaCeleski/petAdopt/issues/12)** - Task 8.1: Página catálogo público
- **[Issue #13](https://github.com/MariaCeleski/petAdopt/issues/13)** - Task 9.1: Página detalhes pet

### 🎯 **Roadmap**
1. **Componentes Pet Management** (Task 7.4)
2. **Catálogo Público** (Task 8.1) 
3. **Página Detalhes** (Task 9.1)
4. **Sistema de Adoção** (Tasks 11.x)
5. **Notificações por Email** (Tasks 12.x)

---

## 🛠️ **Como Contribuir**

1. **Visualize as tasks**: Acesse o [Kanban](https://github.com/users/MariaCeleski/projects/7)
2. **Escolha uma issue**: Issues com label `good first issue`
3. **Crie uma branch**: `git checkout -b feature/task-X`
4. **Implemente**: Siga os padrões do projeto
5. **Teste**: Execute `npm run test`
6. **Commit**: Use padrão `feat(task-X): descrição`
7. **Pull Request**: Referencie a issue correspondente

## 📊 **Scripts Disponíveis**

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção  
npm run test         # Executar testes
npm run lint         # Linter ESLint
npm run db:push      # Sincronizar schema Prisma
npm run db:studio    # Interface visual do banco
```

---

## 📞 **Suporte**

- 🐛 **Issues**: [GitHub Issues](https://github.com/MariaCeleski/petAdopt/issues)
- 📋 **Tasks**: [Kanban Board](https://github.com/users/MariaCeleski/projects/7)
- 📖 **Documentação**: [docs/](./docs/)

---

**🐾 Desenvolvido com ❤️ para conectar pets e famílias**