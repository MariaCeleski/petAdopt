'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoEmoji}>🐾</span>
            <span className={styles.logoText}>PetAdopt</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className={styles.nav}>
            <Link href="/pets" className={styles.navLink}>
              Adotar Pet
            </Link>
            <Link href="/cadastrar" className={styles.navLink}>
              Cadastrar Pet
            </Link>
            <Link href="/sobre" className={styles.navLink}>
              Sobre Nós
            </Link>
            <Link href="/contato" className={styles.navLink}>
              Contato
            </Link>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <Button variant="ghost" size="medium" className={styles.loginBtn}>
              Entrar
            </Button>
            <Button variant="primary" size="medium">
              Cadastrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuBtn}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <nav className={styles.mobileNav}>
            <Link href="/pets" className={styles.mobileNavLink}>
              🐕 Adotar Pet
            </Link>
            <Link href="/cadastrar" className={styles.mobileNavLink}>
              💝 Cadastrar Pet
            </Link>
            <Link href="/sobre" className={styles.mobileNavLink}>
              ℹ️ Sobre Nós
            </Link>
            <Link href="/contato" className={styles.mobileNavLink}>
              📞 Contato
            </Link>
            <div className={styles.mobileActions}>
              <Button variant="outline" fullWidth className="mb-sm">
                Entrar
              </Button>
              <Button variant="primary" fullWidth>
                Cadastrar
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
