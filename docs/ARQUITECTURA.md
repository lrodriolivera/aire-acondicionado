# Arquitectura del Sistema

## Visión General

La plataforma de gestión de aires acondicionados sigue una arquitectura de tres capas (3-tier architecture) con separación clara entre frontend, backend y capa de datos.

## Diagrama de Arquitectura

```
┌──────────────────────────────────────────────────────────────────┐
│                          CAPA DE PRESENTACIÓN                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Frontend (Vercel CDN)                        │   │
│  │                                                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │   React     │  │   React     │  │  TailwindCSS│      │   │
│  │  │  Components │  │   Query     │  │             │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │         React Router (Client-side routing)      │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTPS/REST API + WebSockets
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                        CAPA DE APLICACIÓN                          │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │             Backend API (Railway)                         │   │
│  │                                                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │  Express.js │  │  Socket.io  │  │ Middleware  │      │   │
│  │  │  Routing    │  │  Real-time  │  │  (Auth/Val) │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │         Business Logic (Services)                │     │   │
│  │  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │     │   │
│  │  │  │Device│  │ Auth │  │ Tele-│  │Alert │        │     │   │
│  │  │  │Contrl│  │      │  │metry │  │      │        │     │   │
│  │  │  └──────┘  └──────┘  └──────┘  └──────┘        │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │         Protocol Adapters                        │     │   │
│  │  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │     │   │
│  │  │  │ MQTT │  │ HTTP │  │Modbus│  │BACnet│        │     │   │
│  │  │  └──────┘  └──────┘  └──────┘  └──────┘        │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                          CAPA DE DATOS                             │
│                                                                    │
│  ┌───────────────────┐  ┌───────────────┐  ┌──────────────┐     │
│  │   PostgreSQL      │  │     Redis     │  │ MQTT Broker  │     │
│  │                   │  │               │  │              │     │
│  │ • Users           │  │ • Sessions    │  │ • Topics     │     │
│  │ • Devices         │  │ • Cache       │  │ • Pub/Sub    │     │
│  │ • Telemetry       │  │ • Rate Limit  │  │              │     │
│  │ • Commands        │  │               │  │              │     │
│  │ • Alerts          │  │               │  │              │     │
│  └───────────────────┘  └───────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                      DISPOSITIVOS FÍSICOS                          │
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Daikin  │  │Mitsubishi│  │ Carrier  │  │    LG    │        │
│  │   AC     │  │    AC    │  │    AC    │  │    AC    │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└──────────────────────────────────────────────────────────────────┘
```

## Componentes Principales

### 1. Frontend (React + TypeScript)

**Responsabilidades:**
- Interfaz de usuario reactiva
- Gestión de estado local (React Query)
- Comunicación con API REST
- WebSocket para actualizaciones en tiempo real
- Autenticación y autorización

**Tecnologías:**
- **React 18:** Framework principal
- **TypeScript:** Tipado estático
- **Vite:** Build tool y dev server
- **TailwindCSS:** Estilos utility-first
- **React Query:** State management y cache
- **React Router:** Navegación client-side
- **Socket.io Client:** WebSockets
- **Axios:** Cliente HTTP

**Estructura:**
```
src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas/vistas principales
├── services/        # Servicios de API
├── hooks/           # Custom hooks
├── types/           # Definiciones TypeScript
├── utils/           # Funciones auxiliares
└── App.tsx          # Componente raíz
```

### 2. Backend API (Node.js + Express)

**Responsabilidades:**
- API RESTful
- Autenticación JWT
- Lógica de negocio
- Gestión de dispositivos
- Procesamiento de comandos
- Telemetría y analytics
- WebSocket server para tiempo real

**Tecnologías:**
- **Node.js 18+:** Runtime
- **Express.js:** Framework web
- **TypeScript:** Tipado estático
- **Socket.io:** WebSockets bidireccionales
- **pg:** Cliente PostgreSQL
- **ioredis:** Cliente Redis
- **jsonwebtoken:** Autenticación JWT
- **bcrypt:** Hash de contraseñas
- **winston:** Logging estructurado

