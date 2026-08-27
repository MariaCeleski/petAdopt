# Guia Completo de Testes E2E - PetAdopt Platform

## Overview

Este documento descreve a configuração e execução dos testes E2E (End-to-End) para a plataforma PetAdopt usando Playwright.

## Estrutura de Testes E2E

```
e2e/
├── fixtures/
│   ├── auth.fixture.js          # Fixtures para autenticação
│   ├── pet.fixture.js           # Fixtures para gerenciamento de pets
│   ├── adoption.fixture.js      # Fixtures para fluxo de adoção
│   └── index.js                 # Consolidação de todas as fixtures
├── helpers/
│   ├── test-data.js             # Geração de dados de teste
│   └── a11y.js                  # Helpers de acessibilidade
├── specs/
│   ├── authentication.spec.js   # Testes de autenticação
│   ├── pet-management.spec.js   # Testes de gerenciamento de pets
│   ├── adoption-workflow.spec.js # Testes de fluxo de adoção
│   ├── dashboard.spec.js        # Testes de dashboard
│   └── responsiveness.spec.js   # Testes de responsividade e mobile
└── playwright.config.js         # Configuração do Playwright
```

## Instalação

Os testes E2E já têm Playwright instalado. Para instalar ou atualizar:

```bash
npm install -D @playwright/test
```

## Execução dos Testes

### Rodar todos os testes
```bash
npm run test:e2e
```

### Rodar com UI interativa
```bash
npm run test:e2e:ui
```

### Rodar em modo debug
```bash
npm run test:e2e:debug
```

### Rodar em modo headless (padrão) ou headed (com browser visível)
```bash
npm run test:e2e           # Headless
npm run test:e2e:headed    # Com browser visível
```

### Rodar testes específicos
```bash
npx playwright test authentication.spec.js
npx playwright test pet-management.spec.js
npx playwright test adoption-workflow.spec.js
npx playwright test dashboard.spec.js
npx playwright test responsiveness.spec.js
```

### Rodar para um browser específico
```bash
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
npm run test:e2e:mobile
```

### Ver relatório de testes
```bash
npm run test:e2e:report
```

## Configuração

O arquivo `playwright.config.js` define:

- **Diretório de testes**: `./e2e`
- **Timeout padrão**: 30 segundos por teste
- **Navegadores**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari, iPad
- **Base URL**: http://localhost:3000
- **Reporter**: HTML, JSON, JUnit, List

### Variáveis de Ambiente

```bash
# URL base para testes (padrão: http://localhost:3000)
BASE_URL=http://localhost:3000

# CI mode
CI=true
```

## Fixtures Disponíveis

### Auth Fixture (autenticação)

```javascript
import { authFixture } from '../fixtures/auth.fixture.js';

test('exemplo', authFixture(async ({ authHelper, authenticatedPage }) => {
  await authHelper.login('email@example.com', 'password');
  // ou
  // await authenticatedPage.goto('/dashboard');
}));
```

**Helpers disponíveis:**
- `authHelper.login(email, password)`
- `authHelper.register(userData)`
- `authHelper.logout()`
- `authHelper.createTestUser(email, password, userType)`
- `authHelper.deleteTestUser(userId)`

**Fixtures pré-autenticadas:**
- `authenticatedPage`: Usuário adotante
- `petOwnerPage`: Usuário proprietário de pet
- `adopterPage`: Usuário adotante
- `shelterAdminPage`: Administrador de abrigo

### Pet Fixture (gerenciamento de pets)

```javascript
import { petFixture } from '../fixtures/pet.fixture.js';

test('exemplo', petFixture(async ({ petHelper, testPetCreated }) => {
  await petHelper.createPet({
    name: 'Max',
    species: 'DOG',
    breed: 'Labrador',
    // ...
  });
}));
```

