# Sistema de Patrocinadores - Guia de Uso

## 📋 O que foi implementado

Um sistema completo de gerenciamento de patrocinadores com:

### 1. **Model Prisma** (`Sponsor`)
- `id` - ID único
- `name` - Nome do patrocinador (único)
- `logo` - URL da logo/imagem
- `website` - Link externo (opcional)
- `description` - Breve descrição
- `isActive` - Controla visibilidade no carousel
- `order` - Ordena o carousel
- Timestamps de criação e atualização

### 2. **API Routes**
- `GET /api/sponsors` - Lista patrocinadores ativos (público)
- `GET /api/sponsors?admin=true` - Lista todos (admin only)
- `GET /api/sponsors/[id]` - Detalhe de um patrocinador
- `POST /api/sponsors` - Criar patrocinador (admin only)
- `PATCH /api/sponsors/[id]` - Atualizar (admin only)
- `DELETE /api/sponsors/[id]` - Deletar (admin only)

### 3. **Página de Gestão**
- **URL**: `/dashboard/patrocinadores`
- **Acesso**: Apenas SHELTER_ADMIN
- **Funcionalidades**:
  - ✅ Criar novos patrocinadores
  - ✅ Editar existentes
  - ✅ Deletar patrocinadores
  - ✅ Ativar/desativar
  - ✅ Preview da logo
  - ✅ Listar todos com status

### 4. **Componente SponsorsCarousel**
- **Localização**: `/src/components/common/SponsorsCarousel`
- **Integrado em**: Página home (`/`)
- **Funcionalidades**:
  - 🎠 Carousel automático (5 segundos)
  - ⬅️➡️ Botões de navegação manual
  - 📍 Dots de indicação com clique rápido
  - 🔗 Links para websites dos patrocinadores
  - 📱 Responsivo (4 items no desktop, 2 no mobile)
  - 🌙 Dark mode suportado

## 🚀 Como usar

### 1. **Atualizar Prisma**
```bash
npx prisma migrate dev --name add_sponsors
```

### 2. **Acessar Página de Gestão**
1. Faça login como SHELTER_ADMIN
2. Acesse: `http://localhost:3000/dashboard/patrocinadores`

### 3. **Adicionar um Patrocinador**
1. Clique em "+ Adicionar Patrocinador"
2. Preencha:
   - **Nome**: Nome da empresa/patrocinador
   - **Logo URL**: URL completa da imagem (Cloudinary recomendado)
   - **Website**: Link do site (opcional)
   - **Descrição**: Breve texto (opcional)
   - **Ativo**: Marque para aparecer no carousel
3. Clique em "Criar Patrocinador"

### 4. **Editar Patrocinador**
1. Na lista, clique em "Editar"
2. Modifique os dados
3. Clique em "Atualizar Patrocinador"

### 5. **Deletar Patrocinador**
1. Na lista, clique em "Deletar"
2. Confirme a deleção

### 6. **Resultado**
- Patrocinadores ativos aparecem no carousel na home
- Clique na logo para ir ao site do patrocinador (se fornecido)
- Carousel cicla automaticamente a cada 5 segundos
- Responsivo em todos os devices

## 🎨 Customizações Sugeridas

### Mudar tempo do carousel
Em `SponsorsCarousel.js`, linha ~50:
```javascript
}, 5000); // Mude para 3000 (3 seg), 7000 (7 seg), etc
```

### Mudar quantidade de logos visíveis
Em `SponsorsCarousel.js`, função `getVisibleSponsors()`:
```javascript
const itemsPerView = 4; // Mude para 3, 5, 6, etc
```

### Adicionar overlay ou efeito na logo
Em `SponsorsCarousel.module.css`, classe `.sponsorImage`:
```css
filter: grayscale(50%); /* Torna mais colorido ou cinzento */
opacity: 0.8; /* Transparência */
```

## 🔒 Segurança

✅ Verificação de autenticação em todas as rotas de admin
✅ Proteção de acesso a `/dashboard/patrocinadores`
✅ Validação de dados no backend
✅ Campos obrigatórios validados

## 📱 Exemplos de Logos de Patrocinadores

Para testar, use URLs de logos reais, por exemplo:
- Petshop: https://upload.wikimedia.org/wikipedia/commons/1/1f/Logo_RoyalCanin.png
- Veterinária: https://upload.wikimedia.org/wikipedia/commons/8/8d/Pedigree_logo.png

**Dica**: Se você tiver imagens em Cloudinary, use as URLs de lá para performance melhor.

## 🐛 Troubleshooting

### "Unauthorized - Admin access required"
→ Certifique-se que o usuário é do tipo `SHELTER_ADMIN`

### Carousel não mostra
→ Verifique se existem patrocinadores com `isActive: true`

### Logo não carrega
→ Verifique a URL é válida e acessível publicamente

### Erro ao fazer migrate
→ Rode: `npx prisma db push`

## 📚 Estrutura de Arquivos

```
src/
├── app/
│   ├── api/
│   │   └── sponsors/
│   │       ├── route.js
│   │       └── [id]/
│   │           └── route.js
│   ├── dashboard/
│   │   └── patrocinadores/
│   │       ├── page.js
│   │       └── patrocinadores.module.css
│   └── page.js (atualizado com SponsorsCarousel)
└── components/
    └── common/
        └── SponsorsCarousel/
            ├── SponsorsCarousel.js
            └── SponsorsCarousel.module.css
```

## ✨ Próximas Melhorias Sugeridas

1. **Reordenação de patrocinadores** - Drag & drop para reordenar
2. **Upload direto** - Form de upload em vez de URL
3. **Estatísticas** - Visualizações de clicks por patrocinador
4. **Tiers** - Patrocinadores premium/bronze/silver
5. **Temporal** - Patrocinadores sazonais ou temporários
6. **Categorização** - Tipos de patrocinadores (alimentação, veterinária, etc)

---

**Data de criação**: 2026-08-27
**Status**: ✅ Pronto para uso
