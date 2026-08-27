# Security Integration Examples

Este documento mostra como integrar os recursos de segurança em API routes existentes.

## Exemplo 1: Auth API Route (Máxima Proteção)

### Antes

```javascript
// src/app/api/auth/register/route.js
export async function POST(request) {
  try {
    const data = await request.json();
    // ... processa registro
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Depois

```javascript
import { authApiHandler } from '@/lib/api/secure-handler.js';
import { logApiEvent } from '@/lib/security/audit-logger.js';

export const POST = authApiHandler(async (req) => {
  try {
    const data = await req.json();
    // Body já vem automaticamente sanitizado!
    
    // ... processa registro
    
    // Log do sucesso
    await logApiEvent(req, {
      type: 'AUTH_REGISTER',
      severity: 'INFO',
      email: data.email,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Erro já é tratado automaticamente
    throw error;
  }
});
```

**Proteção Automática**:
- ✅ Rate limit: 5 req / 15 min
- ✅ Input sanitização
- ✅ Security headers
- ✅ Error handling
- ✅ Audit logging

## Exemplo 2: Pet Creation API (Proteção Média)

### Antes

```javascript
// src/app/api/pets/route.js
export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const petData = await request.json();
    const validation = petSchema.safeParse(petData);
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // ... cria pet
    return NextResponse.json(pet);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Depois

```javascript
import { petApiHandler } from '@/lib/api/secure-handler.js';
import { petSchema } from '@/lib/validation/schemas.js';

export const POST = petApiHandler(async (req) => {
  // Autenticação + rate limit + sanitização já aplicados!
  
  const petData = await req.json();
  const validation = petSchema.safeParse(petData);
  
  if (!validation.success) {
    throw new ValidationError(validation.error.format());
  }

  // ... cria pet (dados já sanitizados)
  const pet = await prisma.pet.create({
    data: validation.data
  });

  return NextResponse.json(pet, { status: 201 });
});
```

**Proteção Automática**:
- ✅ Requer autenticação
- ✅ Rate limit: 20 req / dia
- ✅ Input sanitização
- ✅ Security headers
- ✅ Audit logging

## Exemplo 3: Upload API (Proteção Alta)

### Antes

```javascript
// src/app/api/upload/route.js
export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('images');
    
    // ... upload
  } catch (error) {
    // ...
  }
}
```

### Depois

```javascript
import { uploadApiHandler } from '@/lib/api/secure-handler.js';

export const POST = uploadApiHandler(async (req) => {
  // Autenticação + rate limit aplicados!
  // (Não sanitiza FormData, correto!)
  
  const formData = await req.formData();
  const files = formData.getAll('images');
  
  // ... upload
  const urls = await uploadToCloudinary(files);
  
  return NextResponse.json({ images: urls }, { status: 201 });
});
```

**Proteção Automática**:
- ✅ Requer autenticação
- ✅ Rate limit: 10 req / hora
- ✅ Security headers
- ✅ Audit logging
- ❌ Sem sanitização (FormData não precisa)

## Exemplo 4: Public GET API (Proteção Baixa)

### Antes

```javascript
// src/app/api/pets/route.js
export async function GET(request) {
  try {
    const pets = await prisma.pet.findMany({
      where: { status: 'AVAILABLE' }
    });
    return NextResponse.json(pets);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Depois

```javascript
import { publicGetApiHandler } from '@/lib/api/secure-handler.js';

export const GET = publicGetApiHandler(async (req) => {
  // Rate limit alto aplicado (não requer auth)
  
  const pets = await prisma.pet.findMany({
    where: { status: 'AVAILABLE' }
  });
  
  return NextResponse.json(pets);
});
```

**Proteção Automática**:
- ✅ Rate limit: 1000 req / hora (público)
- ✅ Security headers
- ❌ Sem requerimento de autenticação
- ❌ Sem sanitização (GET não tem body)

## Exemplo 5: Customizado com Opções

```javascript
import { secureApiHandlerWithRateLimit } from '@/lib/api/secure-handler.js';

export const PATCH = secureApiHandlerWithRateLimit(
  async (req) => {
    // Handler customizado
    const id = req.nextUrl.searchParams.get('id');
    const data = await req.json();
    
    const updated = await prisma.pet.update({
      where: { id },
      data
    });
    
    return NextResponse.json(updated);
  },
  {
    rateLimit: 'petModify',      // 50 req / dia
    requireAuth: true,           // Requer autenticação
    sanitizeBody: true,          // Sanitiza JSON body
    logEvent: true,              // Log eventos de segurança
  }
);
```

## Exemplo 6: LGPD Compliance Endpoints

```javascript
import { lgpdCompliance } from '@/lib/security/lgpd-compliance.js';
import { authApiHandler } from '@/lib/api/secure-handler.js';
import { getServerSession } from 'next-auth';

// Export user data (LGPD right)
export const GET = authApiHandler(async (req) => {
  const session = await getServerSession();
  const data = await lgpdCompliance.exportUserData(session.user.id);
  
  return NextResponse.json(data);
});

// Delete user data (Right to be forgotten)
export const DELETE = authApiHandler(async (req) => {
  const session = await getServerSession();
  const body = await req.json();
  
  const result = await lgpdCompliance.deleteUserData(
    session.user.id,
    body.reason
  );
  
  return NextResponse.json(result);
});
```

## Checklist de Integração

Para cada API route, verificar:

- [ ] Aplicar wrapper `*ApiHandler` apropriado
- [ ] Remover error handling redundante (já é feito)
- [ ] Remover autenticação manual (já é feita)
- [ ] Remover rate limiting manual (já é feito)
- [ ] Remover sanitização manual para inputs (já é feito)
- [ ] Adicionar `logEvent` se necessário
- [ ] Testar com curl/Postman
- [ ] Verificar headers de resposta

## URLs de Teste

```bash
# Rate limit test
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Test123456"}'
  echo "Request $i"
  sleep 1
done

# Security headers test
curl -i http://localhost:3000/api/pets

# LGPD export
curl http://localhost:3000/api/users/export \
  -H "Authorization: Bearer YOUR_TOKEN"

# Injection attempt test
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -d '{"name":"'; DROP TABLE pets; --","species":"DOG"}'
  # Será sanitizado automaticamente
```

## Verificar Implementação

1. **Rate Limit Headers**
   ```
   X-RateLimit-Limit: 5
   X-RateLimit-Remaining: 4
   X-RateLimit-Reset: 2024-01-15T14:30:00.000Z
   ```

2. **Security Headers**
   ```
   Strict-Transport-Security: max-age=31536000
   X-Frame-Options: DENY
   Content-Security-Policy: default-src 'self'
   ```

3. **429 Response (Excedido)**
   ```json
   {
     "error": "Muitas requisições. Tente novamente mais tarde.",
     "code": "RATE_LIMIT_EXCEEDED",
     "retryAfter": 300
   }
   ```

## Integração Gradual

Recomenda-se integrar gradualmente:

1. **Fase 1**: Auth endpoints
   - `/api/auth/register`
   - `/api/auth/forgot-password`
   - `/api/auth/reset-password`

2. **Fase 2**: Upload
   - `/api/upload`

3. **Fase 3**: Pet CRUD
   - `/api/pets` (POST, PATCH, DELETE)
   - `/api/pets/[id]`

4. **Fase 4**: Adoption
   - `/api/adoptions` (POST, PATCH)

5. **Fase 5**: LGPD Compliance
   - `/api/users/export`
   - `/api/users/delete`

## Performance

Overhead médio por request:

- Rate limiting: ~1ms
- Input sanitization: ~0.5ms
- Security headers: 0ms (apenas adiciona headers)
- Audit logging: ~10ms (async)

**Total**: ~11-12ms por requisição protegida (geralmente < 5% do tempo total de request)

## Troubleshooting

### "429 Too Many Requests" ao testar

- Rate limit foi excedido
- Aguarde o tempo em `Retry-After`
- Ou resete o contador: `rateLimiter.reset(clientId, limitType)`

### Headers não aparecem

- Verificar se o handler está aplicando corretamente
- Pode ser que navegador não mostre X-* headers
- Use DevTools Network tab ou curl -i

### Body não está sendo sanitizado

- Verificar se handler tem `sanitizeBody: true`
- FormData não é sanitizado automaticamente
- Sanitizar manualmente para FormData se necessário

### Logs não aparecem

- Verificar se `logEvent: true` na config
- Logs estão em `auditLogger.getInMemoryLogs()`
- Para produção, adicionar persistência em DB