**Estructura:**
```
src/
├── adapters/         # Adaptadores de protocolos
│   ├── AdapterFactory.ts
│   ├── BaseAdapter.ts
│   ├── MQTTAdapter.ts
│   └── HTTPAdapter.ts
├── config/          # Configuraciones
│   ├── database.ts
│   ├── redis.ts
│   └── index.ts
├── controllers/     # Controladores HTTP
├── middleware/      # Middlewares Express
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── rateLimiter.ts
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
│   ├── auth.service.ts
│   ├── device.service.ts
│   ├── device-control.service.ts
│   ├── telemetry.service.ts
│   └── alert.service.ts
├── types/           # Tipos TypeScript
├── utils/           # Utilidades
└── index.ts         # Punto de entrada
```

### 3. Base de Datos (PostgreSQL)

**Modelo de Datos:**

```sql
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   brands    │──┐   │    models    │──┐   │   devices   │
│─────────────│  │   │──────────────│  │   │─────────────│
│ id (PK)     │  └──→│ brand_id(FK) │  └──→│ model_id(FK)│
│ name        │      │ name         │      │ name        │
│ logo_url    │      │ protocol_type│      │ serial_num  │
└─────────────┘      │ capabilities │      │ ip_address  │
                     │ connection   │      │ status      │
                     └──────────────┘      └─────────────┘
                                                  │
                     ┌────────────────────────────┴────────────┐
                     │                                         │
              ┌──────▼──────┐                     ┌───────────▼─────┐
              │device_status│                     │  device_commands│
              │─────────────│                     │─────────────────│
              │ device_id   │                     │ device_id (FK)  │
              │ temperature │                     │ user_id (FK)    │
              │ humidity    │                     │ command_type    │
              │ power_state │                     │ parameters      │
              │ mode        │                     │ status          │
              │ fan_speed   │                     │ executed_at     │
              └─────────────┘                     └─────────────────┘

┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  locations  │──┐   │    users     │      │   alerts    │
│─────────────│  │   │──────────────│      │─────────────│
│ id (PK)     │  │   │ id (PK)      │      │ device_id   │
│ name        │  │   │ email        │      │ type        │
│ parent_id   │  │   │ password_hash│      │ severity    │
│ type        │  │   │ role         │      │ message     │
└─────────────┘  │   │ permissions  │      │ acknowledged│
                 │   └──────────────┘      └─────────────┘
                 │
                 │   ┌──────────────┐
                 └──→│ schedules    │
                     │──────────────│
                     │ location_id  │
                     │ device_id    │
                     │ cron_expr    │
                     │ action       │
                     └──────────────┘
```

**Tablas Particionadas:**

La tabla `telemetry` está particionada por fecha para optimizar consultas históricas:

```sql
telemetry (parent)
├── telemetry_2025_01 (partition)
├── telemetry_2025_02 (partition)
└── telemetry_2025_03 (partition)
```

### 4. Caché (Redis)

**Uso de Redis:**

1. **Sesiones de Usuario:**
   - Key: `session:{userId}`
   - TTL: 7 días
   - Almacena: refresh tokens, preferencias

2. **Rate Limiting:**
   - Key: `ratelimit:{ip}:{endpoint}`
   - TTL: 1 minuto
   - Contador de requests

3. **Cache de Datos:**
   - Key: `device:{deviceId}:status`
   - TTL: 30 segundos
   - Estado actual del dispositivo

4. **Pub/Sub:**
   - Canal: `device:updates`
   - Para notificaciones en tiempo real

### 5. Adaptadores de Protocolos

**Patrón Factory:**

```typescript
AdapterFactory
├── createAdapter(type, config)
│   ├── MQTT → MQTTAdapter
│   ├── HTTP → HTTPAdapter
│   ├── Modbus → ModbusAdapter
│   └── BACnet → BACnetAdapter
```

**Interfaz Base:**

```typescript
abstract class BaseAdapter {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getStatus(): Promise<DeviceStatus>;
  abstract executeCommand(cmd: Command): Promise<void>;
}
```

## Flujos de Datos

### 1. Flujo de Autenticación

