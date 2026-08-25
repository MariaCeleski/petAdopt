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
    <div className="min-h-screen flex">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">
              Junte-se à nossa missão!
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Crie sua conta e faça parte de uma comunidade dedicada ao bem-estar animal.
            </p>
            <div className="space-y-4 text-white/80">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Cadastre pets para adoção gratuito</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Encontre o companheiro perfeito</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Gerencie adoções de forma segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
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
      </div>
    </div>
  );
}