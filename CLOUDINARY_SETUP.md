# Cloudinary Setup Guide

## Problemas Identificados

A configuração do Cloudinary estava **incompleta** causando erro ao fazer upload de imagens:

```
❌ Erro ao fazer upload: "Configuração de upload não disponível"
```

## Solução

### 1. Obter Credenciais do Cloudinary

1. Acesse [Cloudinary Console](https://cloudinary.com/console)
2. Crie uma conta ou faça login
3. Copie as credenciais da página Dashboard:
   - **Cloud Name** (exemplo: `dkx6xvmq1`)
   - **API Key** (será usado no backend)
   - **API Secret** (será usado no backend)

### 2. Configurar Upload Unsigned (Recomendado para Frontend)

1. Vá para **Settings** → **Upload**
2. Role até **Upload presets** → **Add upload preset**
3. Configure:
   - **Preset Name**: `petadopt_unsigned`
   - **Mode**: `Unsigned`
   - **Folder**: `petadopt/`
   - Salve

### 3. Atualizar Arquivo `.env.local`

Crie o arquivo `.env.local` na raiz do projeto com as credenciais:

```env
# Cloudinary Configuration (Frontend - Public)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="seu_cloud_name_aqui"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="petadopt_unsigned"

# Cloudinary Configuration (Backend - Private)
CLOUDINARY_API_KEY="sua_api_key_aqui"
CLOUDINARY_API_SECRET="sua_api_secret_aqui"
```

### 4. Reiniciar o Servidor

```bash
npm run dev
# ou
yarn dev
```

## Como Testar

1. Vá para `/pets/novo` (Cadastrar Novo Pet)
2. Arraste uma imagem ou clique para selecionar
3. A imagem deve ser enviada com sucesso

## Troubleshooting

### "Configuração de upload não disponível"
- Verifique se `.env.local` existe
- Verifique se `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` está preenchido
- Verifique se `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` está correto

### "Erro ao fazer upload"
- Verifique sua conexão de internet
- Verifique se o upload preset `petadopt_unsigned` existe no Cloudinary
- Verifique o console do navegador (F12) para mais detalhes

### "Arquivo muito grande"
- Máximo 5MB por arquivo
- Redimensione a imagem ou use formato comprimido (WebP)

## Variáveis de Ambiente

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Pública | Nome da nuvem Cloudinary | `dkx6xvmq1` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Pública | Preset de upload | `petadopt_unsigned` |
| `CLOUDINARY_API_KEY` | Privada | Chave API para backend | `123456789` |
| `CLOUDINARY_API_SECRET` | Privada | Segredo API para backend | `abc_def_ghi` |

## Segurança

⚠️ **Importante**: 
- Variáveis com `NEXT_PUBLIC_` são visíveis no frontend (públicas)
- Nunca exponha `CLOUDINARY_API_SECRET` no frontend
- Mantenha `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` no `.env.local` (não faça commit)

## Documentação

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
