# Estándares de Desarrollo - MercadoExpress API

## Filosofía del Proyecto

Este proyecto se construye bajo principios de **ingeniería de software profesional** que priorizan:

1. **Calidad sobre cantidad:** Cada línea de código debe tener propósito y calidad.
2. **Simplicidad:** Resolver problemas complejos con soluciones simples.
3. **Mantenibilidad:** Código que otros (y tu yo futuro) puedan entender y modificar fácilmente.
4. **Testabilidad:** El código debe ser fácil de probar.

---

## Principios de Diseño

### Clean Code

El código limpio es aquel que:

- **Es legible:** Otros desarrolladores pueden entenderlo sin comentarios excesivos.
- **Es expresivo:** Los nombres de variables, funciones y clases revelan su intención.
- **Tiene una sola responsabilidad:** Cada módulo hace una cosa y la hace bien.
- **Está organizado:** La estructura del proyecto refleja la arquitectura.

**Reglas prácticas:**

```typescript
// ❌ Mal: nombre genérico, responsabilidad múltiples
function process(data: any) {
  const filtered = data.filter((x: any) => x.active);
  const sorted = filtered.sort((a: any, b: any) => a.date - b.date);
  return sorted;
}

// ✅ Bien: nombre descriptivo, responsabilidad única
function filterActiveProducts(products: Product[]): Product[] {
  return products.filter(product => product.isActive);
}

function sortProductsByDate(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}
```

### SOLID

| Principio | Descripción | Aplicación |
|-----------|-------------|------------|
| **S**ingle Responsibility | Una clase tiene una sola razón para cambiar | Cada servicio/módulo tiene una responsabilidad única |
| **O**pen/Closed | Abierto para extensión, cerrado para modificación | Usar composición y estrategias |
| **L**iskov Substitution | Sustitutos deben ser intercambiables | Interfaces bien definidas |
| **I**nterface Segregation | Preferir interfaces específicas | No crear interfaces monolíticas |
| **D**ependency Inversion | Depender de abstracciones, no de concreciones | Usar inyección de dependencias |

### DRY (Don't Repeat Yourself)

- Cada pieza de conocimiento debe tener una representación única.
- Código duplicado = mantenimiento duplicado = problemas duplicados.
- Usar abstracciones, helpers y utilities cuando sea necesario.

```typescript
// ❌ Mal: lógica duplicada
async function createUserEmail(user: User) { /* lógica de email */ }
async function createAdminEmail(admin: Admin) { /* misma lógica de email */ }

// ✅ Bien: abstracción compartida
async function sendEmail(address: string, template: EmailTemplate) { /* lógica centralizada */ }
```

### KISS (Keep It Simple, Stupid)

- Las soluciones simples son más mantenibles que las complejas.
- Evitar sobreingeniería: no diseñar para requisitos que no existen.
- Preferir código claro y directo.

### Fail Fast

- Validar temprano y fallar temprano.
- Las validaciones deben estar lo más cerca posible de la fuente del problema.
- Mensajes de error claros y accionables.

### Separation of Concerns

Cada capa tiene responsabilidades claramente definidas:

| Capa | Responsabilidad |
|------|-----------------|
| **Controller** | Recibir requests, validar input básico, delegar a servicio |
| **Service** | Lógica de negocio, validaciones, orquestación |
| **Repository** | Acceso a datos, consultas a la base de datos |
| **Middleware** | Cross-cutting concerns (auth, logging, errors) |

---

## Arquitectura

### Feature-Based Architecture

```
src/modules/
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.repository.ts
│   ├── products.routes.ts
│   └── products.schemas.ts
├── inventory/
│   └── ...
└── orders/
    └── ...
```

**Beneficios:**

- Cohesión: todo lo relacionado a un feature está en un solo lugar.
- Escalabilidad: agregar features no modifica código existente.
- Testing: cada feature puede probarse de forma aislada.

---

## Convenciones

### Nomenclatura de Archivos

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Archivos TypeScript | kebab-case | `product-service.ts` |
| Clases | PascalCase | `ProductService` |
| Interfaces | PascalCase | `IProductRepository` |
| Types | PascalCase | `CreateProductDto` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Enums | PascalCase (miembros UPPER_SNAKE) | `OrderStatus.PENDING` |

### TypeScript

- Usar `interface` para objetos y `type` para uniones/primitivos.
- Evitar `any`; usar `unknown` cuando el tipo sea genuinamente desconocido.
- Usar optional chaining (`?.`) y nullish coalescing (`??`).
- Usar `readonly` para propiedades que no deben mutar.
- Usar `enum` solo para conjuntos cerrados de valores.

```typescript
// ✅ Bueno
interface Product {
  readonly id: string;
  name: string;
  price: number;
  category?: Category;
}

type ProductCreate = Pick<Product, 'name' | 'price' | 'category'>;

// ❌ Evitar
interface Product {
  id: any;
  name: any;
  [key: string]: any;
}
```

### PostgreSQL y Prisma

**Convenciones:**

- Tablas en **plural**: `users`, `products`, `orders`
- Columnas en **snake_case**: `created_at`, `product_id`
- Modelos Prisma en **singular** con `@map` para el nombre de tabla:

```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  sku       String   @unique @map("sku")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("products")
}
```

**Reglas:**

- Siempre incluir `createdAt` y `updatedAt` en modelos.
- Usar UUID para IDs públicos.
- Usar `@relation` explícitas para claridad.
- Documentar relaciones complejas con comentarios.

### REST

