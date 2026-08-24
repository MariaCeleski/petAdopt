#!/usr/bin/env node

/**
 * 🎯 GitHub Issues Creator for PetAdopt Tasks
 * 
 * Este script cria automaticamente Issues no GitHub baseadas nas tasks
 * definidas no Kanban, mantendo rastreabilidade completa.
 */

const fs = require('fs');
const path = require('path');

// Task definitions extracted from KANBAN.md
const tasks = [
  // FASE 1 - INFRAESTRUTURA
  {
    id: '2.3',
    title: 'Configuração do Banco e Migrations',
    phase: 'Infraestrutura',
    priority: 'Alta',
    estimate: '30min',
    description: 'Configurar conexão Prisma com pooling, executar migrations iniciais e criar seeds para desenvolvimento',
    requirements: ['REQ-2.1', 'REQ-12.3'],
    dependencies: ['Task 1'],
    acceptance: [
      'Configurar Prisma Client com pooling de conexões',
      'Executar migrations iniciais com sucesso',
      'Criar seeds para desenvolvimento',
      'Validar conexão com banco de dados'
    ],
    files: {
      create: [
        'prisma/migrations/ - Migrations do banco',
        'prisma/seed.js - Dados iniciais'
      ],
      modify: [
        'src/lib/prisma.js - Configuração de conexão'
      ]
    }
  },
  {
    id: '2.2',
    title: 'Teste Propriedade: Validação de Campos Obrigatórios',
    phase: 'Infraestrutura',
    priority: 'Média',
    estimate: '45min',
    description: 'Property 2: Pet Mandatory Fields Validation - Validar que pets não podem ser criados sem campos obrigatórios',
    requirements: ['REQ-2.2'],
    dependencies: ['Task 2.3'],
    propertyTest: 'Property 2: Pet Mandatory Fields Validation',
    acceptance: [
      'Implementar property test com fast-check',
      'Validar campos obrigatórios: name, species, breed, age, size, gender, description',
      'Testar com mínimo 100 iterações',
      'Validar rejeição quando campos faltam'
    ],
    files: {
      create: [
        'tests/properties/petValidation.test.js - Property tests'
      ]
    }
  },
  // FASE 2 - AUTENTICAÇÃO
  {
    id: '3.1',
    title: 'NextAuth.js Setup com Providers',
    phase: 'Autenticação',
    priority: 'Alta',
    estimate: '1h',
    description: 'Configurar NextAuth.js com CredentialsProvider e GoogleProvider, implementar PrismaAdapter e callbacks',
    requirements: ['REQ-1.1', 'REQ-1.2', 'REQ-1.6'],
    dependencies: ['Task 2.3'],
    acceptance: [
      'Implementar CredentialsProvider com validação de senha',
      'Configurar GoogleProvider para OAuth',
      'Configurar PrismaAdapter para sessões',
      'Implementar callbacks personalizados'
    ],
    files: {
      modify: [
        'src/lib/auth.js - Configuração NextAuth existente'
      ],
      create: [
        'src/app/api/auth/[...nextauth]/route.js - Handler NextAuth'
      ]
    }
  },
  {
    id: '3.2',
    title: 'Teste Propriedade: Validação de Senha',
    phase: 'Autenticação', 
    priority: 'Média',
    estimate: '30min',
    description: 'Property 1: Password Strength Validation - Validar que senhas com menos de 8 caracteres são rejeitadas',
    requirements: ['REQ-1.4'],
    dependencies: ['Task 3.1'],
    propertyTest: 'Property 1: Password Strength Validation',
    acceptance: [
      'Implementar property test para validação de senha',
      'Validar mínimo 8 caracteres obrigatório',
      'Testar com strings aleatórias',
      'Confirmar rejeição para senhas curtas'
    ],
    files: {
      create: [
        'tests/properties/authValidation.test.js - Property tests auth'
      ]
    }
  },
  // FASE 3 - UI COMPONENTS
  {
    id: '4.1',
    title: 'Componentes UI Base',
    phase: 'UI Components',
    priority: 'Alta',
    estimate: '2h',
    description: 'Estender Button e Input existentes, criar Select, Modal, Card, Badge, Avatar e LoadingSkeleton',
    requirements: ['REQ-9.1', 'REQ-9.2', 'REQ-9.4', 'REQ-9.6'],
    dependencies: ['Task 1'],
    acceptance: [
      'Estender componentes Button e Input existentes',
      'Criar componentes Select, Modal, Card, Badge, Avatar',
      'Implementar LoadingSkeleton e ErrorBoundary',
      'Configurar CSS Modules com design tokens'
    ],
    files: {
      create: [
        'src/components/ui/Select/ - Componente Select',
        'src/components/ui/Modal/ - Componente Modal',
        'src/components/ui/Card/ - Componente Card',
        'src/components/ui/Badge/ - Componente Badge',
        'src/components/ui/Avatar/ - Componente Avatar',
        'src/components/common/LoadingSkeleton/ - Loading states',
        'src/components/common/ErrorBoundary/ - Error handling'
      ],
      modify: [
        'src/components/ui/Button/ - Extensões do componente existente',
        'src/components/ui/Input/ - Extensões do componente existente'
      ]
    }
  },
  // FASE 4 - UPLOAD DE IMAGENS
  {
    id: '6.1',
    title: 'Serviço Cloudinary',
    phase: 'Upload de Imagens',
    priority: 'Alta',
    estimate: '1.5h',
    description: 'Configurar upload com Cloudinary, implementar otimização automática e geração de thumbnails',
    requirements: ['REQ-3.1', 'REQ-3.2', 'REQ-3.3', 'REQ-3.4', 'REQ-3.5'],
    dependencies: ['Task 5'],
    acceptance: [
      'Configurar upload com otimização automática',
      'Implementar geração de thumbnails e avatars',
      'Criar utility functions para upload e delete',
      'Implementar validação de formato e tamanho'
    ],
    files: {
      create: [
        'src/lib/upload/cloudinary.js - Configuração Cloudinary',
        'src/lib/upload/validation.js - Validação de arquivos'
      ]
    }
  },
  // FASE 5 - CRUD DE PETS
  {
    id: '7.1',
    title: 'Schemas de Validação Zod',
    phase: 'CRUD de Pets',
    priority: 'Alta', 
    estimate: '45min',
    description: 'Criar petSchema completo, implementar adoptionSchema e utility functions de sanitização',
    requirements: ['REQ-2.2', 'REQ-2.4', 'REQ-12.1'],
    dependencies: ['Task 6.5'],
    acceptance: [
      'Criar petSchema com todas as validações',
      'Implementar adoptionSchema com validação completa',
      'Criar utility functions para sanitização',
      'Validar todos os campos obrigatórios e opcionais'
    ],
    files: {
      modify: [
        'src/lib/validation/schemas.js - Adicionar schemas de pets'
      ]
    }
  }
];

