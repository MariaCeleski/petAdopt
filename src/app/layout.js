import { Inter, Poppins } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'PetAdopt - Encontre seu Companheiro Perfeito',
  description: 'Plataforma de adoção responsável que conecta pets abandonados com famílias amorosas. Adote com amor, mude uma vida.',
  keywords: 'adoção, pets, cães, gatos, animais, abrigo, adoção responsável',
  authors: [{ name: 'PetAdopt Team' }],
  openGraph: {
    title: 'PetAdopt - Adoção Responsável de Pets',
    description: 'Conectamos corações e transformamos vidas. Encontre seu melhor amigo.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetAdopt - Adoção Responsável de Pets',
    description: 'Conectamos corações e transformamos vidas. Encontre seu melhor amigo.',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