```
Usuario → Frontend → POST /api/auth/login → Backend
                                              │
                                              ├─ Validar credenciales (bcrypt)
                                              ├─ Generar JWT tokens
                                              ├─ Guardar refresh token en Redis
                                              ↓
Usuario ← Frontend ← { accessToken, refreshToken }
         │
         └─ Guardar en localStorage
         └─ Configurar headers para requests
```

### 2. Flujo de Control de Dispositivo

```
Usuario → Frontend: Click "Set Temperature 22°C"
           │
           ├─ POST /api/control/command
           │  {
           │    deviceId: "uuid",
           │    commandType: "setTemperature",
           │    parameters: { temperature: 22 }
           │  }
           ↓
         Backend: DeviceControlController
           │
           ├─ Validar autenticación (JWT)
           ├─ Validar parámetros
           │
           ↓
         DeviceControlService
           │
           ├─ Obtener info del dispositivo (DB)
           ├─ Crear comando en DB
           ├─ Verificar si es modo demo
           │
           ├─ SI es demo:
           │  ├─ Simular delay (500ms)
           │  └─ Actualizar estado en DB
           │
           ├─ NO es demo:
           │  ├─ AdapterFactory.createAdapter()
           │  ├─ adapter.executeCommand()
           │  └─ Enviar a dispositivo real (MQTT/HTTP)
           │
           ├─ Marcar comando como completado
           ├─ Emitir evento WebSocket
           │
           ↓
Frontend: Recibe evento WebSocket
         │
         ├─ React Query refetch
         └─ UI actualiza automáticamente
```

### 3. Flujo de Telemetría

```
Dispositivo AC → MQTT/HTTP → Adapter
                               │
                               ├─ Parsear mensaje
                               ├─ Validar datos
                               │
                               ↓
                         TelemetryService
                               │
                               ├─ Guardar en telemetry (DB particionada)
                               ├─ Actualizar device_status
                               ├─ Actualizar cache (Redis)
                               ├─ Verificar umbrales
                               │
                               ├─ SI hay anomalía:
                               │  └─ AlertService.create()
                               │
                               ├─ Emitir evento WebSocket
                               │
                               ↓
Frontend: Dashboard actualiza en tiempo real
```

### 4. Flujo de Alertas

```
AlertService: Detecta condición
         │
         ├─ Crear alerta en DB
         ├─ Determinar severidad (info, warning, critical)
         ├─ Emitir WebSocket a usuarios conectados
         │
         ↓
Frontend: Recibe alerta
         │
         ├─ Mostrar notificación toast
         ├─ Actualizar badge de alertas
         ├─ SI es critical:
         │  └─ Reproducir sonido
         └─ Agregar a lista de alertas
```

## Patrones de Diseño Implementados

### 1. Factory Pattern

**AdapterFactory:** Crea adaptadores según el protocolo

```typescript
class AdapterFactory {
  static createAdapter(
    type: ProtocolType,
    config: ConnectionConfig
  ): BaseAdapter {
    switch(type) {
      case 'mqtt': return new MQTTAdapter(config);
      case 'http': return new HTTPAdapter(config);
      case 'modbus': return new ModbusAdapter(config);
      default: throw new Error('Unknown protocol');
    }
  }
}
```

### 2. Repository Pattern

**Services:** Abstracción de acceso a datos

```typescript
class DeviceService {
  async getAll(filters): Promise<Device[]> {
    // Lógica de acceso a datos
  }

  async getById(id): Promise<Device> {
    // Lógica de acceso a datos
  }
}
```

### 3. Middleware Pattern

**Express Middleware Chain:**

```typescript
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);
app.use('/api/devices', authenticate, authorize('admin'), deviceRoutes);
```

### 4. Observer Pattern

**WebSocket Event System:**

```typescript
// Backend emite eventos
socket.emit('device:updated', deviceData);

// Frontend escucha eventos
socket.on('device:updated', (data) => {
  queryClient.refetchQueries(['devices']);
});
```

### 5. Singleton Pattern

**Database Connection:**

```typescript
class Database {
  private static instance: Pool;

  static getInstance(): Pool {
    if (!this.instance) {
      this.instance = new Pool(config);
    }
    return this.instance;
  }
}
```

## Seguridad

### 1. Autenticación y Autorización

