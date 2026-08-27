import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';

export const metadata = {
  title: 'Criar Conta - PetAdopt',
  description: 'Crie sua conta na PetAdopt para começar a adotar ou cadastrar pets.',
};

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  
  // Se já está logado, redirecionar para dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Criar Conta
          </h1>
          <p className="mt-2 text-gray-600">
            Cadastre-se para começar a usar a PetAdopt
          </p>
        </div>

        <SignUpForm />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link 
              href="/auth/signin" 
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}