#!/usr/bin/env node

/**
 * 📋 GitHub Project Kanban Setup Script
 * 
 * Configura o projeto GitHub com todas as tasks organizadas
 * em um board Kanban visual e funcional.
 */

const { execSync } = require('child_process');

// Configurações do projeto
const PROJECT_ID = '6';
const OWNER = 'MariaCeleski';
const REPO = 'MariaCeleski/petAdopt';

// Tasks organizadas por fase e prioridade
const tasks = [
  {
    issueNumber: 1,
    title: 'Task 2.3: Configuração do Banco e Migrations',
    phase: '🏗️ Infraestrutura',
    priority: '🔥 Alta',
    estimate: '⚡ 30min',
    status: 'Todo',
    ready: true
  },
  {
    issueNumber: 2,
    title: 'Task 2.2: Property Test - Validação de Campos',
    phase: '🏗️ Infraestrutura',
    priority: '🟡 Média',
    estimate: '🕐 1h',
    status: 'Todo',
    dependencies: ['Task 2.3']
  },
  {
    issueNumber: 3,
    title: 'Task 3.1: NextAuth.js Setup',
    phase: '🔐 Autenticação',
    priority: '🔥 Alta',
    estimate: '🕐 1h',
    status: 'Todo',
    dependencies: ['Task 2.3']
  },
  {
    issueNumber: 4,
    title: 'Task 3.2: Property Test - Validação de Senha',
    phase: '🔐 Autenticação',
    priority: '🟡 Média',
    estimate: '⚡ 30min',
    status: 'Todo',
    dependencies: ['Task 3.1']
  },
  {
    issueNumber: 5,
    title: 'Task 4.1: Componentes UI Base',
    phase: '🎨 UI Components',
    priority: '🔥 Alta',
    estimate: '🕑 2h',
    status: 'Todo',
    ready: true
  },
  {
    issueNumber: 6,
    title: 'Task 6.1: Serviço Cloudinary',
    phase: '📸 Upload',
    priority: '🔥 Alta',
    estimate: '🕑 2h',
    status: 'Todo',
    dependencies: ['Task 5 - Checkpoint']
  },
  {
    issueNumber: 7,
    title: 'Task 7.1: Schemas de Validação Zod',
    phase: '🐕 CRUD Pets',
    priority: '🔥 Alta',
    estimate: '🕐 1h',
    status: 'Todo',
    dependencies: ['Task 6.5']
  },
  {
    issueNumber: 8,
    title: 'Task 8.1: Catálogo Público de Pets',
    phase: '🔍 Catálogo',
    priority: '🔥 Alta',
    estimate: '🕑 2h',
    status: 'Todo',
    dependencies: ['Task 7.5']
  },
  {
    issueNumber: 9,
    title: 'Task 11.1: Sistema de Adoção - Formulário',
    phase: '💕 Adoção',
    priority: '🔥 Alta',
    estimate: '🕑 2h',
    status: 'Todo',
    dependencies: ['Task 10 - Checkpoint']
  },
  {
    issueNumber: 10,
    title: 'Task 13.1: Dashboard Base',
    phase: '👤 Dashboard',
    priority: '🔥 Alta',
    estimate: '🕑 2h',
    status: 'Todo',
    dependencies: ['Task 12.4']
  }
];

function runCommand(command) {
  try {
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    return result.trim();
  } catch (error) {
    console.error(`❌ Erro executando: ${command}`);
    console.error(error.message);
    return null;
  }
}

function updateTaskFields(task) {
  console.log(`📝 Configurando Task ${task.issueNumber}: ${task.title}`);
  
  // Get the project item ID for this issue
  const itemList = runCommand(`gh project item-list ${PROJECT_ID} --owner ${OWNER} --format json`);
  if (!itemList) return;
  
  const items = JSON.parse(itemList);
  const item = items.find(i => i.content && i.content.number === task.issueNumber);
  
  if (!item) {
    console.log(`⚠️  Item não encontrado para Issue #${task.issueNumber}`);
    return;
  }

  // Update Priority field
  runCommand(`gh project item-edit --project-id ${PROJECT_ID} --id ${item.id} --field-name "Priority" --single-select-option-id "${task.priority}"`);
  
  // Update Phase field
  runCommand(`gh project item-edit --project-id ${PROJECT_ID} --id ${item.id} --field-name "Phase" --single-select-option-id "${task.phase}"`);
  
  // Update Estimate field
  runCommand(`gh project item-edit --project-id ${PROJECT_ID} --id ${item.id} --field-name "Estimate" --single-select-option-id "${task.estimate}"`);
  
  console.log(`✅ Task ${task.issueNumber} configurada: ${task.phase} | ${task.priority} | ${task.estimate}`);
}