// GitHub Issue template
function createIssueBody(task) {
  const dependenciesText = task.dependencies ? 
    task.dependencies.map(dep => `- [ ] ${dep}`).join('\n') : '- [ ] Nenhuma';
  
  const filesCreateText = task.files?.create ? 
    task.files.create.map(file => `- \`${file}\``).join('\n') : '- Nenhum arquivo novo';
    
  const filesModifyText = task.files?.modify ?
    task.files.modify.map(file => `- \`${file}\``).join('\n') : '- Nenhum arquivo modificado';

  const acceptanceText = task.acceptance.map(item => `- [ ] ${item}`).join('\n');
  
  const requirementsText = task.requirements.join(', ');

  const propertyTestSection = task.propertyTest ? `

### Property Tests
- [ ] **${task.propertyTest}**
- [ ] Implementado com fast-check
- [ ] Mínimo 100 iterações` : '';

  return `## 🎯 Task Information

**Task ID**: #${task.id}  
**Phase**: ${task.phase}  
**Priority**: ${task.priority}  
**Estimate**: ${task.estimate}

## 📋 Description

${task.description}

## ✅ Acceptance Criteria

${acceptanceText}

## 🔗 Dependencies

**Depends on**: 
${dependenciesText}

## 📚 Requirements Mapping

**Requirements**: ${requirementsText}  
**Design Section**: Seção correspondente no design document${propertyTestSection}

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
${filesCreateText}

**Modified Files**:
${filesModifyText}

## 🔍 Definition of Done

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Testes passando (unit + property + integration)
- [ ] ✅ Build executando sem erros
- [ ] ✅ Documentação atualizada
- [ ] ✅ Commit seguindo padrão: \`feat(task-${task.id}): ${task.title}\`
- [ ] ✅ Branch: \`feature/task-${task.id}-${task.title.toLowerCase().replace(/\s+/g, '-')}\`
- [ ] ✅ Requirements atendidos completamente
- [ ] ✅ Performance validada (se aplicável)
- [ ] ✅ Acessibilidade verificada (se aplicável)
- [ ] ✅ Responsividade testada (se aplicável)

## 📊 Task Context

**Kanban Status**: 📋 Planejado → 🔵 Próximo → 🟡 Em Progresso → 🟢 Concluído

**Branch Strategy**:
\`\`\`bash
git checkout -b feature/task-${task.id}-${task.title.toLowerCase().replace(/\s+/g, '-')}
# ... desenvolvimento ...
git commit -m "feat(task-${task.id}): ${task.title.toLowerCase()}"
git push origin feature/task-${task.id}-${task.title.toLowerCase().replace(/\s+/g, '-')}
# Criar PR para main
\`\`\`

---

**🤖 Desenvolvido com metodologia IA estruturada - PetAdopt Platform**`;
}

