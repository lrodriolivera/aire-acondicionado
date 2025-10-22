# Plataforma de Gestión Centralizada de Aires Acondicionados

Sistema web para monitoreo y control de múltiples unidades de aire acondicionado de diferentes marcas y modelos.

## Características

- Dashboard centralizado con monitoreo en tiempo real
- Control remoto de dispositivos (temperatura, modo, encendido/apagado)
- Sistema de alertas inteligentes
- Reportes y analítica de consumo energético
- Automatización con horarios programables
- Soporte multi-marca mediante adaptadores configurables

## Stack Tecnológico

### Backend
- Node.js + Express + TypeScript
- PostgreSQL (base de datos)
- Redis (caché y sesiones)
- MQTT (comunicación IoT)
- Socket.io (tiempo real)

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (estado global)
- React Query (gestión de datos)

### Infraestructura
- Docker + Docker Compose
- MQTT Broker (Eclipse Mosquitto)

## Instalación y Configuración

### Prerequisitos

- Node.js 18+
- Docker y Docker Compose
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Aire_Acondicionado
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Instalar dependencias del Backend**
```bash
cd backend
npm install
```

4. **Instalar dependencias del Frontend**
```bash
cd frontend
npm install
```

5. **Iniciar servicios con Docker**
```bash
# Desde la raíz del proyecto
docker-compose up -d
```

6. **Inicializar la base de datos**
```bash
cd backend
npm run migrate
npm run seed
```

## Desarrollo Local

### Sin Docker

**Backend:**
```bash
cd backend
npm run dev
# Servidor en http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Aplicación en http://localhost:5173
```

### Con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## Estructura del Proyecto

```
Aire_Acondicionado/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── adapters/       # Adaptadores de dispositivos
│   │   ├── config/         # Configuraciones
│   │   ├── controllers/    # Controladores de rutas
│   │   ├── middleware/     # Middlewares
│   │   ├── models/         # Modelos de base de datos
│   │   ├── routes/         # Rutas de la API
│   │   ├── services/       # Lógica de negocio
│   │   ├── types/          # Tipos de TypeScript
│   │   └── utils/          # Utilidades
│   └── package.json
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Servicios API
│   │   ├── store/          # Estado global
│   │   ├── types/          # Tipos de TypeScript
│   │   └── utils/          # Utilidades
│   └── package.json
├── docker/                  # Configuraciones Docker
│   ├── postgres/
│   └── mosquitto/
└── docker-compose.yml
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/refresh` - Renovar token

### Dispositivos
- `GET /api/devices` - Listar dispositivos
- `POST /api/devices` - Crear dispositivo
- `GET /api/devices/:id` - Obtener dispositivo
- `PUT /api/devices/:id` - Actualizar dispositivo
- `DELETE /api/devices/:id` - Eliminar dispositivo

### Control
- `POST /api/devices/:id/command` - Enviar comando
- `GET /api/devices/:id/status` - Obtener estado
- `GET /api/devices/:id/telemetry` - Obtener telemetría

### Marcas y Modelos
- `GET /api/brands` - Listar marcas
- `POST /api/brands` - Crear marca
- `GET /api/models` - Listar modelos
- `POST /api/models` - Crear modelo

## Integración de Dispositivos

La plataforma soporta múltiples protocolos:

1. **MQTT** (recomendado para IoT)
2. **HTTP/REST API**
3. **Modbus TCP**
4. **BACnet**

Ver la [Guía de Integración](docs/integration.md) para más detalles.

## Seguridad

- Autenticación JWT con refresh tokens
- Encriptación de contraseñas con bcrypt
- Rate limiting en API
- Validación de inputs
- CORS configurado
- Comunicación MQTT con TLS (producción)

## Testing

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## Producción

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## Licencia

MIT

## Soporte

Para reportar problemas o sugerencias, crear un issue en el repositorio.
