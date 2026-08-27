'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styles from './page.module.css';

/**
 * New Pet Creation Page
 * Allows pet owners and shelter admins to create new pet listings
 */
export default function NewPetPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  // Redirect if adopter (can't create pets)
  if (status === 'authenticated' && session?.user?.type === 'ADOPTER') {
    redirect('/dashboard/adopter');
  }

  const [formData, setFormData] = useState({
    name: '',
    species: 'DOG',
    breed: '',
    age: '',
    size: 'MEDIUM',
    gender: 'MALE',
    color: '',
    description: '',
    isNeutered: false,
    isVaccinated: false,
    healthStatus: '',
    personality: [],
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePersonalityChange = (trait) => {
    setFormData(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(t => t !== trait)
        : [...prev.personality, trait]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar pet');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/pets/${data.id}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeleton}>
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  const personalityTraits = [
    'Amigável',
    'Brincalhão',
    'Calmo',
    'Energético',
    'Carinhoso',
    'Independente',
    'Protetor',
    'Sociável'
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Cadastrar Novo Pet</h1>
          <p className={styles.subtitle}>Compartilhe seu pet com potenciais adotantes</p>
        </div>

        {error && (
          <div className={styles.alert} style={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }}>
            <strong>Erro:</strong> {error}
          </div>
        )}

        {success && (
          <div className={styles.alert} style={{ backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }}>
            <strong>Sucesso!</strong> Pet criado com sucesso. Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Informações Básicas */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Básicas</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do Pet *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Fluffy, Rex, Miau"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.twoColumns}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Espécie *</label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="DOG">Cachorro</option>
                  <option value="CAT">Gato</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Raça *</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Ex: Golden Retriever, Siamês"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.twoColumns}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Idade *</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Ex: 2 anos, 3 meses"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tamanho *</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="SMALL">Pequeno (&lt;10kg)</option>
                  <option value="MEDIUM">Médio (10-25kg)</option>
                  <option value="LARGE">Grande (&gt;25kg)</option>
                </select>
              </div>
            </div>

            <div className={styles.twoColumns}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Gênero *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="MALE">Macho</option>
                  <option value="FEMALE">Fêmea</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cor</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Ex: Marrom, Branco e Preto"
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Saúde e Vacinação */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Saúde e Vacinação</h2>
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isNeutered"
                  checked={formData.isNeutered}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Pet é castrado/esterilizado
              </label>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isVaccinated"
                  checked={formData.isVaccinated}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Pet está vacinado
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status de Saúde</label>
              <textarea
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleInputChange}
                placeholder="Ex: Sem problemas de saúde, Alergias alimentares, etc"
                className={styles.textarea}
              />
            </div>
          </section>

          {/* Personalidade */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Personalidade</h2>
            <p className={styles.sectionDescription}>Selecione os traços que descrevem seu pet</p>
            
            <div className={styles.personalityGrid}>
              {personalityTraits.map(trait => (
                <label key={trait} className={styles.traitCheckbox}>
                  <input
                    type="checkbox"
                    checked={formData.personality.includes(trait)}
                    onChange={() => handlePersonalityChange(trait)}
                    className={styles.checkbox}
                  />
                  {trait}
                </label>
              ))}
            </div>
          </section>

          {/* Descrição */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Descrição Detalhada</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Sobre o Pet *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o pet, sua história, hábitos e qualidades especiais..."
                required
                className={styles.textarea}
                rows={6}
              />
            </div>
          </section>

          {/* Botões */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.buttonSecondary}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
