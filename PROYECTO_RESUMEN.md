# Proyecto: Plataforma de Gestión de Aires Acondicionados

## Estado Actual del Desarrollo

### ✅ Completado

#### 1. Estructura del Proyecto
- Carpetas backend y frontend creadas
- Estructura de subcarpetas organizadas
- Archivos de configuración base

#### 2. Infraestructura (Docker)
- **docker-compose.yml** configurado con:
  - PostgreSQL 15
  - Redis 7
  - MQTT Broker (Mosquitto)
  - Backend (Node.js)
  - Frontend (React)
- Configuración de redes y volúmenes
- Scripts de inicialización de base de datos

#### 3. Base de Datos (PostgreSQL)
- **Schema completo** en `docker/postgres/init.sql`:
  - Tabla `brands` (marcas de AC)
  - Tabla `models` (modelos con configuración genérica)
  - Tabla `devices` (dispositivos físicos)
  - Tabla `device_status` (estado en tiempo real)
  - Tabla `device_telemetry` (histórico particionado)
  - Tabla `device_commands` (comandos enviados)
  - Tabla `alerts` (sistema de alertas)
  - Tabla `schedules` (horarios automatizados)
  - Tabla `locations` (ubicaciones jerárquicas)
  - Tabla `users` (usuarios y permisos)
  - Tabla `refresh_tokens` (tokens JWT)
  - Tabla `audit_logs` (auditoría)
- Particionamiento de telemetría por mes
- Índices optimizados
- Triggers para updated_at
- Usuario admin por defecto
- 10 marcas genéricas precargadas

#### 4. Backend (Node.js + Express + TypeScript)
**Configuración:**
- package.json con todas las dependencias
- tsconfig.json configurado
- Dockerfile para desarrollo

**Estructura creada:**
- `src/config/` - Configuración general, database, redis
- `src/types/` - TypeScript interfaces completas
- `src/middleware/` - Auth, errorHandler, validation, rateLimit
- `src/utils/` - Logger (Winston), password (bcrypt), JWT

**Archivos principales:**
- `src/index.ts` - Servidor Express con Socket.io
- `src/config/database.ts` - Pool de PostgreSQL con transacciones
- `src/config/redis.ts` - Cliente Redis singleton
- `src/utils/logger.ts` - Sistema de logs con Winston

**Middlewares implementados:**
- Autenticación JWT
- Autorización por roles
- Validación con Zod
- Rate limiting (API, Auth, Commands)
- Error handling global
- CORS y Helmet

#### 5. Frontend (React + Vite + TypeScript + TailwindCSS)
**Configuración:**
- package.json con dependencias
- vite.config.ts con proxy configurado
- tsconfig.json
- TailwindCSS configurado
- Dockerfile

**Estructura creada:**
- `src/main.tsx` - Entry point
- `src/App.tsx` - Router y layout principal
- `src/types/` - TypeScript interfaces
- `src/store/` - Zustand store (auth)
- `src/services/` - API client con axios
- Carpetas para components, pages, hooks, utils

**Dependencias principales:**
- React 18
- React Router DOM v6
- TanStack Query (React Query)
- Zustand (state management)
- Socket.io Client
- Recharts (gráficos)
- Lucide React (iconos)
- React Hot Toast (notificaciones)
- Axios

#### 6. Archivos de Configuración
- `.env.example` - Variables de entorno documentadas
- `.env` - Variables locales (backend y frontend)
- `.gitignore` - Archivos a ignorar
- `README.md` - Documentación completa del proyecto

---

## 🔨 Pendiente de Implementar

### Backend

#### 1. Servicios y Controladores
Necesitas crear los archivos en `backend/src/`:

**Routes:**
- `routes/auth.routes.ts`
- `routes/brand.routes.ts`
- `routes/model.routes.ts`
- `routes/device.routes.ts`
- `routes/location.routes.ts`
- `routes/command.routes.ts`
- `routes/alert.routes.ts`
- `routes/schedule.routes.ts`
- `routes/user.routes.ts`
- `routes/telemetry.routes.ts`

**Controllers:**
- `controllers/auth.controller.ts`
- `controllers/brand.controller.ts`
- `controllers/model.controller.ts`
- `controllers/device.controller.ts`
- `controllers/command.controller.ts`
- etc.

