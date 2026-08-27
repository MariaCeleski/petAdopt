import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export const metadata = {
  title: 'Fazer Login - PetAdopt',
  description: 'Faça login na PetAdopt para acessar sua conta e gerenciar pets.',
};

export default async function SignInPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  
  // Se já está logado, redirecionar para dashboard
  if (session) {
    redirect('/dashboard');
  }

  const callbackUrl = searchParams?.callbackUrl || '/dashboard';
  const error = searchParams?.error;
  const message = searchParams?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Fazer Login
          </h1>
          <p className="mt-2 text-gray-600">
            Entre na sua conta para acessar o dashboard
          </p>
        </div>

        <SignInForm callbackUrl={callbackUrl} error={error} message={message} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link 
              href="/auth/signup" 
              className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}