import Link from 'next/link';
import { Button } from '@/components/ui';

export const metadata = {
  title: 'Verificação de Email - PetAdopt',
  description: 'Verifique seu email para completar o registro.',
};

export default function VerifyRequestPage({ searchParams }) {
  const email = searchParams?.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifique seu Email
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Um email de verificação foi enviado para{' '}
            {email && (
              <span className="font-medium text-gray-900">{email}</span>
            )}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Próximos passos:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>Verifique sua caixa de entrada</li>
                <li>Procure por spam ou lixo eletrônico</li>
                <li>Clique no link de verificação</li>
                <li>Retorne para fazer login</li>
              </ol>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Não recebeu o email? Verifique sua pasta de spam ou tente cadastrar novamente.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            as="link"
            href="/auth/signin"
            variant="primary"
            fullWidth
          >
            Ir para Login
          </Button>
          
          <Button
            as="link"
            href="/auth/signup"
            variant="outline"
            fullWidth
          >
            Tentar Cadastro Novamente
          </Button>
        </div>
      </div>
    </div>
  );
}