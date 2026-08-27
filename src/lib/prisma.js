import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis;

/**
 * Inicializa Prisma Client com pool de conexões e otimizações
 * 
 * Otimizações implementadas:
 * - Connection pooling para reutilização de conexões
 * - Query logging configurável por ambiente
 * - Graceful shutdown para limpeza de recursos
 * 
 * Requirements: 16.2 (Connection pooling)
 */
function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: './dev.db',
    // Connection pooling configuration
    ...(process.env.DATABASE_POOL_SIZE && {
      pool: {
        min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
        max: parseInt(process.env.DATABASE_POOL_SIZE || '10'),
      },
    }),
  });
  
  return new PrismaClient({
    adapter,
    // Query logging apenas em desenvolvimento para não afetar performance
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn']
      : ['error'],
    errorFormat: 'pretty',
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Monitorar conexões
 * Útil para debugging de issues de pool em desenvolvimento
 */
if (process.env.DEBUG_PRISMA_POOL === 'true') {
  prisma.$on('beforeDisconnect', () => {
    console.log('[Prisma] Desconectando do banco de dados');
  });
}

/**
 * Handlers de shutdown gracioso
 * Garante que todas as conexões sejam fechadas corretamente
 */
async function handleShutdown(signal) {
  console.log(`[Prisma] Recebido sinal ${signal}, encerrando conexões...`);
  try {
    await prisma.$disconnect();
    console.log('[Prisma] Desconexão concluída com sucesso');
    process.exit(0);
  } catch (error) {
    console.error('[Prisma] Erro ao desconectar:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));