**Services:**
- `services/auth.service.ts`
- `services/device.service.ts`
- `services/mqtt.service.ts`
- `services/telemetry.service.ts`
- `services/alert.service.ts`
- `services/schedule.service.ts`
- etc.

#### 2. Device Abstraction Layer
Archivos a crear en `backend/src/adapters/`:

```
adapters/
├── base/
│   └── ACAdapter.ts          # Interfaz base
├── mqtt/
│   └── GenericMQTTAdapter.ts # Adaptador MQTT genérico
├── http/
│   └── GenericHTTPAdapter.ts # Adaptador HTTP genérico
├── modbus/
│   └── ModbusAdapter.ts      # Adaptador Modbus
└── index.ts                  # Factory de adaptadores
```

#### 3. Sistema MQTT
- `services/mqtt.service.ts` - Cliente MQTT
- Subscripción a topics de dispositivos
- Publicación de comandos
- Manejo de mensajes entrantes

#### 4. Sistema de Telemetría
- Worker/Scheduler para almacenar datos cada X segundos
- Agregación de datos históricos
- Limpieza de datos antiguos

#### 5. Sistema de Alertas
- Evaluación de condiciones
- Generación automática de alertas
- Notificaciones (email opcional)

#### 6. Sistema de Horarios (Cron)
- Ejecución de schedules con node-cron
- Bull queues para tareas asíncronas

### Frontend

#### 1. Componentes Básicos
Crear en `frontend/src/components/`:

```
components/
├── Layout.tsx              # Layout principal con sidebar
├── PrivateRoute.tsx        # HOC para rutas protegidas
├── Navbar.tsx             # Barra de navegación
├── Sidebar.tsx            # Menú lateral
├── DeviceCard.tsx         # Tarjeta de dispositivo
├── DeviceStatusBadge.tsx  # Badge de estado
├── AlertBadge.tsx         # Badge de alerta
├── TemperatureControl.tsx # Control de temperatura
├── ModeSelector.tsx       # Selector de modo
├── FanSpeedSelector.tsx   # Selector de velocidad
├── Chart.tsx              # Gráfico de telemetría
└── ... (más componentes)
```

#### 2. Páginas
Crear en `frontend/src/pages/`:

```
pages/
├── Login.tsx              # Login page
├── Dashboard.tsx          # Dashboard principal
├── Devices.tsx            # Lista de dispositivos
├── DeviceDetail.tsx       # Detalle y control de dispositivo
├── Brands.tsx             # Gestión de marcas
├── Models.tsx             # Gestión de modelos
├── Locations.tsx          # Gestión de ubicaciones
├── Alerts.tsx             # Lista de alertas
├── Schedules.tsx          # Gestión de horarios
├── Users.tsx              # Gestión de usuarios
├── Reports.tsx            # Reportes
└── Settings.tsx           # Configuración
```

#### 3. Servicios API
Crear en `frontend/src/services/`:

```
services/
├── api.ts                 # ✅ Cliente axios base
├── auth.service.ts        # ✅ Servicio de autenticación
├── device.service.ts      # Servicio de dispositivos
├── brand.service.ts       # Servicio de marcas
├── model.service.ts       # Servicio de modelos
├── command.service.ts     # Servicio de comandos
├── alert.service.ts       # Servicio de alertas
├── schedule.service.ts    # Servicio de horarios
├── telemetry.service.ts   # Servicio de telemetría
├── socket.service.ts      # Cliente Socket.io
└── user.service.ts        # Servicio de usuarios
```

#### 4. Hooks Personalizados
Crear en `frontend/src/hooks/`:

```
hooks/
├── useDevices.ts          # Query de dispositivos
├── useDeviceStatus.ts     # Query de estado de dispositivo
├── useDeviceControl.ts    # Mutation para enviar comandos
├── useAlerts.ts           # Query de alertas
├── useTelemetry.ts        # Query de telemetría
├── useSocket.ts           # Hook para Socket.io
└── ... (más hooks)
```

#### 5. Socket.io Integration
- Conexión WebSocket al backend
- Suscripción a eventos de dispositivos
- Actualización en tiempo real del UI

---

