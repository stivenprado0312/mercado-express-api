# MercadoExpress API

API REST para gestión de inventario de MercadoExpress.

## Descripción

Sistema de gestión de inventario para la cadena de tiendas minoristas MercadoExpress. Permite controlar el stock de productos, generar alertas automáticas cuando el stock baja de un umbral mínimo, y gestionar órdenes de compra a proveedores.

## Objetivo

Este proyecto forma parte de una prueba técnica para evaluar habilidades en diseño arquitectónico, implementación de APIs REST con Node.js, TypeScript y PostgreSQL.

## Arquitectura

Se utiliza una **Arquitectura Basada en Features** (Feature-Based Architecture) que separa el código por funcionalidad del dominio, facilitando:

- Escalabilidad modular
- Separation of Concerns
- Mantenibilidad
- Testing

```
src/
├── config/           # Configuración de variables de entorno
├── database/         # Cliente Prisma
├── middlewares/      # Middlewares Express (404, error handler)
├── modules/          # Módulos de dominio (vacío en base inicial)
├── shared/           # Código compartido
│   ├── constants/    # Constantes de la aplicación
│   ├── errors/       # Clases de errores personalizados
│   ├── logger/       # Configuración de Pino
│   ├── responses/    # Helpers de respuesta HTTP
│   ├── swagger/       # Configuración de Swagger
│   ├── utils/        # Utilidades comunes
│   └── validators/  # Validadores Zod
├── app.ts            # Configuración de Express
└── server.ts         # Punto de entrada
```

## Justificación Técnica

### Feature-Based Architecture

Esta arquitectura organiza el código por dominio de negocio (features), no por tipo técnico. Cada feature contiene:

- Controladores
- Servicios
- Repositorios
- Rutas
- Modelos de datos

**Ventajas:**
- Código relacionado está cohesionado
- Facilita agregar nuevos features sin modificar código existente
- Mejor organización para equipos grandes
- Escalabilidad horizontal del código

### Stack Tecnológico

| Tecnología | Justificación |
|------------|---------------|
| **Node.js LTS** | Runtime estable con soporte a largo plazo |
| **Express** | Framework minimalista y flexible para APIs REST |
| **TypeScript** | Tipado estático para mayor seguridad y mantenibilidad |
| **Prisma ORM** | ORM type-safe con migrations automáticas |
| **PostgreSQL** | Base de datos relacional robusta y escalable |
| **Zod** | Validación de esquemas con inferencia de tipos |
| **Pino** | Logging performante con estructura JSON |
| **Swagger** | Documentación interactiva de APIs |
| **Jest + Supertest** | Testing unitario e integración |
| **ESLint + Prettier** | Calidad y consistencia de código |
| **Husky** | Git hooks para calidad pre-commit |

## Tecnologías

- **Runtime:** Node.js LTS (22.x)
- **Framework:** Express 4.x
- **Lenguaje:** TypeScript 5.x
- **ORM:** Prisma 5.x
- **Base de datos:** PostgreSQL 16
- **Validación:** Zod 3.x
- **Logging:** Pino 9.x
- **Documentación:** Swagger (OpenAPI 3.0)
- **Testing:** Jest 29.x + Supertest 7.x
- **Linting:** ESLint 9.x + Prettier 3.x
- **Git Hooks:** Husky 9.x + lint-staged 15.x
- **Contenedores:** Docker + Docker Compose

## Instalación

### Requisitos Previos

- Node.js LTS (v22.x o superior)
- npm o yarn
- PostgreSQL 16 (local o Docker)
- Docker y Docker Compose (opcional)

### Pasos

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd mercado-express-api
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` con las credenciales de la base de datos:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:admin@localhost:5432/mercado_express?schema=public
LOG_LEVEL=info
```

4. **Generar cliente Prisma**

```bash
npm run prisma:generate
```

5. **Ejecutar migraciones**

```bash
npm run prisma:migrate
```

6. **Iniciar el servidor**

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución (development, production, test) | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | - |
| `LOG_LEVEL` | Nivel de logging (trace, debug, info, warn, error, fatal) | `info` |

## Docker

### Usando Docker Compose

Para levantar PostgreSQL y pgAdmin:

```bash
docker compose up -d
```

Esto iniciara:

- **PostgreSQL** en puerto 5432
- **pgAdmin** en puerto 5050 (http://localhost:5050)

### Credenciales

**PostgreSQL:**
- Host: localhost
- Puerto: 5432
- Usuario: postgres
- Contraseña: admin
- Base de datos: mercado_express

**pgAdmin:**
- Email: admin@admin.com
- Contraseña: admin

## Prisma

### Comandos comunes

```bash
# Generar cliente Prisma
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio

# Resetear base de datos
npx prisma migrate reset
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Iniciar servidor en modo desarrollo con hot-reload |
| `npm run build` | Compilar TypeScript a JavaScript |
| `npm run start` | Iniciar servidor con código compilado |
| `npm run lint` | Verificar código con ESLint |
| `npm run lint:fix` | Corregir errores de lint automáticamente |
| `npm run test` | Ejecutar pruebas |
| `npm run test:watch` | Ejecutar pruebas en modo watch |
| `npm run test:coverage` | Generar reporte de cobertura |
| `npm run prisma:generate` | Generar cliente Prisma |
| `npm run prisma:migrate` | Crear/aplicar migraciones |
| `npm run prisma:studio` | Abrir GUI de Prisma |

## Swagger

Documentación interactiva disponible en:

```
http://localhost:3000/docs
```

## Testing

### Ejecutar pruebas

```bash
# Todas las pruebas
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage
```

### Estructura de pruebas

```
tests/
├── setup.ts          # Configuración global de Jest
└── health.test.ts    # Pruebas del endpoint /health
```

## Convenciones

### Código

- **Archivos y carpetas:** kebab-case (ej: `user-service.ts`, `order-items/`)
- **TypeScript:** camelCase para variables, funciones y métodos
- **PostgreSQL:** snake_case para tablas y columnas
- **Prisma:** camelCase en modelos con `@map` y `@@map` para PostgreSQL
- **Constantes:** UPPER_SNAKE_CASE
- **Clases:** PascalCase
- **Interfaces:** PascalCase con prefijo `I` (opcional)

### Modelo de Datos

- **Modelos en singular:** `User`, `Product`, `Order`
- **Tablas en plural:** `users`, `products`, `orders`

### Commits

Seguimos **Conventional Commits**:

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, comas faltantes, etc.
refactor: refactorización de código
test: agregado de pruebas
chore: mantenimiento, dependencias, etc.
```

### Mensajes de API

Todos los mensajes de la API están en **español**.

## Flujo de Trabajo

1. Crear una nueva rama desde `main`:
   ```bash
   git checkout -b feature/nombre-del-feature
   ```

2. Implementar los cambios siguiendo las convenciones.

3. Ejecutar linter y pruebas:
   ```bash
   npm run lint
   npm test
   ```

4. Realizar commit con mensaje descriptivo:
   ```bash
   git add .
   git commit -m "feat: agregar módulo de productos"
   ```

5. Push y crear Pull Request.

## Próximos Pasos

- [ ] Implementar módulo de productos
- [ ] Implementar gestión de inventario (entradas/salidas)
- [ ] Implementar sistema de alertas de stock bajo
- [ ] Implementar órdenes de compra
- [ ] Agregar más pruebas unitarias e integración
- [ ] Configurar CI/CD
- [ ] Desplegar en nube

## Licencia

Privado - MercadoExpress
