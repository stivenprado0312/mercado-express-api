# MercadoExpress API

API REST para gestión de inventario de MercadoExpress.

## Descripción

Sistema de gestión de inventario para cadena de tiendas minoristas. Controla stock de productos, genera alertas automáticas cuando el stock baja del umbral mínimo, y gestiona órdenes de compra a proveedores.

## Arquitectura

**Feature-Based Architecture** - Código organizado por dominio de negocio:

```
src/
├── config/           # Variables de entorno
├── database/         # Cliente Prisma
├── middlewares/      # Middlewares Express
├── modules/          # Módulos de dominio
│   ├── products/
│   ├── inventory/
│   ├── alerts/
│   └── purchase-orders/
├── shared/
│   ├── constants/    # Constantes compartidas
│   ├── errors/       # Errores personalizados
│   ├── utils/        # Utilidades
│   └── middlewares/  # Middlewares compartidos
├── app.ts
└── server.ts
```

### Justificación Técnica

| Decisión | Razón |
|----------|-------|
| Feature-based | Código cohesionado por dominio, fácil de escalar |
| TypeScript | Tipado estático = mayor seguridad |
| Prisma ORM | Type-safe, migrations automáticas |
| Zod | Validación con inferencia de tipos |
| State Machine | Patrón para transiciones de órdenes (OCP compliant) |

## Stack Tecnológico

| Tecnología | Propósito |
|------------|-----------|
| Node.js LTS | Runtime |
| Express 4.x | Framework API REST |
| TypeScript 5.x | Lenguaje tipado |
| Prisma 5.x | ORM |
| PostgreSQL 16 | Base de datos relacional |
| Zod 3.x | Validación de schemas |
| Pino 9.x | Logging |
| Swagger | Documentación interactiva |
| Jest + Supertest | Testing |
| ESLint + Prettier | Linting y formateo |

## Instalación

### Requisitos
- Node.js LTS (v22.x)
- PostgreSQL 16
- Docker (opcional)

### Pasos

```bash
# 1. Clonar e instalar
git clone <url>
cd mercado-express-api
npm install

# 2. Configurar entorno
cp .env.example .env
# Editar .env con DATABASE_URL

# 3. Generar cliente Prisma y migrar
npm run prisma:generate
npm run prisma:migrate

# 4. Iniciar
npm run dev
```

### Docker (PostgreSQL)

```bash
docker compose up -d
```

Variables de entorno necesarias:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:admin@localhost:5432/mercado_express
LOG_LEVEL=info
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor desarrollo (hot-reload) |
| `npm run build` | Compilar TypeScript |
| `npm run start` | Servidor producción |
| `npm run lint` | Verificar código |
| `npm run test` | Ejecutar pruebas |
| `npm run test:coverage` | Reporte de cobertura |
| `npm run prisma:studio` | GUI de Prisma |

## Endpoints

### Health
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |

### Products (RF-01)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/products` | Crear producto |
| GET | `/products` | Listar productos |
| GET | `/products/:id` | Obtener por ID |

### Inventory (RF-02, RF-03)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/inventory/adjust` | Ajustar stock |
| GET | `/inventory` | Consultar inventario |
| GET | `/inventory/movements/:productId` | Historial movimientos |

### Alerts (RF-03)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/alerts` | Listar alertas |
| GET | `/alerts/:id` | Obtener alerta |
| POST | `/alerts/:id/resolve` | Resolver alerta |

### Purchase Orders (RF-04, RF-05)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/purchase-orders` | Crear orden |
| GET | `/purchase-orders` | Listar órdenes |
| GET | `/purchase-orders/:id` | Obtener orden |
| PATCH | `/purchase-orders/:id/approve` | Aprobar (PENDING→APPROVED) |
| PATCH | `/purchase-orders/:id/reject` | Rechazar (PENDING→REJECTED) |
| PATCH | `/purchase-orders/:id/receive` | Recibir (APPROVED→RECEIVED) |

## Testing

```bash
npm test                    # Todas las pruebas
npm run test:coverage       # Con cobertura
```

| Tipo | Cantidad |
|------|----------|
| Unitarios | 27 |
| Integración | 29 |
| **Total** | **56** |

Documentación API interactiva: `http://localhost:3000/docs`

## Commits

Conventional Commits:
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
refactor: refactorización
test: pruebas
```

## Modelo de Datos

Entidades: **Product**, **InventoryMovement**, **Alert**, **PurchaseOrder**

Ver `prisma/schema.prisma` para detalle completo de campos y relaciones.