## 🚀 Instrucciones para Iniciar el Desarrollo

### 1. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Iniciar Servicios con Docker

```bash
# Desde la raíz del proyecto
docker-compose up -d postgres redis mosquitto
```

O para iniciar todo incluyendo backend y frontend:
```bash
docker-compose up -d
```

### 3. Desarrollo Local (sin Docker para backend/frontend)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Servidor en http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Aplicación en http://localhost:5173
```

### 4. Verificar Conexiones

- **API Health Check:** http://localhost:3000/health
- **Frontend:** http://localhost:5173
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379
- **MQTT:** localhost:1883

---

## 📋 Próximos Pasos Sugeridos

1. **Implementar Autenticación Completa (Backend + Frontend)**
   - Controllers y routes de auth
   - Página de login funcional
   - Guard de rutas privadas

2. **CRUD de Dispositivos**
   - Backend: services, controllers, routes
   - Frontend: páginas de lista y detalle

3. **Sistema de Adaptadores Genéricos**
   - Adaptador MQTT configurable
   - Factory de adaptadores por protocolo
   - Registro dinámico de marcas/modelos

4. **Panel de Control en Tiempo Real**
   - Componentes de control de AC
   - Socket.io para actualizaciones
   - Comandos (temperatura, modo, fan, power)

5. **Sistema de Telemetría**
   - Almacenamiento de datos históricos
   - Gráficos con Recharts
   - Visualización de consumo

6. **Sistema de Alertas**
   - Generación automática
   - Dashboard de alertas
   - Notificaciones en tiempo real

7. **Automatización con Horarios**
   - CRUD de schedules
   - Ejecución automática con cron
   - UI de calendario/horarios

8. **Reportes**
   - Generación de reportes
   - Exportación a PDF/Excel
   - Gráficos de analytics

---

## 📁 Estructura Completa del Proyecto

```
Aire_Acondicionado/
├── docker-compose.yml           ✅
├── package.json                 ✅
├── .env.example                 ✅
├── .gitignore                   ✅
├── README.md                    ✅
│
├── docker/                      ✅
│   ├── postgres/
│   │   └── init.sql            ✅
│   └── mosquitto/
│       └── mosquitto.conf      ✅
│
├── backend/                     ✅
│   ├── package.json            ✅
│   ├── tsconfig.json           ✅
│   ├── Dockerfile              ✅
│   ├── .env                    ✅
│   ├── logs/                   ✅
│   └── src/
│       ├── index.ts            ✅
│       ├── types/
│       │   └── index.ts        ✅
│       ├── config/
│       │   ├── index.ts        ✅
│       │   ├── database.ts     ✅
│       │   └── redis.ts        ✅
│       ├── middleware/
│       │   ├── auth.ts         ✅
│       │   ├── errorHandler.ts ✅
│       │   ├── notFoundHandler.ts ✅
│       │   ├── validation.ts   ✅
│       │   └── rateLimit.ts    ✅
│       ├── utils/
│       │   ├── logger.ts       ✅
│       │   ├── password.ts     ✅
│       │   └── jwt.ts          ✅
│       ├── models/             ⏳ (pendiente)
│       ├── services/           ⏳ (pendiente)
│       ├── controllers/        ⏳ (pendiente)
│       ├── routes/             ⏳ (pendiente)
│       └── adapters/           ⏳ (pendiente)
│
└── frontend/                   ✅
    ├── package.json            ✅
    ├── tsconfig.json           ✅
    ├── vite.config.ts          ✅
    ├── tailwind.config.js      ✅
    ├── postcss.config.js       ✅
    ├── Dockerfile              ✅
    ├── .env                    ✅
    ├── index.html              ✅
    └── src/
        ├── main.tsx            ✅
        ├── App.tsx             ✅
        ├── index.css           ✅
        ├── types/
        │   └── index.ts        ✅
        ├── store/
        │   └── authStore.ts    ✅
        ├── services/
        │   ├── api.ts          ✅
        │   └── auth.service.ts ✅
        ├── components/         ⏳ (pendiente)
        ├── pages/              ⏳ (pendiente)
        ├── hooks/              ⏳ (pendiente)
        └── utils/              ⏳ (pendiente)
