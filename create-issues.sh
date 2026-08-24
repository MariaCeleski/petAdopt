#!/bin/bash

# 🎯 PetAdopt GitHub Issues Creator
# Este script cria todas as Issues baseadas nas tasks do Kanban

echo "🚀 Criando Issues do GitHub para PetAdopt..."
echo "📋 Total de tasks: 7"
echo ""

# Verificar se gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) não está instalado"
    echo "   Instale com: brew install gh"
    echo "   Ou visite: https://cli.github.com/"
    exit 1
fi

# Verificar se está autenticado
if ! gh auth status &> /dev/null; then
    echo "❌ Não está autenticado no GitHub CLI"
    echo "   Execute: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI configurado corretamente"
echo ""

# Task 2.3
echo "📝 Criando Issue para Task 2.3..."
gh issue create --title "Task 2.3: Configuração do Banco e Migrations" --body "## 🎯 Task Information

**Task ID**: #2.3  
**Phase**: Infraestrutura  
**Priority**: Alta  
**Estimate**: 30min

## 📋 Description

Configurar conexão Prisma com pooling, executar migrations iniciais e criar seeds para desenvolvimento

## ✅ Acceptance Criteria

- [ ] Configurar Prisma Client com pooling de conexões
- [ ] Executar migrations iniciais com sucesso
- [ ] Criar seeds para desenvolvimento
- [ ] Validar conexão com banco de dados

## 🔗 Dependencies

**Depends on**: 
- [ ] Task 1

## 📚 Requirements Mapping

**Requirements**: REQ-2.1, REQ-12.3  
**Design Section**: Seção correspondente no design document

## 🛠️ Implementation Checklist

- [ ] Análise dos requirements
- [ ] Review do design técnico  
- [ ] Implementação do código
- [ ] Testes unitários escritos
- [ ] Testes de propriedade (se aplicável)
- [ ] Documentação atualizada
- [ ] Build funcionando
- [ ] Code review interno

## 🧪 Testing Requirements

### Unit Tests
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Edge cases cobertos

## 📁 Files to Create/Modify

