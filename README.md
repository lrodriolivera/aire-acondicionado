# Plataforma de Gestión Centralizada de Aires Acondicionados

Sistema web profesional para monitoreo y control centralizado de múltiples unidades de aire acondicionado de diferentes marcas y modelos.

## Acceso a la Plataforma

### Producción
- **Frontend:** https://aire-acondicionado-frontend.vercel.app
- **Backend API:** https://aire-acondicionado-production.up.railway.app
- **API Health:** https://aire-acondicionado-production.up.railway.app/health

### Credenciales de Prueba
- **Email:** admin@acplatform.com
- **Contraseña:** admin123

## Características Principales

### Monitoreo en Tiempo Real
- Dashboard centralizado con métricas en tiempo real
- Visualización de temperatura, humedad y estado de dispositivos
- Alertas automáticas por anomalías o fallas
- Histórico de telemetría y consumo energético

### Control Remoto
- Encendido/apagado de dispositivos
- Ajuste de temperatura objetivo
- Cambio de modo de operación (cool, heat, fan, auto)
- Control de velocidad del ventilador
- Respuesta inmediata con actualización visual

### Gestión Avanzada
- Programación de horarios automáticos
- Gestión de ubicaciones y zonas
- Administración de usuarios y permisos
- Catálogo de marcas y modelos
- Sistema de alertas configurable

### Reportes y Analítica
- Gráficos de consumo energético
- Análisis de eficiencia por dispositivo
- Reportes de uso y tendencias
- Exportación de datos

## Stack Tecnológico

### Backend
- **Runtime:** Node.js 18+ con TypeScript
- **Framework:** Express.js
- **Base de Datos:** PostgreSQL 14
- **Caché:** Redis
- **ORM:** Consultas SQL nativas con pg
- **Autenticación:** JWT con refresh tokens
- **WebSockets:** Socket.io para tiempo real
- **Comunicación IoT:** MQTT (Mosquitto)

### Frontend
- **Framework:** React 18 con TypeScript
- **Build Tool:** Vite
- **Estilos:** TailwindCSS
- **Estado:** React Query (TanStack Query)
- **Enrutamiento:** React Router v6
- **Notificaciones:** React Hot Toast
- **Íconos:** Lucide React

### Infraestructura
- **Backend Hosting:** Railway (PostgreSQL + Redis + API)
- **Frontend Hosting:** Vercel
- **CI/CD:** Despliegue automático desde GitHub
- **Containerización:** Docker (desarrollo local)

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                     │
│                  React + TypeScript                      │
│                    TailwindCSS                           │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/WSS
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Backend API (Railway)                       │
│           Express + TypeScript + Socket.io               │
├──────────────────┬──────────────────┬───────────────────┤
│   PostgreSQL     │      Redis       │   MQTT Broker     │
│   (Relacional)   │     (Cache)      │  (IoT Devices)    │
└──────────────────┴──────────────────┴───────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│            Adaptadores de Dispositivos                   │
│        (MQTT, HTTP, Modbus, BACnet)                      │
└─────────────────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│          Dispositivos AC Físicos                         │
│    (Daikin, Mitsubishi, Carrier, LG, etc.)              │
└─────────────────────────────────────────────────────────┘
```

## Instalación y Configuración

### Prerequisitos

- Node.js 18 o superior
- PostgreSQL 14+
- Redis 6+
- Docker y Docker Compose (opcional, para desarrollo local)
- Git

### Instalación Local

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/lrodriolivera/aire-acondicionado.git
cd aire-acondicionado
```

#### 2. Configurar Backend

```bash
cd backend
npm install

# Copiar archivo de configuración
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ac_platform

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=tu_secreto_muy_seguro_aqui
JWT_REFRESH_SECRET=tu_refresh_secret_aqui

# MQTT
MQTT_BROKER_URL=mqtt://localhost:1883
```

#### 3. Inicializar Base de Datos

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE ac_platform;"

# Ejecutar migraciones
psql -U postgres -d ac_platform -f init.sql

# Cargar datos de prueba (opcional)
psql -U postgres -d ac_platform -f seed-data.sql
```

#### 4. Configurar Frontend

```bash
cd ../frontend
npm install

# Copiar archivo de configuración
cp .env.example .env.local
```

Editar `.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

#### 5. Iniciar Servicios

**Opción A: Sin Docker**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Opción B: Con Docker**

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

