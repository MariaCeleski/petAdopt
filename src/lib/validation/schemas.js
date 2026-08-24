import { z } from 'zod';

// User Validation Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  type: z.enum(['ADOPTER', 'SHELTER_ADMIN', 'INDIVIDUAL_OWNER']).default('ADOPTER'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Pet Validation Schemas
export const petSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  species: z.enum(['DOG', 'CAT'], { errorMap: () => ({ message: 'Espécie inválida' }) }),
  breed: z.string().min(1, 'Raça é obrigatória').max(50, 'Raça muito longa'),
  age: z.string().min(1, 'Idade é obrigatória'),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE'], { errorMap: () => ({ message: 'Tamanho inválido' }) }),
  gender: z.enum(['MALE', 'FEMALE'], { errorMap: () => ({ message: 'Gênero inválido' }) }),
  color: z.string().min(1, 'Cor é obrigatória').max(30, 'Cor muito longa'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(500, 'Descrição muito longa'),
  isNeutered: z.boolean().default(false),
  isVaccinated: z.boolean().default(false),
  healthStatus: z.string().max(300, 'Status de saúde muito longo').optional(),
  personality: z.array(z.string()).max(5, 'Máximo 5 traços de personalidade').default([]),
  location: z.string().max(100, 'Localização muito longa').optional(),
});

// Adoption Validation Schema
export const adoptionSchema = z.object({
  petId: z.string().cuid('ID do pet inválido'),
  message: z.string().max(500, 'Mensagem muito longa').optional(),
  adopterInfo: z.object({
    personalInfo: z.object({
      fullName: z.string().min(2, 'Nome completo é obrigatório'),
      phone: z.string().min(10, 'Telefone inválido'),
      address: z.string().min(5, 'Endereço é obrigatório'),
      city: z.string().min(2, 'Cidade é obrigatória'),
      state: z.string().min(2, 'Estado é obrigatório'),
      zipCode: z.string().min(8, 'CEP inválido'),
    }),
    livingSituation: z.object({
      housingType: z.enum(['apartment', 'house', 'farm', 'other']),
      hasYard: z.boolean(),
      ownRent: z.enum(['own', 'rent']),
      landlordApproval: z.boolean().optional(),
    }),
    experience: z.object({
      hadPetsBefore: z.boolean(),
      currentPets: z.array(z.object({
        species: z.string(),
        breed: z.string(),
        age: z.string(),
      })).default([]),
      veterinarianInfo: z.string().optional(),
    }),
    motivation: z.object({
      whyAdopt: z.string().min(20, 'Explique por que deseja adotar (mínimo 20 caracteres)'),
      expectedCommitment: z.string().min(10, 'Descreva seu comprometimento esperado'),
      availableTime: z.string().min(5, 'Informe o tempo disponível'),
    }),
  }),
});

// Shelter Validation Schema
export const shelterSchema = z.object({
  name: z.string().min(2, 'Nome do abrigo é obrigatório').max(100, 'Nome muito longo'),
  address: z.string().min(10, 'Endereço completo é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  zipCode: z.string().min(8, 'CEP inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida').optional(),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
});

// Image Upload Validation Schema
export const imageUploadSchema = z.object({
  files: z.array(z.object({
    name: z.string(),
    size: z.number().max(5242880, 'Arquivo muito grande. Máximo 5MB'),
    type: z.string().refine(
      (type) => ['image/jpeg', 'image/png', 'image/webp'].includes(type),
      'Formato inválido. Use JPEG, PNG ou WebP'
    ),
  })).max(10, 'Máximo 10 imagens por vez'),
});

// Filter Validation Schema
export const filterSchema = z.object({
  species: z.enum(['DOG', 'CAT']).optional(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional(),
});