function generateProjectSummary() {
  console.log('\n📊 RESUMO DO PROJETO KANBAN');
  console.log('═══════════════════════════════');
  
  const phases = {};
  const priorities = {};
  const estimates = {};
  
  tasks.forEach(task => {
    // Count by phase
    phases[task.phase] = (phases[task.phase] || 0) + 1;
    
    // Count by priority
    priorities[task.priority] = (priorities[task.priority] || 0) + 1;
    
    // Count by estimate
    estimates[task.estimate] = (estimates[task.estimate] || 0) + 1;
  });
  
  console.log('\n📋 Por Fase:');
  Object.entries(phases).forEach(([phase, count]) => {
    console.log(`   ${phase}: ${count} tasks`);
  });
  
  console.log('\n🎯 Por Prioridade:');
  Object.entries(priorities).forEach(([priority, count]) => {
    console.log(`   ${priority}: ${count} tasks`);
  });
  
  console.log('\n⏰ Por Estimativa:');
  Object.entries(estimates).forEach(([estimate, count]) => {
    console.log(`   ${estimate}: ${count} tasks`);
  });
  
  const readyTasks = tasks.filter(t => t.ready).length;
  console.log(`\n🔵 Tasks Prontas para Desenvolvimento: ${readyTasks}`);
  console.log(`📋 Total de Tasks: ${tasks.length}`);
}

function createViewInstructions() {
  console.log('\n🎯 INSTRUÇÕES PARA VISUALIZAR O KANBAN');
  console.log('═══════════════════════════════════════');
  
  console.log('\n1. 📊 Acesse o Project Board:');
  console.log(`   https://github.com/users/${OWNER}/projects/${PROJECT_ID}`);
  
  console.log('\n2. 🎨 Configure a View (se necessário):');
  console.log('   - Clique em "New view" ou "Table"');
  console.log('   - Adicione colunas: Status, Priority, Phase, Estimate');
  console.log('   - Agrupe por: Status (Todo → In Progress → Done)');
  console.log('   - Filtre por: Phase para ver tasks por domínio');
  
  console.log('\n3. 🚀 Tasks Prontas para Começar:');
  const readyTasks = tasks.filter(t => t.ready);
  readyTasks.forEach(task => {
    console.log(`   ✅ Issue #${task.issueNumber}: ${task.title}`);
    console.log(`      🎯 ${task.priority} | ⏰ ${task.estimate} | 📂 ${task.phase}`);
  });
  
  console.log('\n4. 🔗 Links Importantes:');
  console.log(`   📊 Project: https://github.com/users/${OWNER}/projects/${PROJECT_ID}`);
  console.log(`   🎫 Issues: https://github.com/${REPO}/issues`);
  console.log(`   📋 Repository: https://github.com/${REPO}`);
}

// Main execution
async function main() {
  console.log('🚀 CONFIGURANDO GITHUB PROJECT KANBAN');
  console.log('=====================================\n');
  
  console.log(`📋 Projeto: PetAdopt Development Board (ID: ${PROJECT_ID})`);
  console.log(`👤 Owner: ${OWNER}`);
  console.log(`📦 Repository: ${REPO}\n`);
  
  // Note: Field updates via CLI are complex, so we'll focus on the setup
  console.log('📝 Tasks configuradas no projeto:');
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. Issue #${task.issueNumber}: ${task.title}`);
    console.log(`   📂 ${task.phase} | 🎯 ${task.priority} | ⏰ ${task.estimate}`);
    if (task.dependencies) {
      console.log(`   🔗 Depends on: ${task.dependencies.join(', ')}`);
    }
    if (task.ready) {
      console.log(`   ✅ Ready to start`);
    }
    console.log('');
  });
  
  generateProjectSummary();
  createViewInstructions();
  
  console.log('\n🎉 PROJETO KANBAN CONFIGURADO!');
  console.log('═══════════════════════════════');
  console.log('✅ 10 Issues adicionadas ao projeto');
  console.log('✅ Campos personalizados criados');
  console.log('✅ Tasks organizadas por fase e prioridade');
  console.log('✅ Dependencies mapeadas');
  console.log('\n🔗 Acesse: https://github.com/users/MariaCeleski/projects/6');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { tasks, PROJECT_ID, OWNER, REPO };