| Método | Uso | Ejemplo |
|--------|-----|---------|
| `GET` | Consultar recursos | `GET /products` |
| `POST` | Crear recursos | `POST /products` |
| `PUT` | Reemplazar recursos | `PUT /products/:id` |
| `PATCH` | Actualizar parcialmente | `PATCH /products/:id` |
| `DELETE` | Eliminar recursos | `DELETE /products/:id` |

**Códigos de estado:**

- `200` OK - Solicitud exitosa
- `201` Created - Recurso creado
- `204` No Content - Eliminado exitosamente
- `400` Bad Request - Error de validación
- `404` Not Found - Recurso no encontrado
- `409` Conflict - Conflicto de datos
- `422` Unprocessable Entity - Regla de negocio violada
- `500` Internal Server Error - Error del servidor

---

## Validaciones

### Zod

Validar en la capa de entrada (controllers o middleware):

```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  sku: z.string().min(6).max(20).regex(/^[a-zA-Z0-9-]+$/),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  minStock: z.number().int().positive(),
  category: z.string().min(1),
  supplier: z.string().min(1)
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
```

### Validación de Reglas de Negocio

Las validaciones de reglas de negocio van en el **servicio**, no en el controlador:

```typescript
// ✅ En el servicio
class InventoryService {
  async adjustStock(productId: string, quantity: number, type: 'IN' | 'OUT') {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError('Producto no encontrado');
    }

    if (type === 'OUT' && product.stock < quantity) {
      throw new BusinessRuleError(
        `Stock insuficiente. Stock actual: ${product.stock}, solicitado: ${quantity}`
      );
    }

    return this.repository.adjust(productId, quantity, type);
  }
}
```

---

## Manejo de Errores

### Jerarquía de Errores

```
AppError (base)
├── ValidationError (400)
├── NotFoundError (404)
├── UnauthorizedError (401)
├── ConflictError (409)
├── BusinessRuleError (422)
└── InternalServerError (500)
```

### Principios

1. **Errors son valores:** No usar exceptions para control de flujo.
2. **Solo lanzar en casos excepcionales:** No usar try/catch para validaciones normales.
3. **Información contextual:** Incluir detalles útiles en el mensaje.
4. **No exponer información sensible:** En producción, no revelar stack traces.

### Ejemplo

```typescript
// ✅ Correcto
async function getProduct(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError(`Producto con id ${id} no encontrado`);
  }

  return product;
}

// ❌ Incorrecto
async function getProduct(id: string): Promise<Product> {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch (error) {
    throw new Error('Error de base de datos');
  }
}
```

---

## Logging

### Pino

Usar Pino para logging estructurado:

```typescript
import { logger } from '@shared/logger';

// ✅ Niveles apropiados
logger.info({ userId, productId }, 'Producto creado');
logger.warn({ balance }, 'Saldo bajo detectado');
logger.error({ err }, 'Error al procesar pago');

// ❌ Evitar
console.log('Producto creado');
console.error('Error');
```

**Niveles:**

| Nivel | Uso |
|-------|-----|
| `trace` | Detalle muy fino (desarrollo) |
| `debug` | Información de debug |
| `info` | Eventos normales |
| `warn` | Situaciones inesperadas pero manejables |
| `error` | Errores que requieren atención |
| `fatal` | Errores críticos del sistema |

### Reglas

- Nunca loggear información sensible (passwords, tokens, datos personales).
- Incluir contexto relevante (IDs, entidades relacionadas).
- Usar estructuras planas, no objetos anidados profundos.

---

## Testing

### Estrategia

1. **Unit Tests:** Lógica de negocio aislada (servicios).
2. **Integration Tests:** Endpoints de API con Supertest.
3. **Coverage mínimo:** 80% para lógica de negocio.

### Estructura

```
tests/
├── setup.ts              # Config global
├── fixtures/            # Datos de prueba
├── unit/
│   └── services/
│       └── product.service.test.ts
└── integration/
    └── routes/
        └── health.test.ts
```

### Principios

- **FIRST:** Fast, Independent, Repeatable, Self-validating, Timely.
- Un test debe poder ejecutarse en cualquier orden.
- No depender de estado global.
- Nombres descriptivos: `should return 404 when product does not exist`.

---

## Transacciones

Usar transacciones para operaciones que modifican múltiples entidades:

```typescript
async function processOrder(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: 'RECEIVED' }
    });

    await tx.product.update({
      where: { id: order.productId },
      data: { stock: { increment: order.quantity } }
    });

    await tx.alert.updateMany({
      where: { productId: order.productId, status: 'ACTIVE' },
      data: { status: 'RESOLVED' }
    });

    return order;
  });
}
```

---

## Git

### Commits (Conventional Commits)

```
feat: agregar validación de stock mínimo
fix: corregir cálculo de precio total en órdenes
docs: actualizar README con instrucciones de instalación
style: formatear código con Prettier
refactor: separar lógica de inventario en servicio dedicado
test: agregar pruebas para alertas de stock
chore: actualizar dependencias
```

### Reglas

- Commits atómicos: un commit = una unidad de trabajo.
- Mensajes descriptivos: explicar el "por qué", no el "qué".
- No commitear código con `TODO` o `FIXME` sin ticket asociado.
- Proteger `main`/`master`: solo merge via PR.

---

## Reglas para Futuros Commits

1. **Cada commit debe compilar** y pasar los tests.
2. **Revisar antes de commitear:** ejecutar `npm run lint` y `npm test`.
3. **Mensajes claros:** seguir Conventional Commits.
4. **No romper backward compatibility** sin justificación.
5. **Documentar cambios significativos** en el README o archivos relevantes.

---

## Recursos Adicionales

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://prisma.io/docs)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Zod Documentation](https://zod.dev)
- [Jest Documentation](https://jestjs.io/docs)
