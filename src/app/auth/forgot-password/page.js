import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Link from 'next/link';

export const metadata = {
  title: 'Esqueci a Senha - PetAdopt',
  description: 'Solicite a redefinição de sua senha na PetAdopt.',
};

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);
  
  // Se já está logado, redirecionar para dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Esqueci a Senha
          </h1>
          <p className="mt-2 text-gray-600">
            Digite seu email para receber as instruções de redefinição
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}