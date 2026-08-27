import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis;

/**
 * Inicializa Prisma Client com pooling de conexões
 */
function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: 'file:./prisma/dev.db',
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn']
      : ['error'],
    errorFormat: 'pretty',
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Handlers de shutdown gracioso
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