# Dashboard - Guia Visual

## 📊 Dashboard Principal (`/dashboard`)

### Seção de Boas-vindas
```
┌─────────────────────────────────────────────────────────┐
│  ████████████████████████████████████████████           │ (Gradiente Laranja)
│  Bem-vindo, Maria! 👋                                   │
│  Tipo de conta: Pessoa Física                           │
│                                                          │
│  ○                                (Círculo decorativo)  │
└─────────────────────────────────────────────────────────┘
```

### Seção de Estatísticas

```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ [📱 ícone azul]    │  │ [✓ ícone verde]    │  │ [⏱️ ícone amarelo] │
│ Seus Pets          │  │ Adoções            │  │ Pendentes          │
│ 0                  │  │ 0                  │  │ 0                  │
│ Cadastrados        │  │ Realizadas         │  │ Em análise         │
│ ▓▓▓ (top bar)      │  │ ▓▓▓ (top bar)      │  │ ▓▓▓ (top bar)      │
└────────────────────┘  └────────────────────┘  └────────────────────┘
(Hover: Levanta + Aparece barra laranja no topo)
```

### Seção de Ações Rápidas

```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ [⊕ Ícone Laranja]  │  │ [🔍 Ícone Laranja] │  │ [👤 Ícone Laranja] │
│ Cadastrar Pet      │  │ Buscar Pets        │  │ Meu Perfil         │
│ Adicione um novo   │  │ Explore o catálogo │  │ Edite seus dados   │
└────────────────────┘  └────────────────────┘  └────────────────────┘
(Hover: Borda laranja, efeito brilho, levanta)
```

---

## 👥 Dashboard do Adotante (`/dashboard/adopter`)

### Abas de Navegação
```
[Visão Geral] [Solicitações] [Histórico] [Preferências]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(Aba ativa tem underline laranja)
```

### Card de Adoção

```
┌─────────────────────────────────────────────────────────┐
│ ▌ Barra Lateral (aparece ao hover)                      │
│ ┌──────────┐  Fluffy                                    │
│ │          │  Golden Retriever • DOG                    │
│ │  [Foto]  │  ┌──────────┐                              │
│ │ do Pet   │  │ APROVADO │ (Badge com gradiente)       │
│ │          │  └──────────┘                              │
│ └──────────┘                                            │
└─────────────────────────────────────────────────────────┘
```

### Badges de Status

```
Estilos de Badges:

🟡 PENDING      (Amarelo)     → Aguardando aprovação
🔵 APPROVED     (Azul)        → Aprovado
🟢 COMPLETED    (Verde)       → Adoção completa
🔴 REJECTED     (Vermelho)    → Rejeitado
⚪ CANCELLED    (Cinza)       → Cancelado

Cada badge possui gradiente único e border sutil.
```

---

## 🎨 Paleta de Cores

### Primárias
```
Laranja Principal
Hex: #FF8C42
RGB: 255, 140, 66
Uso: Accent color, highlights, active states

Laranja Claro (Gradiente)
Hex: #FFB380
Uso: Gradients, backgrounds secundários
```

### Backgrounds
```
Muito Claro:   #F9FAFB
Claro:         #F3F4F6
Neutro:        #E5E7EB
Médio:         #9CA3AF
Escuro:        #6B7280
Muito Escuro:  #111827
```

### Cores de Status
```
Azul (Stats):      #3B82F6 (com fundo #DBEAFE)
Verde (Completed): #16A34A (com fundo #DCFCE7)
Amarelo (Pending): #FBBF24 (com fundo #FEF3C7)
Vermelho (Error):  #DC2626 (com fundo #FEE2E2)
```

---

## 📱 Responsividade

### Desktop (>1024px)
- 3 colunas para stats
- 4 colunas para ações
- Layout 2 colunas para adotante
- Cards com shadow normal

### Tablet (768px-1024px)
- 2 colunas para stats
- 2 colunas para ações
- Layout 1 coluna para adotante
- Cards com padding reduzido