**Helpers disponíveis:**
- `petHelper.createPet(petData)`
- `petHelper.editPet(petName, updates)`
- `petHelper.deletePet(petName)`
- `petHelper.updatePetStatus(petName, status)`
- `petHelper.searchPet(searchTerm)`
- `petHelper.filterBySpecies(species)`
- `petHelper.filterBySize(size)`
- `petHelper.getPetsVisible()`
- `petHelper.viewPetDetails(petName)`
- `petHelper.createTestPet()` - Cria pet com dados aleatórios

### Adoption Fixture (fluxo de adoção)

```javascript
import { adoptionFixture } from '../fixtures/adoption.fixture.js';

test('exemplo', adoptionFixture(async ({ adoptionHelper }) => {
  await adoptionHelper.expressInterest('petName');
  await adoptionHelper.fillAdoptionForm(adopterInfo);
  await adoptionHelper.submitAdoptionForm();
}));
```

**Helpers disponíveis:**
- `adoptionHelper.expressInterest(petName)`
- `adoptionHelper.fillAdoptionForm(adopterInfo)`
- `adoptionHelper.submitAdoptionForm()`
- `adoptionHelper.adoptPet(petName, adopterInfo)`
- `adoptionHelper.reviewAdoptionRequests()`
- `adoptionHelper.approveAdoptionRequest(index)`
- `adoptionHelper.rejectAdoptionRequest(index, reason)`
- `adoptionHelper.getAdoptionRequestStatus(index)`
- `adoptionHelper.verifyAdoptionCompleted(petName)`

## Funções de Teste Disponíveis

### test-data.js

```javascript
import {
  generateTestEmail,
  generateTestUser,
  generateTestPet,
  generateAdopterInfo,
  generateShelterInfo,
  TEST_DATA,
  waitForElement,
  closeModals,
  pageContainsText,
  takeScreenshot,
  waitForElementStable
} from '../helpers/test-data.js';
```

### a11y.js (Acessibilidade e Responsividade)

```javascript
import {
  isKeyboardAccessible,
  navigateWithKeyboard,
  getFocusOrder,
  checkColorContrast,
  checkHeadingHierarchy,
  checkImageAltText,
  checkFormLabels,
  getResponsiveViewports,
  isTouchFriendly,
  hasNoHorizontalScroll,
  isFullyInViewport
} from '../helpers/a11y.js';
```

## Suites de Testes

### 1. Authentication (autenticação.spec.js)

Testa:
- Registro de novo usuário ✓
- Login com credenciais válidas ✓
- Rejeição de credenciais inválidas ✓
- Validação de força de senha ✓
- Logout ✓
- Redirecionamento de páginas protegidas ✓
- Persistência de sessão ✓

### 2. Pet Management (pet-management.spec.js)

Testa:
- Criação de pet com campos obrigatórios ✓
- Validação de campos obrigatórios ✓
- Edição de informações do pet ✓
- Mudança de status do pet ✓
- Campos opcionais ✓
- Visibilidade no catálogo público ✓

### 3. Adoption Workflow (adoption-workflow.spec.js)

Testa:
- Manifestar interesse em pet ✓
- Preenchimento de formulário de adoção ✓
- Revisão e aprovação de adoção ✓
- Rejeição de adoção com motivo ✓

### 4. Dashboard (dashboard.spec.js)

Testa:
- Dashboard do adotante ✓
- Seção de favoritos ✓
- Seção de solicitações de adoção ✓
- Edição de perfil ✓
- Estatísticas de atividade ✓
- Dashboard do proprietário ✓
- Dashboard do administrador ✓

### 5. Responsiveness (responsiveness.spec.js)

Testa:
- Layouts em 5 viewports (mobile, tablet, desktop, etc.) ✓
- Navegação touch-friendly ✓
- Scroll vertical ✓
- Sem scroll horizontal ✓
- Imagens otimizadas ✓
- Interações em mobile ✓
- Sidebar navigation em mobile ✓

## Boas Práticas

### 1. Escrita de Testes

