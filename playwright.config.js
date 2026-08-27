// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E da PetAdopt Platform
 * 
 * Requirements: 
 *   - Configurar ambiente de testes E2E (17.1)
 *   - Testar fluxos completos de adoção, pets e autenticação (17.2)
 *   - Testar responsividade em diferentes viewports (17.3)
 */

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.js',
  
  /* Máximo de tempo de espera para cada teste */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },

  /* Número de workers para executar testes em paralelo */
  fullyParallel: true,
  
  /* Falhar o build se há testes pendentes (x ou skip) */
  forbidOnly: !!process.env.CI,
  
  /* Número de retries em caso de falha no CI */
  retries: process.env.CI ? 2 : 0,
  
  /* Número de workers em CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter para exibir resultados */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-results.xml' }],
    ['list'],
  ],

  /* URL base para os testes */
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projetos para navegadores principais */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Testes com Mobile Chrome */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    /* Testes com Mobile Safari */
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Testes com tablet */
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  /* Rodar servidor dev antes dos testes */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
