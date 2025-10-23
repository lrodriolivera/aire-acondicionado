# Guía de Desarrollo

Esta guía está dirigida a desarrolladores que quieran contribuir al proyecto o extender sus funcionalidades.

## Índice

1. [Setup del Entorno de Desarrollo](#setup-del-entorno-de-desarrollo)
2. [Estructura del Código](#estructura-del-código)
3. [Convenciones de Código](#convenciones-de-código)
4. [Flujo de Trabajo Git](#flujo-de-trabajo-git)
5. [Testing](#testing)
6. [Debugging](#debugging)
7. [Agregar Nuevas Funcionalidades](#agregar-nuevas-funcionalidades)
8. [Performance](#performance)
9. [Seguridad](#seguridad)

---

## Setup del Entorno de Desarrollo

### Prerequisitos

```bash
# Versiones mínimas requeridas
node --version  # v18.0.0 o superior
npm --version   # v9.0.0 o superior
git --version   # v2.30.0 o superior
```

### Instalación Local

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/lrodriolivera/aire-acondicionado.git
cd aire-acondicionado
```

#### 2. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### 3. Configurar Variables de Entorno

**Backend (.env):**

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env`:

```env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ac_platform

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=desarrollo-secret-cambiar-en-produccion
JWT_REFRESH_SECRET=desarrollo-refresh-secret-cambiar
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# MQTT (opcional)
MQTT_BROKER_URL=mqtt://localhost:1883

# Logging
LOG_LEVEL=debug
```

**Frontend (.env.local):**

```bash
cd frontend
cp .env.example .env.local
```

Editar `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

#### 4. Setup de Base de Datos

**Opción A: Con Docker (Recomendado)**

```bash
# Desde la raíz del proyecto
docker-compose up -d postgres redis

# Esperar que los servicios estén listos
docker-compose ps

# Ejecutar migraciones
psql -U postgres -h localhost -p 5432 -d ac_platform -f backend/init.sql

# Cargar datos de prueba
psql -U postgres -h localhost -p 5432 -d ac_platform -f backend/seed-data.sql
```

**Opción B: PostgreSQL Local**

```bash
# Crear base de datos
createdb ac_platform

# O con psql
psql -U postgres
CREATE DATABASE ac_platform;
\q

# Ejecutar migraciones
psql -U postgres -d ac_platform -f backend/init.sql

# Cargar datos de prueba
psql -U postgres -d ac_platform -f backend/seed-data.sql
```

#### 5. Iniciar Servicios

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Deberías ver:
```
Server running on port 3000 in development mode
Database connected
Redis connected
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Deberías ver:
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### 6. Verificar Setup

1. Abrir http://localhost:5173
2. Login con: `admin@acplatform.com` / `admin123`
3. Deberías ver el dashboard con datos de prueba

---

## Estructura del Código

### Backend

```
backend/src/
├── adapters/           # Adaptadores de protocolos IoT
│   ├── AdapterFactory.ts
│   ├── BaseAdapter.ts
│   ├── MQTTAdapter.ts
│   └── HTTPAdapter.ts
│
├── config/            # Configuraciones
│   ├── index.ts          # Config principal
│   ├── database.ts       # Conexión PostgreSQL
│   └── redis.ts          # Conexión Redis
│
├── controllers/       # Controladores HTTP
│   ├── auth.controller.ts
│   ├── device.controller.ts
│   ├── device-control.controller.ts
│   └── ...
│
├── middleware/        # Middlewares Express
│   ├── auth.ts           # Autenticación JWT
│   ├── errorHandler.ts   # Manejo de errores
│   ├── rateLimiter.ts    # Rate limiting
│   └── validation.ts     # Validación de inputs
│
├── routes/            # Definición de rutas
│   ├── index.ts          # Router principal
│   ├── auth.routes.ts
│   ├── device.routes.ts
│   └── ...
│
├── services/          # Lógica de negocio
│   ├── auth.service.ts
│   ├── device.service.ts
│   ├── device-control.service.ts
│   ├── telemetry.service.ts
│   ├── alert.service.ts
│   ├── scheduler.service.ts
│   └── ...
│
├── types/             # Definiciones TypeScript
│   └── index.ts
│
├── utils/             # Utilidades
│   ├── logger.ts
│   ├── password.ts
│   └── jwt.ts
│
└── index.ts           # Punto de entrada
```

### Frontend

```
frontend/src/
├── components/        # Componentes reutilizables
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── ...
│
├── pages/             # Páginas de la aplicación
│   ├── Dashboard.tsx
│   ├── Devices.tsx
│   ├── DeviceDetail.tsx
│   ├── Locations.tsx
│   ├── Schedules.tsx
│   ├── Alerts.tsx
│   ├── Users.tsx
│   ├── Settings.tsx
│   └── Login.tsx
│
├── services/          # Servicios de API
│   ├── api.ts            # Cliente Axios configurado
│   ├── auth.service.ts
│   ├── device.service.ts
│   ├── location.service.ts
│   └── ...
│
├── types/             # Tipos TypeScript
│   └── index.ts
│
├── utils/             # Utilidades
│   └── format.ts
│
├── App.tsx            # Componente raíz
└── main.tsx           # Punto de entrada
```

---

## Convenciones de Código

### TypeScript

- **Tipado estricto:** No usar `any` sin justificación
- **Interfaces vs Types:** Usar interfaces para objetos, types para uniones/intersecciones
- **Naming:**
  - Interfaces: PascalCase (`DeviceStatus`)
  - Types: PascalCase (`CommandType`)
  - Variables: camelCase (`deviceId`)
  - Constantes: UPPER_SNAKE_CASE (`MAX_RETRIES`)
  - Archivos: kebab-case (`device-control.service.ts`)

### JavaScript/TypeScript Style

```typescript
// ✅ Bueno
interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
}

const getDeviceById = async (id: string): Promise<Device> => {
  const device = await deviceService.getById(id);
  return device;
};

// ❌ Malo
interface device {  // Debe ser PascalCase
  id: any;          // Evitar any
  Name: string;     // Debe ser camelCase
}

function GetDeviceById(id) {  // Debe ser camelCase, sin tipos
  // ...
}
```

### Estructura de Archivos

- Un componente/servicio/controller por archivo
- Nombre del archivo = nombre de la clase/componente
- Index files para re-exportar

```typescript
// services/device.service.ts
export class DeviceService {
  // ...
}
export default new DeviceService();

// services/index.ts
export { default as deviceService } from './device.service';
export { default as authService } from './auth.service';
```

### Comentarios

```typescript
// ✅ Buenos comentarios - explican el "por qué"
// Usamos modo demo para dispositivos de prueba que no tienen hardware real
const isDemoMode = device.serial_number?.includes('2024');

/**
 * Envía un comando a un dispositivo y actualiza su estado
 * @param deviceId - UUID del dispositivo
 * @param commandType - Tipo de comando a ejecutar
 * @param parameters - Parámetros específicos del comando
 * @returns Promise que resuelve cuando el comando se completa
 */
async sendCommand(deviceId: string, commandType: CommandType, parameters: any): Promise<void>

// ❌ Malos comentarios - redundantes
// Obtiene el dispositivo por ID
const device = await getById(id);
```

### Error Handling

```typescript
// ✅ Bueno
try {
  const device = await deviceService.getById(id);
  await deviceControlService.sendCommand(id, command);
} catch (error) {
  logger.error('Failed to send command', { deviceId: id, error });
  throw ApiError.internal('Command execution failed');
}

// ❌ Malo
try {
  const device = await deviceService.getById(id);
} catch (e) {
  console.log(e);  // No loggear a console
  throw e;         // No hacer re-throw sin contexto
}
```

---

## Flujo de Trabajo Git

### Branches

- `main` - Producción (siempre estable)
- `develop` - Desarrollo activo
- `feature/*` - Nuevas características
- `bugfix/*` - Corrección de bugs
- `hotfix/*` - Fixes urgentes para producción

### Workflow

```bash
# 1. Crear feature branch desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar
# ... hacer cambios ...

# 3. Commits frecuentes
git add .
git commit -m "feat: agregar funcionalidad X"

# 4. Push a GitHub
git push origin feature/nueva-funcionalidad

# 5. Crear Pull Request en GitHub
# - Base: develop
# - Compare: feature/nueva-funcionalidad

# 6. Después del code review y merge
git checkout develop
git pull origin develop
git branch -d feature/nueva-funcionalidad
```

### Conventional Commits

Usar prefijos estándar en commits:

```bash
# Tipos de commits
feat:     # Nueva funcionalidad
fix:      # Corrección de bug
docs:     # Cambios en documentación
style:    # Formato, no cambia código
refactor: # Refactorización
test:     # Agregar o modificar tests
chore:    # Mantenimiento, deps, etc.

# Ejemplos
git commit -m "feat: add temperature history chart"
git commit -m "fix: resolve CORS issue in production"
git commit -m "docs: update API documentation"
git commit -m "refactor: extract device adapter logic"
git commit -m "test: add unit tests for auth service"
```

---

## Testing

### Backend Tests

```bash
cd backend

# Ejecutar todos los tests
npm test

# Ejecutar con coverage
npm run test:coverage

# Ejecutar en watch mode
npm run test:watch

# Ejecutar tests específicos
npm test -- device.service.test.ts
```

### Escribir Tests

```typescript
// backend/src/services/__tests__/device.service.test.ts
import { deviceService } from '../device.service';
import database from '../../config/database';

describe('DeviceService', () => {
  beforeEach(async () => {
    // Setup test database
    await database.query('DELETE FROM devices');
  });

  afterAll(async () => {
    await database.end();
  });

  describe('getAll', () => {
    it('should return all devices', async () => {
      // Arrange
      await database.query(`
        INSERT INTO devices (model_id, name, serial_number)
        VALUES ($1, $2, $3)
      `, ['model-id', 'Test AC', 'TEST-001']);

      // Act
      const devices = await deviceService.getAll();

      // Assert
      expect(devices).toHaveLength(1);
      expect(devices[0].name).toBe('Test AC');
    });

    it('should filter by status', async () => {
      // ...
    });
  });

  describe('create', () => {
    it('should create a new device', async () => {
      // ...
    });

    it('should throw error if serial number exists', async () => {
      // ...
    });
  });
});
```

### Frontend Tests

```bash
cd frontend

# Ejecutar tests
npm test

# Con UI
npm run test:ui
```

```typescript
// frontend/src/components/__tests__/DeviceCard.test.tsx
import { render, screen } from '@testing-library/react';
import { DeviceCard } from '../DeviceCard';

describe('DeviceCard', () => {
  it('renders device information', () => {
    const device = {
      id: '1',
      name: 'AC Cafetería',
      temperature: 24,
      status: 'online'
    };

    render(<DeviceCard device={device} />);

    expect(screen.getByText('AC Cafetería')).toBeInTheDocument();
    expect(screen.getByText('24°C')).toBeInTheDocument();
  });
});
```

---

## Debugging

### Backend

#### VSCode Debug Configuration

Crear `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/index.ts",
      "preLaunchTask": "tsc: build - backend/tsconfig.json",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### Logging

```typescript
import logger from './utils/logger';

// Diferentes niveles
logger.error('Critical error', { error, context });
logger.warn('Warning message', { data });
logger.info('Info message', { userId });
logger.debug('Debug details', { request, response });

// Con contexto estructurado
logger.info('Command executed', {
  deviceId,
  commandType,
  userId,
  timestamp: new Date()
});
```

### Frontend

#### React DevTools

1. Instalar extensión [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
2. Abrir en navegador (F12) → Tab "Components"
3. Inspeccionar componentes, props, state

#### Redux DevTools (React Query)

```typescript
// Ya configurado en App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ...
    }
  }
});

// Ver en React Query DevTools (aparece automáticamente en desarrollo)
```

#### Network Debugging

```javascript
// En console del navegador
localStorage.setItem('debug', 'axios');

// O en código
axios.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});
```

---

## Agregar Nuevas Funcionalidades

### Ejemplo: Agregar nuevo tipo de comando

#### 1. Backend

**types/index.ts:**

```typescript
export enum CommandType {
  SET_POWER = 'setPower',
  SET_TEMPERATURE = 'setTemperature',
  SET_MODE = 'setMode',
  SET_FAN_SPEED = 'setFanSpeed',
  SET_SWING = 'setSwing',  // ← Nuevo
}
```

**services/device-control.service.ts:**

```typescript
async sendCommand(...) {
  // ...

  if (isDemoMode) {
    // ...

    // Agregar nuevo caso
    else if (commandType === CommandType.SET_SWING && parameters.swing !== undefined) {
      await deviceService.updateStatus(deviceId, {
        swing_state: parameters.swing
      });
    }
  }

  // ...
}
```

#### 2. Frontend

**types/index.ts:**

```typescript
export enum CommandType {
  SET_POWER = 'setPower',
  SET_TEMPERATURE = 'setTemperature',
  SET_MODE = 'setMode',
  SET_FAN_SPEED = 'setFanSpeed',
  SET_SWING = 'setSwing',  // ← Nuevo
}

export interface DeviceStatus {
  // ...
  swing_state?: boolean;  // ← Nuevo
}
```

**pages/DeviceDetail.tsx:**

```typescript
const sendCommand = (commandType: CommandType, value: any) => {
  let parameters: any = {};

  switch (commandType) {
    // ... casos existentes

    case CommandType.SET_SWING:  // ← Nuevo
      parameters = { swing: value };
      break;
  }

  commandMutation.mutate({ deviceId: id, commandType, parameters });
};
```

Agregar en UI:

```typescript
{/* Swing Control */}
<div>
  <label>Oscilación</label>
  <div className="flex space-x-4">
    <button
      onClick={() => sendCommand(CommandType.SET_SWING, true)}
      className={device.swing_state ? 'bg-blue-600' : 'bg-gray-100'}
    >
      Encender
    </button>
    <button
      onClick={() => sendCommand(CommandType.SET_SWING, false)}
      className={!device.swing_state ? 'bg-blue-600' : 'bg-gray-100'}
    >
      Apagar
    </button>
  </div>
</div>
```

#### 3. Database Migration

```sql
-- Agregar columna a device_status
ALTER TABLE device_status ADD COLUMN swing_state BOOLEAN DEFAULT false;
```

#### 4. Tests

```typescript
describe('SET_SWING command', () => {
  it('should update swing state', async () => {
    await deviceControlService.sendCommand(
      deviceId,
      userId,
      CommandType.SET_SWING,
      { swing: true }
    );

    const device = await deviceService.getById(deviceId);
    expect(device.swing_state).toBe(true);
  });
});
```

---

## Performance

### Backend Optimizations

#### 1. Database Queries

```typescript
// ❌ N+1 Problem
const devices = await database.query('SELECT * FROM devices');
for (const device of devices.rows) {
  const status = await database.query('SELECT * FROM device_status WHERE device_id = $1', [device.id]);
}

// ✅ Mejor: JOIN
const devices = await database.query(`
  SELECT d.*, ds.*
  FROM devices d
  LEFT JOIN device_status ds ON d.id = ds.device_id
`);
```

#### 2. Caching

```typescript
// Usar Redis para datos frecuentes
import redis from './config/redis';

async getDeviceStatus(deviceId: string) {
  // Intentar obtener del cache
  const cached = await redis.get(`device:${deviceId}:status`);
  if (cached) return JSON.parse(cached);

  // Si no está en cache, obtener de DB
  const status = await database.query(...);

  // Guardar en cache (30 segundos)
  await redis.setex(`device:${deviceId}:status`, 30, JSON.stringify(status));

  return status;
}
```

#### 3. Índices de Base de Datos

```sql
-- Agregar índices para queries frecuentes
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_telemetry_device_time ON telemetry(device_id, timestamp DESC);
CREATE INDEX idx_commands_device_status ON device_commands(device_id, status);
```

### Frontend Optimizations

#### 1. Code Splitting

```typescript
// Lazy load de rutas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Devices = lazy(() => import('./pages/Devices'));

// En Router
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/devices" element={<Devices />} />
  </Routes>
</Suspense>
```

#### 2. Memoization

```typescript
// Memorizar cálculos pesados
const expensiveCalculation = useMemo(() => {
  return devices.reduce((acc, device) => {
    // cálculo complejo
  }, 0);
}, [devices]);

// Memorizar callbacks
const handleDeviceClick = useCallback((deviceId: string) => {
  navigate(`/devices/${deviceId}`);
}, [navigate]);
```

#### 3. React Query Optimizations

```typescript
const { data: devices } = useQuery({
  queryKey: ['devices'],
  queryFn: deviceService.getAll,
  staleTime: 5 * 60 * 1000,     // 5 minutos
  cacheTime: 10 * 60 * 1000,    // 10 minutos
  refetchOnWindowFocus: false,   // No refetch al focus
  refetchInterval: 30000,        // Refetch cada 30s
});
```

---

## Seguridad

### Checklist de Seguridad

- [ ] Contraseñas hasheadas con bcrypt (10+ rounds)
- [ ] Tokens JWT con expiración corta
- [ ] Validación de inputs (backend y frontend)
- [ ] SQL queries parametrizadas (prevención SQL injection)
- [ ] CORS configurado correctamente
- [ ] Rate limiting en endpoints sensibles
- [ ] HTTPS en producción
- [ ] Variables sensibles en `.env` (nunca en código)
- [ ] Sanitización de outputs (prevención XSS)
- [ ] Autenticación para WebSockets
- [ ] Logs sin información sensible

### Ejemplos

```typescript
// ✅ Seguro
const user = await database.query(
  'SELECT * FROM users WHERE email = $1',
  [email]  // Parametrizado
);

// ❌ Inseguro - SQL Injection
const user = await database.query(
  `SELECT * FROM users WHERE email = '${email}'`  // Concatenación
);

// ✅ Seguro - Validación de inputs
if (!/^[a-zA-Z0-9_-]+$/.test(deviceId)) {
  throw new Error('Invalid device ID');
}

// ❌ Inseguro - Sin validación
const device = await getDevice(req.params.id);
```

---

## Recursos Útiles

### Documentación

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Socket.io](https://socket.io/docs/)
- [React Query](https://tanstack.com/query/latest)

### Tools

- **VSCode Extensions:**
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - GitLens
  - Thunder Client (REST API testing)

- **Database Tools:**
  - TablePlus
  - DBeaver
  - pgAdmin

### Comunidad

- GitHub Issues: Reportar bugs
- GitHub Discussions: Preguntas y discusiones
- Email: dev@acplatform.com

---

¡Happy coding! 🚀
