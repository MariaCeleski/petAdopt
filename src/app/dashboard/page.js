import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard - PetAdopt',
  description: 'Gerencie seus pets e adoções na PetAdopt.',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Verificar autenticação no servidor
  if (!session) {
    redirect('/auth/signin');
  }

  const userTypeLabels = {
    'ADOPTER': 'Adotante',
    'INDIVIDUAL_OWNER': 'Pessoa Física',
    'SHELTER_ADMIN': 'Administrador de Abrigo',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Bem-vindo, {session.user.name}!
              </h1>
              <p className="text-gray-600">
                Tipo de conta: {userTypeLabels[session.user.type]}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card de estatísticas - exemplo */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Seus Pets
                </h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-blue-600">Cadastrados</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Adoções
                </h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-green-600">Realizadas</p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">
                  Pendentes
                </h3>
                <p className="text-3xl font-bold text-yellow-600">0</p>
                <p className="text-sm text-yellow-600">Em análise</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Ações Rápidas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {session.user.type !== 'ADOPTER' && (
                  <a
                    href="/pets/novo"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Cadastrar Pet
                  </a>
                )}
                
                <a
                  href="/pets"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar Pets
                </a>
                
                <a
                  href="/dashboard/perfil"
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Meu Perfil
                </a>
                
                <a
                  href="/contato"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Suporte
                </a>
              </div>
            </div>

            {/* Debug info em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Debug - Informações da Sessão
                </h3>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}