```javascript
import { test, expect } from '@playwright/test';

test('descrição clara do que está sendo testado', async ({ page }) => {
  // Arrange - Preparar dados
  const testUser = generateTestUser('ADOPTER');
  
  // Act - Realizar ações
  await page.goto('/login');
  await page.fill('input[name="email"]', testUser.email);
  
  // Assert - Verificar resultados
  await expect(page).toHaveURL(/\/dashboard/);
});
```

### 2. Seletores

Ordem de preferência para seletores:
1. `[data-testid="..."]` - Mais confiável e desacoplado do HTML
2. `[role="..."]` - Semântica e acessibilidade
3. `input[name="..."]` - Para inputs
4. Evitar seletores frágeis como `.button:nth-child(2)`

```javascript
// Bom
await page.click('[data-testid="submit-button"]');

// Aceitável
await page.click('button[role="button"]:has-text("Submit")');

// Ruim
await page.click('div > div > button:nth-child(2)');
```

### 3. Aguardar Elementos

```javascript
// Bom - Aguardar carregamento de rede
await page.waitForLoadState('networkidle');

// Bom - Aguardar elemento visível
await expect(element).toBeVisible({ timeout: 5000 });

// Evitar - Timeouts fixos
// await page.waitForTimeout(1000); // Última opção
```

### 4. Tratamento de Erros

```javascript
// Verificar se elemento está visível, com fallback
const isVisible = await element.isVisible().catch(() => false);
expect(isVisible).toBeTruthy();

// Ou usar try-catch se necessário
try {
  await element.click();
} catch (error) {
  console.log('Elemento não encontrado, continuando...');
}
```

## Diagnóstico e Debug

### Modo Debug
```bash
npm run test:e2e:debug
```

Shortcuts no modo debug:
- `c` - Continue
- `s` - Step
- `n` - Step over
- `p` - Pause

### Screenshots e Videos

Configurados automaticamente em caso de falha:
- Screenshots: `test-results/`
- Videos: `test-results/` (apenas falhas)

Para capturar manualmente:
```javascript
await page.screenshot({ path: 'screenshot.png' });
```

### Trace (gravação de ações)

Ver trace de ações:
```bash
npx playwright show-trace test-results/trace.zip
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Testes falhando aleatoriamente

1. Aumentar timeout:
```javascript
test.setTimeout(60000); // 60 segundos
```

2. Adicionar retries:
```javascript
test.describe('Suite', () => {
  test.describe.configure({ retries: 2 });
});
```

### Aplicação não está respondendo

1. Verificar se servidor está rodando:
```bash
npm run dev
```

2. Verificar BASE_URL:
```bash
echo $BASE_URL
```

### Elementos não encontrados

1. Verificar seletor no navegador:
```javascript
await page.pause(); // Pausa no test e abre DevTools
```

2. Usar modo UI:
```bash
npm run test:e2e:ui
```

## Métricas e Relatórios

### Gerar relatório
```bash
npm run test:e2e
npm run test:e2e:report
```

### Coverage (futuro)
Para adicionar cobertura de código:
```bash
npm install -D @istanbuljs/nyc-config-typescript
```

## Requisitos Atendidos

| Requirement | Suite | Testes |
|-----------|-------|--------|
| 1.1-1.7 | Authentication | 8 testes |
| 2.1-2.7 | Pet Management | 7 testes |
| 6.1-6.8 | Adoption Workflow | 4 testes |
| 7.1-7.4 | Dashboard | 9 testes |
| 9.1, 9.2, 9.5 | Responsiveness | 12 testes |
| **TOTAL** | 5 Suites | **40+ Testes** |

## Próximos Passos

1. ✅ Implementar testes E2E básicos
2. ✅ Adicionar fixtures reutilizáveis
3. ✅ Testar múltiplos navegadores e viewports
4. ⏳ Adicionar testes de performance
5. ⏳ Adicionar testes de acessibilidade automatizados
6. ⏳ Implementar visual regression testing
7. ⏳ Integrar com CI/CD

## Referências

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)
