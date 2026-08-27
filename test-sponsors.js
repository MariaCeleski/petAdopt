// Script para testar a API de patrocinadores
const API_URL = 'http://localhost:3000/api/sponsors';

async function testSponsorsAPI() {
  console.log('🧪 Testando API de Patrocinadores\n');

  try {
    // 1. GET sponsors (public)
    console.log('1️⃣ Testando GET /api/sponsors (público)');
    const getResponse = await fetch(API_URL);
    const sponsors = await getResponse.json();
    console.log('✅ Sponsors atuais:', sponsors);
    console.log('');

    // 2. POST new sponsor (would need auth in real scenario)
    console.log('2️⃣ Testando POST /api/sponsors (requer admin)');
    const newSponsor = {
      name: 'Petshop Premium',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Logo_RoyalCanin.png',
      website: 'https://petshop.com.br',
      description: 'Fornecedor de alimentos premium para pets',
      isActive: true
    };
    
    console.log('Payload:', newSponsor);
    console.log('⚠️  POST requer autenticação de admin');
    console.log('');

    // 3. Instruções
    console.log('📋 Próximos passos:');
    console.log('1. Acesse: http://localhost:3000');
    console.log('2. Faça login como SHELTER_ADMIN');
    console.log('3. Vá para: http://localhost:3000/dashboard/patrocinadores');
    console.log('4. Adicione um patrocinador com a interface');
    console.log('5. Verifique se aparece no carousel da home');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testSponsorsAPI();