- **JWT Tokens:** Access (7 días) y Refresh tokens
- **Bcrypt:** Hash de contraseñas con 10 salt rounds
- **RBAC:** Roles y permisos granulares
- **Session Management:** Redis para refresh tokens

### 2. Protección de API

- **Rate Limiting:** 100 requests/minuto por IP
- **CORS:** Whitelist de dominios permitidos
- **Helmet.js:** Headers de seguridad HTTP
- **Input Validation:** Joi/Zod para validación de schemas
- **SQL Injection Prevention:** Consultas parametrizadas

### 3. Comunicación

- **HTTPS:** Obligatorio en producción
- **WSS:** WebSockets sobre TLS
- **MQTT TLS:** Para dispositivos en producción

## Escalabilidad

### 1. Horizontal Scaling

**Backend:**
- Stateless: Sin sesiones en memoria
- Load Balancer: Railway/Nginx
- Sticky Sessions: Para WebSockets

**Frontend:**
- CDN de Vercel: Edge caching global
- Static Assets: Versionados y cacheados

### 2. Database Scaling

**Read Replicas:**
```
Master (Write) ─┬─ Replica 1 (Read)
                └─ Replica 2 (Read)
```

**Table Partitioning:**
- Telemetry por mes
- Índices en campos frecuentes

### 3. Caching Strategy

**Levels:**
1. **Browser Cache:** Assets estáticos (1 año)
2. **CDN Cache:** HTML/JS/CSS (Vercel)
3. **Redis Cache:** Datos dinámicos (30s-5min)
4. **React Query Cache:** Client-side (5min)

## Monitoreo y Observabilidad

### 1. Logs

**Winston Logger:**
```typescript
logger.info('Command executed', {
  deviceId,
  commandType,
  userId,
  timestamp
});
```

**Levels:** error, warn, info, debug

### 2. Health Checks

```http
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2025-10-23T01:00:00.000Z",
  "uptime": 86400,
  "database": "connected",
  "redis": "connected"
}
```

### 3. Métricas

**Railway Dashboard:**
- CPU usage
- Memory usage
- Request latency
- Error rate

**Vercel Analytics:**
- Page views
- Bounce rate
- Core Web Vitals

## Performance

### 1. Backend Optimizations

- **Connection Pooling:** PostgreSQL (max 20 connections)
- **Query Optimization:** Índices en columnas frecuentes
- **Compression:** gzip para responses
- **Pagination:** Limit de 50 items por página

### 2. Frontend Optimizations

- **Code Splitting:** React.lazy() para rutas
- **Lazy Loading:** Imágenes y componentes pesados
- **Memoization:** useMemo, useCallback
- **Bundle Size:** Tree shaking con Vite

### 3. Database Optimizations

**Índices:**
```sql
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_telemetry_device_time ON telemetry(device_id, timestamp DESC);
CREATE INDEX idx_commands_device_status ON device_commands(device_id, status);
```

**Partitioning:**
```sql
-- Telemetry particionada por mes
CREATE TABLE telemetry_2025_10 PARTITION OF telemetry
FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
```

## Deployment Architecture

### Producción

```
GitHub Repository
      │
      ├─ Push to main
      │
      ├─────────────────┬──────────────────┐
      │                 │                  │
      ↓                 ↓                  ↓
  Vercel Deploy    Railway Deploy    Railway Deploy
  (Frontend)       (Backend)         (DB/Redis)
      │                 │                  │
      └────── HTTPS ────┴──── Private ────┘
                                Network
```

### Desarrollo Local

```
Docker Compose
      │
      ├─ PostgreSQL (5432)
      ├─ Redis (6379)
      ├─ MQTT Broker (1883)
      ├─ Backend (3000)
      └─ Frontend (5173)
```

## Conclusión

Esta arquitectura proporciona:

- **Modularidad:** Componentes independientes y reutilizables
- **Escalabilidad:** Preparada para crecimiento horizontal
- **Mantenibilidad:** Código organizado y bien documentado
- **Seguridad:** Múltiples capas de protección
- **Performance:** Optimizada para respuestas rápidas
- **Observabilidad:** Logs y métricas completas

La separación de responsabilidades y el uso de patrones establecidos facilita la evolución y el mantenimiento del sistema a largo plazo.