#### 6. Acceder a la Aplicación

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/health

## Uso de la Plataforma

### Primer Inicio de Sesión

1. Acceder a la URL del frontend
2. Iniciar sesión con las credenciales de administrador:
   - Email: admin@acplatform.com
   - Contraseña: admin123
3. **Importante:** Cambiar la contraseña del administrador en Configuración

### Dashboard

El dashboard muestra:
- Resumen de dispositivos activos
- Alertas pendientes
- Gráficos de consumo energético
- Estado general del sistema

### Gestión de Dispositivos

#### Agregar un Dispositivo

1. Ir a **Dispositivos** → **+ Agregar Dispositivo**
2. Completar el formulario:
   - Nombre del dispositivo
   - Modelo (debe existir previamente)
   - Ubicación
   - Número de serie
   - Dirección IP o MQTT Topic
3. Guardar

#### Controlar un Dispositivo

1. Click en un dispositivo desde la lista
2. Usar los controles:
   - **Power:** Encender/Apagar
   - **Temperatura:** Ajustar con el slider
   - **Modo:** cool, heat, fan, auto
   - **Ventilador:** low, medium, high, auto

### Gestión de Ubicaciones

1. Ir a **Ubicaciones**
2. Crear jerarquía de ubicaciones (edificio → piso → sala)
3. Asignar dispositivos a ubicaciones

### Programación de Horarios

1. Ir a **Horarios**
2. Crear nuevo horario
3. Configurar:
   - Dispositivo o grupo
   - Días de la semana
   - Hora de inicio/fin
   - Acciones a ejecutar

### Alertas

Las alertas se generan automáticamente por:
- Dispositivos offline
- Temperatura fuera de rango
- Consumo anómalo
- Errores de comunicación

## API Documentation

### Autenticación

Todos los endpoints (excepto login/register) requieren token JWT en el header:

```
Authorization: Bearer <token>
```

### Endpoints Principales

#### Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@acplatform.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

#### Dispositivos

```http
GET /api/devices
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "AC Cafetería",
      "temperature": 24,
      "target_temperature": 22,
      "mode": "cool",
      "power_state": true,
      "is_online": true,
      ...
    }
  ]
}
```

#### Enviar Comando

```http
POST /api/control/command
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "uuid",
  "commandType": "setTemperature",
  "parameters": {
    "temperature": 22
  }
}

Response:
{
  "success": true,
  "message": "Comando enviado"
}
```

Ver documentación completa de API en [`docs/API.md`](docs/API.md)

## Modo Demo

El sistema incluye un **modo demo** para pruebas sin hardware real:

- Dispositivos con serial que contiene "2024" o IP que inicia con "192.168"
- Simula ejecución de comandos con delay de 500ms
- Actualiza estado inmediatamente en la base de datos
- Útil para demostraciones y desarrollo

## Despliegue en Producción

### Railway (Backend)

1. Crear cuenta en Railway.app
2. Crear nuevo proyecto
3. Agregar servicios:
   - PostgreSQL
   - Redis
   - Web Service (Node.js)
4. Configurar variables de entorno
5. Conectar con GitHub para CI/CD automático