**New Files**:
- \`prisma/migrations/ - Migrations do banco\`
- \`prisma/seed.js - Dados iniciais\`

**Modified Files**:
- \`src/lib/prisma.js - Configuração de conexão\`

## 🔍 Definition of Done

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Testes passando (unit + property + integration)
- [ ] ✅ Build executando sem erros
- [ ] ✅ Documentação atualizada
- [ ] ✅ Commit seguindo padrão: \`feat(task-2.3): Configuração do Banco e Migrations\`
- [ ] ✅ Branch: \`feature/task-2.3-configuração-do-banco-e-migrations\`
- [ ] ✅ Requirements atendidos completamente
- [ ] ✅ Performance validada (se aplicável)
- [ ] ✅ Acessibilidade verificada (se aplicável)
- [ ] ✅ Responsividade testada (se aplicável)

## 📊 Task Context

**Kanban Status**: 📋 Planejado → 🔵 Próximo → 🟡 Em Progresso → 🟢 Concluído

**Branch Strategy**:
\`\`\`bash
git checkout -b feature/task-2.3-configuração-do-banco-e-migrations
# ... desenvolvimento ...
git commit -m \"feat(task-2.3): configuração do banco e migrations\"
git push origin feature/task-2.3-configuração-do-banco-e-migrations
# Criar PR para main
\`\`\`

---

**🤖 Desenvolvido com metodologia IA estruturada - PetAdopt Platform**" --label "task,development,petadopt,infraestrutura"

if [ $? -eq 0 ]; then
    echo "✅ Issue criada com sucesso para Task 2.3"
else
    echo "❌ Erro ao criar Issue para Task 2.3"
fi
echo ""

# Task 2.2
echo "📝 Criando Issue para Task 2.2..."
gh issue create --title "Task 2.2: Teste Propriedade: Validação de Campos Obrigatórios" --body "## 🎯 Task Information

**Task ID**: #2.2  
**Phase**: Infraestrutura  
**Priority**: Média  
**Estimate**: 45min

## 📋 Description

Property 2: Pet Mandatory Fields Validation - Validar que pets não podem ser criados sem campos obrigatórios

## ✅ Acceptance Criteria

- [ ] Implementar property test com fast-check
- [ ] Validar campos obrigatórios: name, species, breed, age, size, gender, description
- [ ] Testar com mínimo 100 iterações
- [ ] Validar rejeição quando campos faltam

## 🔗 Dependencies

**Depends on**: 
- [ ] Task 2.3

## 📚 Requirements Mapping

**Requirements**: REQ-2.2  
**Design Section**: Seção correspondente no design document

### Property Tests
- [ ] **Property 2: Pet Mandatory Fields Validation**
- [ ] Implementado com fast-check
- [ ] Mínimo 100 iterações

## 🛠️ Implementation Checklist

- [ ] Análise dos requirements
- [ ] Review do design técnico  
- [ ] Implementação do código
- [ ] Testes unitários escritos
- [ ] Testes de propriedade (se aplicável)
- [ ] Documentação atualizada
- [ ] Build funcionando
- [ ] Code review interno

## 🧪 Testing Requirements

### Unit Tests
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Edge cases cobertos

## 📁 Files to Create/Modify

**New Files**:
- \`tests/properties/petValidation.test.js - Property tests\`

**Modified Files**:
- Nenhum arquivo modificado

## 🔍 Definition of Done

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Testes passando (unit + property + integration)
- [ ] ✅ Build executando sem erros
- [ ] ✅ Documentação atualizada
- [ ] ✅ Commit seguindo padrão: \`feat(task-2.2): Teste Propriedade: Validação de Campos Obrigatórios\`
- [ ] ✅ Branch: \`feature/task-2.2-teste-propriedade:-validação-de-campos-obrigatórios\`
- [ ] ✅ Requirements atendidos completamente
- [ ] ✅ Performance validada (se aplicável)
- [ ] ✅ Acessibilidade verificada (se aplicável)
- [ ] ✅ Responsividade testada (se aplicável)

## 📊 Task Context

**Kanban Status**: 📋 Planejado → 🔵 Próximo → 🟡 Em Progresso → 🟢 Concluído

**Branch Strategy**:
\`\`\`bash
git checkout -b feature/task-2.2-teste-propriedade:-validação-de-campos-obrigatórios
# ... desenvolvimento ...
git commit -m \"feat(task-2.2): teste propriedade: validação de campos obrigatórios\"
git push origin feature/task-2.2-teste-propriedade:-validação-de-campos-obrigatórios
# Criar PR para main
\`\`\`

---

**🤖 Desenvolvido com metodologia IA estruturada - PetAdopt Platform**" --label "task,development,petadopt,infraestrutura"

if [ $? -eq 0 ]; then
    echo "✅ Issue criada com sucesso para Task 2.2"
else
    echo "❌ Erro ao criar Issue para Task 2.2"
fi
echo ""

# Task 3.1
echo "📝 Criando Issue para Task 3.1..."
gh issue create --title "Task 3.1: NextAuth.js Setup com Providers" --body "## 🎯 Task Information

**Task ID**: #3.1  
**Phase**: Autenticação  
**Priority**: Alta  
**Estimate**: 1h

## 📋 Description

Configurar NextAuth.js com CredentialsProvider e GoogleProvider, implementar PrismaAdapter e callbacks

## ✅ Acceptance Criteria

- [ ] Implementar CredentialsProvider com validação de senha
- [ ] Configurar GoogleProvider para OAuth
- [ ] Configurar PrismaAdapter para sessões
- [ ] Implementar callbacks personalizados

## 🔗 Dependencies

**Depends on**: 
- [ ] Task 2.3

## 📚 Requirements Mapping

**Requirements**: REQ-1.1, REQ-1.2, REQ-1.6  
**Design Section**: Seção correspondente no design document

## 🛠️ Implementation Checklist

- [ ] Análise dos requirements
- [ ] Review do design técnico  
- [ ] Implementação do código
- [ ] Testes unitários escritos
- [ ] Testes de propriedade (se aplicável)
- [ ] Documentação atualizada
- [ ] Build funcionando
- [ ] Code review interno

## 🧪 Testing Requirements

### Unit Tests
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Edge cases cobertos

## 📁 Files to Create/Modify

**New Files**:
- \`src/app/api/auth/[...nextauth]/route.js - Handler NextAuth\`

**Modified Files**:
- \`src/lib/auth.js - Configuração NextAuth existente\`

## 🔍 Definition of Done

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Testes passando (unit + property + integration)
- [ ] ✅ Build executando sem erros
- [ ] ✅ Documentação atualizada
- [ ] ✅ Commit seguindo padrão: \`feat(task-3.1): NextAuth.js Setup com Providers\`
- [ ] ✅ Branch: \`feature/task-3.1-nextauth.js-setup-com-providers\`
- [ ] ✅ Requirements atendidos completamente
- [ ] ✅ Performance validada (se aplicável)
- [ ] ✅ Acessibilidade verificada (se aplicável)
- [ ] ✅ Responsividade testada (se aplicável)

## 📊 Task Context

**Kanban Status**: 📋 Planejado → 🔵 Próximo → 🟡 Em Progresso → 🟢 Concluído

**Branch Strategy**:
\`\`\`bash
git checkout -b feature/task-3.1-nextauth.js-setup-com-providers
# ... desenvolvimento ...
git commit -m \"feat(task-3.1): nextauth.js setup com providers\"
git push origin feature/task-3.1-nextauth.js-setup-com-providers
# Criar PR para main
\`\`\`

---

**🤖 Desenvolvido com metodologia IA estruturada - PetAdopt Platform**" --label "task,development,petadopt,autenticação"

if [ $? -eq 0 ]; then
    echo "✅ Issue criada com sucesso para Task 3.1"
else
    echo "❌ Erro ao criar Issue para Task 3.1"
fi
echo ""

# Task 3.2
echo "📝 Criando Issue para Task 3.2..."
gh issue create --title "Task 3.2: Teste Propriedade: Validação de Senha" --body "## 🎯 Task Information

**Task ID**: #3.2  
**Phase**: Autenticação  
**Priority**: Média  
**Estimate**: 30min

## 📋 Description

Property 1: Password Strength Validation - Validar que senhas com menos de 8 caracteres são rejeitadas

## ✅ Acceptance Criteria

- [ ] Implementar property test para validação de senha
- [ ] Validar mínimo 8 caracteres obrigatório
- [ ] Testar com strings aleatórias
- [ ] Confirmar rejeição para senhas curtas

## 🔗 Dependencies

**Depends on**: 
- [ ] Task 3.1

## 📚 Requirements Mapping

**Requirements**: REQ-1.4  
**Design Section**: Seção correspondente no design document

### Property Tests
- [ ] **Property 1: Password Strength Validation**
- [ ] Implementado com fast-check
- [ ] Mínimo 100 iterações

## 🛠️ Implementation Checklist

- [ ] Análise dos requirements
- [ ] Review do design técnico  
- [ ] Implementação do código
- [ ] Testes unitários escritos
- [ ] Testes de propriedade (se aplicável)
- [ ] Documentação atualizada
- [ ] Build funcionando
- [ ] Code review interno

## 🧪 Testing Requirements

### Unit Tests
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Edge cases cobertos

## 📁 Files to Create/Modify

**New Files**:
- \`tests/properties/authValidation.test.js - Property tests auth\`

**Modified Files**:
- Nenhum arquivo modificado

## 🔍 Definition of Done

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Testes passando (unit + property + integration)
- [ ] ✅ Build executando sem erros
- [ ] ✅ Documentação atualizada
- [ ] ✅ Commit seguindo padrão: \`feat(task-3.2): Teste Propriedade: Validação de Senha\`
- [ ] ✅ Branch: \`feature/task-3.2-teste-propriedade:-validação-de-senha\`
- [ ] ✅ Requirements atendidos completamente
- [ ] ✅ Performance validada (se aplicável)
- [ ] ✅ Acessibilidade verificada (se aplicável)
- [ ] ✅ Responsividade testada (se aplicável)

## 📊 Task Context

**Kanban Status**: 📋 Planejado → 🔵 Próximo → 🟡 Em Progresso → 🟢 Concluído

**Branch Strategy**:
\`\`\`bash
git checkout -b feature/task-3.2-teste-propriedade:-validação-de-senha
# ... desenvolvimento ...
git commit -m \"feat(task-3.2): teste propriedade: validação de senha\"
git push origin feature/task-3.2-teste-propriedade:-validação-de-senha
# Criar PR para main
\`\`\`

---

**🤖 Desenvolvido com metodologia IA estruturada - PetAdopt Platform**" --label "task,development,petadopt,autenticação"

if [ $? -eq 0 ]; then
    echo "✅ Issue criada com sucesso para Task 3.2"
else
    echo "❌ Erro ao criar Issue para Task 3.2"
fi
echo ""

# Task 4.1
echo "📝 Criando Issue para Task 4.1..."
gh issue create --title "Task 4.1: Componentes UI Base" --body "## 🎯 Task Information

**Task ID**: #4.1  
**Phase**: UI Components  
**Priority**: Alta  
**Estimate**: 2h

## 📋 Description

Estender Button e Input existentes, criar Select, Modal, Card, Badge, Avatar e LoadingSkeleton

## ✅ Acceptance Criteria

- [ ] Estender componentes Button e Input existentes
- [ ] Criar componentes Select, Modal, Card, Badge, Avatar
- [ ] Implementar LoadingSkeleton e ErrorBoundary
- [ ] Configurar CSS Modules com design tokens

## 🔗 Dependencies

**Depends on**: 
- [ ] Task 1

## 📚 Requirements Mapping

**Requirements**: REQ-9.1, REQ-9.2, REQ-9.4, REQ-9.6  
**Design Section**: Seção correspondente no design document

## 🛠️ Implementation Checklist

- [ ] Análise dos requirements
- [ ] Review do design técnico  
- [ ] Implementação do código
- [ ] Testes unitários escritos
- [ ] Testes de propriedade (se aplicável)
- [ ] Documentação atualizada
- [ ] Build funcionando
- [ ] Code review interno

## 🧪 Testing Requirements

### Unit Tests
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Edge cases cobertos

## 📁 Files to Create/Modify

**New Files**:
- \`src/components/ui/Select/ - Componente Select\`
- \`src/components/ui/Modal/ - Componente Modal\`
- \`src/components/ui/Card/ - Componente Card\`
- \`src/components/ui/Badge/ - Componente Badge\`
- \`src/components/ui/Avatar/ - Componente Avatar\`
- \`src/components/common/LoadingSkeleton/ - Loading states\`
- \`src/components/common/ErrorBoundary/ - Error handling\`

**Modified Files**:
- \`src/components/ui/Button/ - Extensões do componente existente\`
- \`src/components/ui/Input/ - Extensões do componente existente\`

## 🔍 Definition of Done

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Testes passando (unit + property + integration)
- [ ] ✅ Build executando sem erros
- [ ] ✅ Documentação atualizada
- [ ] ✅ Commit seguindo padrão: \`feat(task-4.1): Componentes UI Base\`
- [ ] ✅ Branch: \`feature/task-4.1-componentes-ui-base\`
- [ ] ✅ Requirements atendidos completamente
- [ ] ✅ Performance validada (se aplicável)
- [ ] ✅ Acessibilidade verificada (se aplicável)
- [ ] ✅ Responsividade testada (se aplicável)

## 📊 Task Context

**Kanban Status**: 📋 Planejado → 🔵 Próximo → 🟡 Em Progresso → 🟢 Concluído

**Branch Strategy**:
\`\`\`bash
git checkout -b feature/task-4.1-componentes-ui-base
# ... desenvolvimento ...
git commit -m \"feat(task-4.1): componentes ui base\"
git push origin feature/task-4.1-componentes-ui-base
# Criar PR para main
\`\`\`

---

**🤖 Desenvolvido com metodologia IA estruturada - PetAdopt Platform**" --label "task,development,petadopt,ui-components"

if [ $? -eq 0 ]; then
    echo "✅ Issue criada com sucesso para Task 4.1"
else
    echo "❌ Erro ao criar Issue para Task 4.1"
fi
echo ""

# Task 6.1
echo "📝 Criando Issue para Task 6.1..."
gh issue create --title "Task 6.1: Serviço Cloudinary" --body "## 🎯 Task Information

**Task ID**: #6.1  
**Phase**: Upload de Imagens  
**Priority**: Alta  
**Estimate**: 1.5h

## 📋 Description

Configurar upload com Cloudinary, implementar otimização automática e geração de thumbnails

## ✅ Acceptance Criteria

- [ ] Configurar upload com otimização automática
- [ ] Implementar geração de thumbnails e avatars
- [ ] Criar utility functions para upload e delete
- [ ] Implementar validação de formato e tamanho

## 🔗 Dependencies

**Depends on**: 
- [ ] Task 5

## 📚 Requirements Mapping

**Requirements**: REQ-3.1, REQ-3.2, REQ-3.3, REQ-3.4, REQ-3.5  
**Design Section**: Seção correspondente no design document

## 🛠️ Implementation Checklist

- [ ] Análise dos requirements
- [ ] Review do design técnico  
- [ ] Implementação do código
- [ ] Testes unitários escritos
- [ ] Testes de propriedade (se aplicável)
- [ ] Documentação atualizada
- [ ] Build funcionando
- [ ] Code review interno

## 🧪 Testing Requirements

### Unit Tests
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Edge cases cobertos

## 📁 Files to Create/Modify

**New Files**:
- \`src/lib/upload/cloudinary.js - Configuração Cloudinary\`
- \`src/lib/upload/validation.js - Validação de arquivos\`

**Modified Files**:
- Nenhum arquivo modificado

## 🔍 Definition of Done

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Testes passando (unit + property + integration)
- [ ] ✅ Build executando sem erros
- [ ] ✅ Documentação atualizada
- [ ] ✅ Commit seguindo padrão: \`feat(task-6.1): Serviço Cloudinary\`
- [ ] ✅ Branch: \`feature/task-6.1-serviço-cloudinary\`
- [ ] ✅ Requirements atendidos completamente
- [ ] ✅ Performance validada (se aplicável)
- [ ] ✅ Acessibilidade verificada (se aplicável)
- [ ] ✅ Responsividade testada (se aplicável)

## 📊 Task Context

**Kanban Status**: 📋 Planejado → 🔵 Próximo → 🟡 Em Progresso → 🟢 Concluído

**Branch Strategy**:
\`\`\`bash
git checkout -b feature/task-6.1-serviço-cloudinary
# ... desenvolvimento ...
git commit -m \"feat(task-6.1): serviço cloudinary\"
git push origin feature/task-6.1-serviço-cloudinary
# Criar PR para main
\`\`\`

---

**🤖 Desenvolvido com metodologia IA estruturada - PetAdopt Platform**" --label "task,development,petadopt,upload-de-imagens"

if [ $? -eq 0 ]; then
    echo "✅ Issue criada com sucesso para Task 6.1"
else
    echo "❌ Erro ao criar Issue para Task 6.1"
fi
echo ""

# Task 7.1
echo "📝 Criando Issue para Task 7.1..."
gh issue create --title "Task 7.1: Schemas de Validação Zod" --body "## 🎯 Task Information

**Task ID**: #7.1  
**Phase**: CRUD de Pets  
**Priority**: Alta  
**Estimate**: 45min

## 📋 Description

Criar petSchema completo, implementar adoptionSchema e utility functions de sanitização

## ✅ Acceptance Criteria

- [ ] Criar petSchema com todas as validações
- [ ] Implementar adoptionSchema com validação completa
- [ ] Criar utility functions para sanitização
- [ ] Validar todos os campos obrigatórios e opcionais

## 🔗 Dependencies

**Depends on**: 
- [ ] Task 6.5

## 📚 Requirements Mapping

**Requirements**: REQ-2.2, REQ-2.4, REQ-12.1  
**Design Section**: Seção correspondente no design document

## 🛠️ Implementation Checklist

- [ ] Análise dos requirements
- [ ] Review do design técnico  
- [ ] Implementação do código
- [ ] Testes unitários escritos
- [ ] Testes de propriedade (se aplicável)
- [ ] Documentação atualizada
- [ ] Build funcionando
- [ ] Code review interno

## 🧪 Testing Requirements

### Unit Tests
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Edge cases cobertos

## 📁 Files to Create/Modify

**New Files**:
- Nenhum arquivo novo

**Modified Files**:
- \`src/lib/validation/schemas.js - Adicionar schemas de pets\`

## 🔍 Definition of Done

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Testes passando (unit + property + integration)
- [ ] ✅ Build executando sem erros
- [ ] ✅ Documentação atualizada
- [ ] ✅ Commit seguindo padrão: \`feat(task-7.1): Schemas de Validação Zod\`
- [ ] ✅ Branch: \`feature/task-7.1-schemas-de-validação-zod\`
- [ ] ✅ Requirements atendidos completamente
- [ ] ✅ Performance validada (se aplicável)
- [ ] ✅ Acessibilidade verificada (se aplicável)
- [ ] ✅ Responsividade testada (se aplicável)

## 📊 Task Context

**Kanban Status**: 📋 Planejado → 🔵 Próximo → 🟡 Em Progresso → 🟢 Concluído

**Branch Strategy**:
\`\`\`bash
git checkout -b feature/task-7.1-schemas-de-validação-zod
# ... desenvolvimento ...
git commit -m \"feat(task-7.1): schemas de validação zod\"
git push origin feature/task-7.1-schemas-de-validação-zod
# Criar PR para main
\`\`\`

---

**🤖 Desenvolvido com metodologia IA estruturada - PetAdopt Platform**" --label "task,development,petadopt,crud-de-pets"

if [ $? -eq 0 ]; then
    echo "✅ Issue criada com sucesso para Task 7.1"
else
    echo "❌ Erro ao criar Issue para Task 7.1"
fi
echo ""

echo "🎉 Processo concluído!"
echo "📊 Visualize as Issues em: https://github.com/MariaCeleski/petAdopt/issues"
echo "📋 Acompanhe o Kanban em: docs/KANBAN.md"
