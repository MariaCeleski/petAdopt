'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShelterForm } from '@/components/shelter';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton/LoadingSkeleton';
import styles from './page.module.css';

/**
 * Shelter Management Dashboard
 * URL: /dashboard/shelter
 * 
 * Allows SHELTER_ADMIN users to create and manage their shelter profile
 * Validates Requirements: 11.1, 11.2, 11.4
 */

export default function ShelterDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [shelter, setShelter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    // Redirect if not a shelter admin
    if (status === 'authenticated' && session?.user?.type !== 'SHELTER_ADMIN') {
      router.push('/dashboard');
      return;
    }

    // Fetch shelter data if authenticated
    if (status === 'authenticated' && session?.user?.id) {
      fetchShelter();
    }
  }, [status, session, router]);

  const fetchShelter = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, try to get the shelter for this admin
      const response = await fetch(`/api/shelters?adminId=${session.user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const shelterData = data.data[0];
          setShelter(shelterData);
          
          // Fetch stats for this shelter
          const statsResponse = await fetch(`/api/shelters/${shelterData.id}/stats`);
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching shelter:', err);
      setError('Erro ao carregar dados do abrigo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShelterSuccess = (result) => {
    setShelter(result);
    fetchShelter(); // Refresh stats
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSkeleton height={400} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciamento do Abrigo</h1>
        <p className={styles.subtitle}>
          Crie e gerencie o perfil do seu abrigo
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Stats */}
      {shelter && stats && (
        <div className={styles.statsContainer}>
          <Card>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Pets Cadastrados</span>
                <span className={styles.statValue}>{stats.petStats.total}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Pets Disponíveis</span>
                <span className={styles.statValue}>{stats.petStats.available}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Pets Adotados</span>
                <span className={styles.statValue}>{stats.petStats.adopted}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Taxa de Adoção</span>
                <span className={styles.statValue}>{stats.petStats.adoptionRate}%</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Solicitações de Adoção</span>
                <span className={styles.statValue}>{stats.adoptionStats.totalRequests}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Taxa de Sucesso</span>
                <span className={styles.statValue}>{stats.adoptionStats.successRate}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Links to related sections */}
      {shelter && (
        <div className={styles.actionsContainer}>
          <Link href={`/shelters/${shelter.id}`}>
            <Button variant="secondary" fullWidth>
              Ver Página Pública do Abrigo
            </Button>
          </Link>
          <Link href="/dashboard/adoptions">
            <Button variant="secondary" fullWidth>
              Ver Solicitações de Adoção
            </Button>
          </Link>
          <Link href="/pets?owner=me">
            <Button variant="secondary" fullWidth>
              Gerenciar Pets
            </Button>
          </Link>
        </div>
      )}

      {/* Form */}
      <ShelterForm
        shelter={shelter}
        onSuccess={handleShelterSuccess}
      />
    </div>
  );
}