Ver guía completa en [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

### Vercel (Frontend)

1. Crear cuenta en Vercel.com
2. Importar proyecto desde GitHub
3. Configurar variables de entorno:
   - `VITE_API_URL`
   - `VITE_WS_URL`
4. Deploy automático en cada push a main

## Estructura del Proyecto

```
aire-acondicionado/
├── backend/
│   ├── src/
│   │   ├── adapters/          # Adaptadores de protocolos IoT
│   │   │   ├── AdapterFactory.ts
│   │   │   ├── BaseAdapter.ts
│   │   │   ├── MQTTAdapter.ts
│   │   │   └── HTTPAdapter.ts
│   │   ├── config/            # Configuraciones
│   │   │   ├── index.ts
│   │   │   ├── database.ts
│   │   │   └── redis.ts
│   │   ├── controllers/       # Controladores HTTP
│   │   ├── middleware/        # Middlewares Express
│   │   ├── routes/            # Definición de rutas
│   │   ├── services/          # Lógica de negocio
│   │   │   ├── auth.service.ts
│   │   │   ├── device.service.ts
│   │   │   ├── device-control.service.ts
│   │   │   ├── telemetry.service.ts
│   │   │   ├── alert.service.ts
│   │   │   └── ...
│   │   ├── types/             # Tipos TypeScript
│   │   ├── utils/             # Utilidades
│   │   └── index.ts           # Punto de entrada
│   ├── init.sql               # Script de inicialización DB
│   ├── seed-data.sql          # Datos de prueba
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas de la aplicación
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Devices.tsx
│   │   │   ├── DeviceDetail.tsx
│   │   │   ├── Locations.tsx
│   │   │   ├── Schedules.tsx
│   │   │   ├── Alerts.tsx
│   │   │   ├── Users.tsx
│   │   │   └── Login.tsx
│   │   ├── services/          # Servicios de API
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   └── device.service.ts
│   │   ├── types/             # Tipos TypeScript
│   │   ├── App.tsx            # Componente principal
│   │   └── main.tsx           # Punto de entrada
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docs/                      # Documentación
│   ├── API.md
│   ├── ARQUITECTURA.md
│   ├── DEPLOYMENT.md
│   ├── DESARROLLO.md
│   └── USUARIO.md
│
├── docker/                    # Configuraciones Docker
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Seguridad

### Autenticación y Autorización
- JWT con access y refresh tokens
- Tokens de corta duración (7 días)
- Refresh tokens para renovación segura
- Roles y permisos (super_admin, admin, operator, viewer)

### Protección de Datos
- Contraseñas hasheadas con bcrypt (10 rounds)
- Variables sensibles en variables de entorno
- Validación de inputs con middleware
- Sanitización de datos

### Comunicación
- HTTPS en producción (Vercel/Railway)
- CORS configurado correctamente
- Rate limiting en endpoints críticos
- Headers de seguridad (helmet.js)

### Base de Datos
- Consultas parametrizadas (prevención SQL injection)
- Conexiones encriptadas
- Backups automáticos (Railway)
- Índices para optimización

## Testing

```bash
# Backend - Unit tests
cd backend
npm run test

# Backend - Integration tests
npm run test:integration

# Frontend - Component tests
cd frontend
npm run test

# E2E tests
npm run test:e2e
```

## Troubleshooting

### El frontend no se conecta al backend

1. Verificar que las variables de entorno estén correctas
2. Comprobar CORS en el backend
3. Revisar que el backend esté ejecutándose
4. Verificar la URL de API en el navegador (Network tab)

### Comandos no actualizan la interfaz

1. Hacer hard refresh del navegador (Ctrl+Shift+R)
2. Limpiar caché del navegador
3. Verificar que React Query esté usando `refetchQueries`

### Dispositivos aparecen offline

1. Verificar conexión MQTT
2. Revisar configuración de protocolo en el modelo
3. Comprobar IP/topic del dispositivo
4. Ver logs del backend

### Errores de base de datos

1. Verificar que PostgreSQL esté ejecutándose
2. Comprobar credenciales en DATABASE_URL
3. Ejecutar migraciones: `psql < init.sql`
4. Revisar logs de Railway/servidor

## Performance

### Optimizaciones Implementadas
- Caché de Redis para datos frecuentes
- React Query con staleTime optimizado
- Lazy loading de componentes
- Compresión gzip en producción
- CDN de Vercel para assets estáticos
- Índices de base de datos en campos críticos
- Paginación en listados grandes

### Monitoreo
- Health check endpoint: `/health`
- Logs estructurados con Winston
- Métricas de Railway Dashboard
- Vercel Analytics

## Roadmap

### Versión 1.1 (Próximo)
- [ ] Aplicación móvil (React Native)
- [ ] Soporte para más protocolos (KNX, Z-Wave)
- [ ] Dashboard personalizable
- [ ] Exportación de reportes PDF/Excel
- [ ] API pública con documentación Swagger

### Versión 2.0 (Futuro)
- [ ] Machine Learning para optimización energética
- [ ] Integración con sistemas de edificios inteligentes
- [ ] Multi-tenancy para múltiples organizaciones
- [ ] Aplicación de escritorio (Electron)
- [ ] Soporte offline con sincronización

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crear una rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles

## Soporte

- **Email:** soporte@acplatform.com
- **Issues:** https://github.com/lrodriolivera/aire-acondicionado/issues
- **Documentación:** https://docs.acplatform.com

## Agradecimientos

- Equipo de desarrollo
- Comunidad open source
- Railway y Vercel por la infraestructura
- Todas las librerías y frameworks utilizados

---

**Desarrollado con ❤️ para la gestión eficiente de aires acondicionados**