// Generate GitHub CLI commands
function generateGitHubIssues() {
  const commands = [];
  
  tasks.forEach(task => {
    const title = `Task ${task.id}: ${task.title}`;
    const body = createIssueBody(task).replace(/"/g, '\\"').replace(/`/g, '\\`');
    const labels = ['task', 'development', 'petadopt', task.phase.toLowerCase().replace(/\s+/g, '-')];
    
    const command = `gh issue create --title "${title}" --body "${body}" --label "${labels.join(',')}"`;
    commands.push({
      taskId: task.id,
      command: command
    });
  });
  
  return commands;
}

// Save commands to file
function saveCommandsToFile() {
  const commands = generateGitHubIssues();
  let scriptContent = `#!/bin/bash

# 🎯 PetAdopt GitHub Issues Creator
# Este script cria todas as Issues baseadas nas tasks do Kanban

echo "🚀 Criando Issues do GitHub para PetAdopt..."
echo "📋 Total de tasks: ${commands.length}"
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

`;

  commands.forEach((cmd, index) => {
    scriptContent += `# Task ${cmd.taskId}
echo "📝 Criando Issue para Task ${cmd.taskId}..."
${cmd.command}

if [ $? -eq 0 ]; then
    echo "✅ Issue criada com sucesso para Task ${cmd.taskId}"
else
    echo "❌ Erro ao criar Issue para Task ${cmd.taskId}"
fi
echo ""

`;
  });

  scriptContent += `echo "🎉 Processo concluído!"
echo "📊 Visualize as Issues em: https://github.com/MariaCeleski/petAdopt/issues"
echo "📋 Acompanhe o Kanban em: docs/KANBAN.md"
`;

  const scriptPath = path.join(__dirname, '..', 'create-issues.sh');
  fs.writeFileSync(scriptPath, scriptContent);
  
  // Make script executable
  const { execSync } = require('child_process');
  try {
    execSync(`chmod +x "${scriptPath}"`);
  } catch (error) {
    console.log('⚠️  Não foi possível tornar o script executável, execute manualmente: chmod +x create-issues.sh');
  }
  
  console.log('✅ Script create-issues.sh criado com sucesso!');
  console.log('📝 Execute: ./create-issues.sh');
}

// Individual issue files for manual creation
function createIndividualIssueFiles() {
  const issuesDir = path.join(__dirname, '..', '.github', 'issues');
  
  if (!fs.existsSync(issuesDir)) {
    fs.mkdirSync(issuesDir, { recursive: true });
  }
  
  tasks.forEach(task => {
    const fileName = `task-${task.id}-${task.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filePath = path.join(issuesDir, fileName);
    const content = `---
title: "Task ${task.id}: ${task.title}"
labels: ["task", "development", "petadopt", "${task.phase.toLowerCase().replace(/\s+/g, '-')}"]
assignees: []
---

${createIssueBody(task)}`;
    
    fs.writeFileSync(filePath, content);
  });
  
  console.log(`✅ ${tasks.length} arquivos de Issue criados em .github/issues/`);
}

// Main execution
if (require.main === module) {
  console.log('🎯 PetAdopt GitHub Issues Generator');
  console.log('=====================================');
  
  saveCommandsToFile();
  createIndividualIssueFiles();
  
  console.log('');
  console.log('📋 Próximos passos:');
  console.log('1. Execute: ./create-issues.sh (para criar todas as Issues)');
  console.log('2. Ou acesse .github/issues/ para Issues individuais');
  console.log('3. Configure GitHub CLI se necessário: gh auth login');
  console.log('4. Acompanhe progresso em: docs/KANBAN.md');
}

module.exports = { tasks, createIssueBody, generateGitHubIssues };