```

---

## 🎯 Funcionalidades Clave del Sistema

### Soporte Multi-Marca (Genérico)
El sistema está diseñado para soportar **cualquier marca** mediante:

1. **Configuración Dinámica en la BD**
   - Tabla `models` con campo `connection_config` (JSONB)
   - Mapping configurable de campos
   - Topics MQTT personalizables por modelo

2. **Adaptadores por Protocolo**
   - Adaptador genérico MQTT
   - Adaptador genérico HTTP/REST
   - Adaptador Modbus
   - Adaptador BACnet (futuro)

3. **Ejemplo de Configuración Genérica:**
```json
{
  "protocol": "mqtt",
  "broker": "mqtt://localhost:1883",
  "topicPrefix": "ac/{deviceId}",
  "topics": {
    "status": "ac/{deviceId}/status",
    "command": "ac/{deviceId}/command"
  },
  "mappings": {
    "temperature": "payload.temp",
    "humidity": "payload.hum",
    "mode": "payload.mode"
  },
  "commands": {
    "setPower": {
      "topic": "ac/{deviceId}/command",
      "payload": {"action": "power", "value": "{value}"}
    }
  }
}
```

### Marcas Pre-configuradas
En `init.sql` se incluyen 10 marcas:
1. Generic MQTT
2. Generic HTTP
3. Daikin
4. LG
5. Carrier
6. Mitsubishi Electric
7. Trane
8. York
9. Fujitsu
10. Panasonic

Los modelos se pueden agregar desde la interfaz o mediante SQL.

---

## ⚙️ Tecnologías y Bibliotecas

### Backend
- **Node.js 18+**
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos principal
- **Redis** - Caché y sesiones
- **MQTT (Mosquitto)** - Comunicación IoT
- **Socket.io** - WebSockets
- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **Zod** - Validación de esquemas
- **Winston** - Logging
- **Bull** - Colas de trabajos
- **node-cron** - Tareas programadas

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos
- **React Router v6** - Enrutamiento
- **TanStack Query** - Gestión de datos del servidor
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **Socket.io Client** - WebSockets
- **Recharts** - Gráficos
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones
- **date-fns** - Manejo de fechas

---

## 🔐 Seguridad Implementada

- JWT con refresh tokens
- Bcrypt para passwords
- Rate limiting (API, Auth, Commands)
- CORS configurado
- Helmet para headers de seguridad
- Validación de inputs con Zod
- Roles y permisos de usuarios
- Audit logs

---

## 🗄️ Base de Datos

### Características
- **Particionamiento** de telemetría por mes
- **Índices optimizados** en consultas frecuentes
- **Triggers** para updated_at automático
- **Foreign Keys** con cascadas apropiadas
- **UUID** para IDs
- **JSONB** para configuración flexible
- **Audit logs** para trazabilidad

### Usuario Admin por Defecto
- Email: `admin@acplatform.com`
- Password: `admin123`
- Rol: `super_admin`

*⚠️ IMPORTANTE: Cambiar en producción*

---

## 📝 Notas Importantes

1. **Passwords en init.sql:** El hash del password "admin123" está hardcodeado. En producción, crear el admin de manera segura.

2. **JWT Secret:** Cambiar `JWT_SECRET` en `.env` antes de desplegar.

3. **MQTT sin autenticación:** Mosquitto está configurado con `allow_anonymous true` para desarrollo. Configurar auth en producción.

4. **Particiones de telemetría:** Las particiones están creadas para 2025. Crear un script para agregar particiones automáticamente cada mes.

5. **Migración de datos:** No hay sistema de migraciones todavía. El schema se carga con `init.sql` en el primer inicio de PostgreSQL.

---

## 🤝 Contribuir al Desarrollo

El proyecto está listo para que continues implementando:

1. Los **services y controllers** del backend
2. Los **adaptadores de dispositivos**
3. Las **páginas y componentes** del frontend
4. La **integración Socket.io** completa
5. El **sistema de reportes**

La arquitectura base está sólida y escalable. Puedes empezar por cualquier módulo según la prioridad de tu cliente.

---

## 📞 Soporte

Para dudas o problemas, revisar:
- README.md principal
- Documentación inline en el código
- Comentarios en archivos de configuración
