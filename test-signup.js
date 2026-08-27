#!/usr/bin/env node

/**
 * Script de teste para signup
 * Testa a criação de uma conta
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testSignup() {
  console.log('🧪 Testando Signup...\n');

  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    type: 'ADOPTER'
  };

  console.log('📝 Dados a enviar:');
  console.log(JSON.stringify(testUser, null, 2));
  console.log('\n');

  try {
    console.log('📤 Enviando requisição POST para /api/auth/register...');
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.log('❌ Resposta não é JSON válido:');
      console.log(responseText);
      return;
    }

    console.log(`\n📊 Status da Resposta: ${response.status}`);
    console.log('\n📋 Resposta:');
    console.log(JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ SUCESSO! Usuário criado:');
      console.log(`   ID: ${result.user.id}`);
      console.log(`   Nome: ${result.user.name}`);
      console.log(`   Email: ${result.user.email}`);
      console.log(`   Tipo: ${result.user.type}`);
    } else {
      console.log('\n❌ ERRO ao criar usuário:');
      console.log(`   Código: ${result.code}`);
      console.log(`   Mensagem: ${result.error}`);
    }

  } catch (error) {
    console.error('❌ Erro na requisição:');
    console.error(error.message);
  }
}

testSignup();
