'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PetCard } from '@/components/pets';
import { Button, LoadingSkeleton } from '@/components/ui';
import { 
  RefreshCwIcon, 
  FilterIcon,
  SlidersHorizontalIcon,
  AlertCircleIcon 
} from 'lucide-react';
import styles from './PetList.module.css';
import { clsx } from 'clsx';

export default function PetList({ 
  initialPets = [],
  initialPagination = null,
  filters = {},
  variant = 'grid', // 'grid' | 'list' | 'masonry'
  showFilters = false,
  onInterestClick,
  onFavoriteToggle,
  favoritePetIds = [],
  className,
  enableInfiniteScroll = true,
  pageSize = 12
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const [pets, setPets] = useState(initialPets);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(
    initialPagination?.hasNextPage ?? false
  );
  
  const observerRef = useRef(null);
  const loadMoreTriggerRef = useRef(null);

  // Build current filters from URL params
  const getCurrentFilters = useCallback(() => {
    const currentFilters = { ...filters };
    
    // Get filters from URL
    const urlFilters = {
      species: searchParams.get('species'),
      size: searchParams.get('size'),
      gender: searchParams.get('gender'),
      location: searchParams.get('location'),
      search: searchParams.get('search') || searchParams.get('q'),
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || pageSize
    };
    
    // Merge with provided filters
    Object.keys(urlFilters).forEach(key => {
      if (urlFilters[key] !== null && urlFilters[key] !== '') {
        currentFilters[key] = urlFilters[key];
      }
    });
    
    return currentFilters;
  }, [filters, searchParams, pageSize]);

  // Fetch pets from API
  const fetchPets = useCallback(async (currentFilters, append = false) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] !== null && 
            currentFilters[key] !== '' && 
            currentFilters[key] !== undefined) {
          queryParams.set(key, currentFilters[key].toString());
        }
      });

      const response = await fetch(`/api/pets?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao carregar pets');
      }
      
      const data = await response.json();
      
      if (append) {
        setPets(prev => [...prev, ...data.pets]);
      } else {
        setPets(data.pets);
      }
      
      setPagination(data.pagination);
      setHasMore(data.pagination.hasNextPage);
      setError(null);
      
      return data;
      
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Load pets with current filters
  const loadPets = useCallback(async (append = false) => {
    if ((isLoading || isLoadingMore) && append) return;
    
    const currentFilters = getCurrentFilters();
    
    if (append) {
      setIsLoadingMore(true);
      currentFilters.page = (pagination?.page || 1) + 1;
    } else {
      setIsLoading(true);
      currentFilters.page = 1;
    }

    try {
      await fetchPets(currentFilters, append);
    } catch (err) {
      // Error is already set in fetchPets
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [getCurrentFilters, fetchPets, pagination?.page, isLoading, isLoadingMore]);

  // Load more pets (infinite scroll)
  const loadMorePets = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadPets(true);
    }
  }, [hasMore, isLoadingMore, isLoading, loadPets]);

  // Refresh pets list
  const refreshPets = useCallback(() => {
    loadPets(false);
  }, [loadPets]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!enableInfiniteScroll || !loadMoreTriggerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMorePets();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(loadMoreTriggerRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableInfiniteScroll, hasMore, isLoadingMore, isLoading, loadMorePets]);

  // Load pets when filters change
  useEffect(() => {
    if (initialPets.length === 0) {
      loadPets(false);
    }
  }, [searchParams]); // Re-run when URL changes

  // Handle pet interest click
  const handleInterestClick = useCallback((pet) => {
    if (onInterestClick) {
      onInterestClick(pet);
    } else {
      // Default behavior - navigate to pet details
      router.push(`/pets/${pet.id}`);
    }
  }, [onInterestClick, router]);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback((pet, isFavorite) => {
    if (onFavoriteToggle) {
      onFavoriteToggle(pet, isFavorite);
    }
  }, [onFavoriteToggle]);

  // Check if pet is favorite
  const isPetFavorite = useCallback((petId) => {
    return favoritePetIds.includes(petId);
  }, [favoritePetIds]);

  // Render empty state
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <AlertCircleIcon size={48} />
        <h3>Nenhum pet encontrado</h3>
        <p>
          Não encontramos pets que correspondam aos filtros aplicados. 
          Tente ajustar os critérios de busca.
        </p>
        <Button 
          variant="outline" 
          onClick={refreshPets}
          className={styles.refreshButton}
        >
          <RefreshCwIcon size={16} />
          Tentar novamente
        </Button>
      </div>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className={styles.errorState}>
      <div className={styles.errorStateContent}>
        <AlertCircleIcon size={48} />
        <h3>Erro ao carregar pets</h3>
        <p>{error}</p>
        <Button 
          variant="primary" 
          onClick={refreshPets}
          className={styles.refreshButton}
        >
          <RefreshCwIcon size={16} />
          Tentar novamente
        </Button>
      </div>
    </div>
  );

  // Render loading skeletons
  const renderLoadingSkeletons = (count = pageSize) => (
    <div className={clsx(styles.petsGrid, styles[variant])}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className={styles.skeletonCard}>
          <LoadingSkeleton 
            height="200px"
            className={styles.skeletonImage}
          />
          <div className={styles.skeletonContent}>
            <LoadingSkeleton 
              height="24px" 
              width="70%"
              className={styles.skeletonTitle}
            />
            <LoadingSkeleton 
              height="16px" 
              width="50%"
              className={styles.skeletonMeta}
            />
            <LoadingSkeleton 
              height="32px" 
              width="100%"
              className={styles.skeletonButton}
            />
          </div>
        </div>
      ))}
    </div>
  );

  // Show loading state for initial load
  if (isLoading && pets.length === 0) {
    return (
      <div className={clsx(styles.petList, className)}>
        {renderLoadingSkeletons()}
      </div>
    );
  }

  // Show error state
  if (error && pets.length === 0) {
    return (
      <div className={clsx(styles.petList, className)}>
        {renderErrorState()}
      </div>
    );
  }

  // Show empty state
  if (!isLoading && pets.length === 0 && !error) {
    return (
      <div className={clsx(styles.petList, className)}>
        {renderEmptyState()}
      </div>
    );
  }

  return (
    <div className={clsx(styles.petList, className)}>
      {/* List Header */}
      <div className={styles.listHeader}>
        <div className={styles.listInfo}>
          <h2 className={styles.listTitle}>
            {pagination?.total 
              ? `${pagination.total} pet${pagination.total !== 1 ? 's' : ''} encontrado${pagination.total !== 1 ? 's' : ''}`
              : 'Pets disponíveis'
            }
          </h2>
          
          {pagination && (
            <span className={styles.listMeta}>
              Página {pagination.page} de {pagination.totalPages}
            </span>
          )}
        </div>

        <div className={styles.listActions}>
          {showFilters && (
            <Button
              variant="outline"
              size="medium"
              className={styles.filtersButton}
            >
              <FilterIcon size={16} />
              Filtros
            </Button>
          )}

          <Button
            variant="outline"
            size="medium"
            onClick={refreshPets}
            disabled={isLoading}
            className={styles.refreshButton}
          >
            <RefreshCwIcon size={16} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Pets Grid */}
      <div className={clsx(styles.petsGrid, styles[variant])}>
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onInterestClick={handleInterestClick}
            onFavoriteToggle={session ? handleFavoriteToggle : undefined}
            isFavorite={isPetFavorite(pet.id)}
            variant={variant === 'list' ? 'compact' : 'default'}
            className={styles.petCard}
          />
        ))}
      </div>

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className={styles.loadingMore}>
          {renderLoadingSkeletons(4)}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {enableInfiniteScroll && hasMore && !isLoadingMore && (
        <div 
          ref={loadMoreTriggerRef}
          className={styles.infiniteScrollTrigger}
        />
      )}

      {/* Load More Button (fallback) */}
      {!enableInfiniteScroll && hasMore && (
        <div className={styles.loadMoreSection}>
          <Button
            variant="outline"
            size="large"
            onClick={loadMorePets}
            disabled={isLoadingMore}
            loading={isLoadingMore}
            className={styles.loadMoreButton}
          >
            Carregar mais pets
          </Button>
        </div>
      )}

      {/* End of List */}
      {!hasMore && pets.length > 0 && (
        <div className={styles.endOfList}>
          <p>Você viu todos os pets disponíveis</p>
        </div>
      )}
    </div>
  );
}

// Preset variants
PetList.Grid = function PetListGrid(props) {
  return <PetList {...props} variant="grid" />;
};

PetList.List = function PetListList(props) {
  return <PetList {...props} variant="list" />;
};

PetList.Masonry = function PetListMasonry(props) {
  return <PetList {...props} variant="masonry" />;
};

PetList.Infinite = function PetListInfinite(props) {
  return <PetList {...props} enableInfiniteScroll={true} />;
};