### Mobile (<768px)
- 1 coluna para tudo
- Padding reduzido
- Ícones menores
- Font sizes otimizadas

---

## ✨ Efeitos e Animações

### Hover Effects

**Stats Cards**
```
Repouso:   Shadow pequeno, sem barra no topo
Hover:     - Levanta 4px
           - Shadow grande
           - Barra laranja aparece no topo
           - Transição suave (0.3s)
```

**Action Buttons**
```
Repouso:   Border cinza, background branco
Hover:     - Border laranja
           - Shadow aumentado
           - Efeito brilho passa da esquerda para direita
           - Levanta 2px
```

**Adoption Cards**
```
Repouso:   Border cinza, sem barra lateral
Hover:     - Desloca para direita (+4px)
           - Barra lateral laranja aparece
           - Border laranja
           - Shadow aumentado
```

### Animações

**Fade-in Tabs**
```
Duração: 0.3s
Easing:  cubic-bezier(0.4, 0, 0.2, 1)
Efeito:  - Começa com opacity 0, translateY(8px)
         - Termina com opacity 1, translateY(0)
```

---

## 🌙 Dark Mode

Ativado automaticamente via:
```css
@media (prefers-color-scheme: dark)
```

### Mudanças no Dark Mode
- Background #F9FAFB → #1F2937
- Texto #111827 → #F9FAFB
- Borders #E5E7EB → #374151
- Cards ganham fundos escuros com borders subtis
- Sombras aumentadas para melhor contraste

---

## ♿ Acessibilidade

### Alto Contraste
```css
@media (prefers-contrast: high)
- Borders mais grossos (2-3px)
- Cores mais vibrantes
- Text shadows mais definidos
```

### Movimento Reduzido
```css
@media (prefers-reduced-motion: reduce)
- Transições desabilitadas
- Animações desabilitadas
- Apenas mudanças de estado visíveis
```

---

## 📐 Spacing System

```
xs:  0.25rem  (4px)
sm:  0.5rem   (8px)
md:  1rem     (16px)
lg:  1.5rem   (24px)
xl:  2rem     (32px)
2xl: 2.5rem   (40px)
```

---

## 🎯 Grid System

```
Cards de Stats:      repeat(auto-fit, minmax(280px, 1fr))
Action Buttons:      repeat(auto-fit, minmax(240px, 1fr))
Gap Desktop:         1.5rem
Gap Tablet:          1rem
Gap Mobile:          1rem
```

---

## 🔤 Typography

```
Títulos Principais:   2rem, weight 700
Subtítulos:          1rem, weight 500
Títulos Seções:      1.5rem, weight 700
Texto Base:          0.95rem, weight 500
Descrições:          0.875rem, weight 400
Pequeno:             0.8rem, weight 600
```

---

## 📋 Checklist de Features

✅ Gradientes profissionais
✅ Ícones coloridos
✅ Hover effects suaves
✅ Transições otimizadas
✅ Responsividade completa
✅ Dark mode
✅ Alto contraste
✅ Movimento reduzido
✅ Performance
✅ Acessibilidade

---

## 🖼️ Preview de Estados

### Card em Repouso
```
┌─────────────────────┐
│ [Ícone]             │
│ Título              │
│ 0                   │
│ Descrição           │
└─────────────────────┘
```

### Card ao Hover
```
┌─────────────────────┐ ↑ (Levanta)
│ [Ícone]             │
│ Título              │
│ 0                   │
│ Descrição           │
╠═════════════════════╣ (Barra aparece)
└─────────────────────┘
```

---

## 🚀 Performance

- Sem animações desnecessárias
- CSS Modules para bundle otimizado
- Cubic-bezier timings otimizados
- Hardware acceleration ativa
- Transições de cor eficientes

---

**Design System**: PetAdopt Dashboard v2.0
**Última atualização**: Agosto 27, 2026
**Status**: ✅ Implementado
