# Documentación de API

## URL Base

- **Producción:** `https://aire-acondicionado-production.up.railway.app`
- **Desarrollo:** `http://localhost:3000`

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Todos los endpoints (excepto `/api/auth/login` y `/api/auth/register`) requieren un token válido.

### Header de Autenticación

```
Authorization: Bearer <access_token>
```

### Tokens

- **Access Token:** Válido por 7 días
- **Refresh Token:** Válido por 30 días (usado para renovar access token)

## Formato de Respuesta

Todas las respuestas siguen este formato estándar:

### Respuesta Exitosa

```json
{
  "success": true,
  "data": { ... }
}
```

### Respuesta con Error

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error en la solicitud |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

---

## Endpoints

### Autenticación

#### POST /api/auth/register

Registrar un nuevo usuario.

**Permisos:** Público

**Request Body:**

```json
{
  "email": "usuario@example.com",
  "password": "SecurePass123!",
  "full_name": "Juan Pérez"
}
```

**Response:** 201 Created

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "full_name": "Juan Pérez",
      "role": "viewer",
      "is_active": true,
      "created_at": "2025-10-23T01:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "uuid"
    }
  }
}
```

**Errores:**

- `400` - Email ya existe
- `400` - Contraseña muy débil
- `400` - Datos inválidos

---

#### POST /api/auth/login

Iniciar sesión.

**Permisos:** Público

**Request Body:**

```json
{
  "email": "admin@acplatform.com",
  "password": "admin123"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@acplatform.com",
      "full_name": "Administrador del Sistema",
      "role": "super_admin",
      "permissions": null,
      "is_active": true,
      "last_login": "2025-10-23T01:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "uuid-refresh-token"
    }
  }
}
```

**Errores:**

- `401` - Credenciales inválidas
- `403` - Usuario inactivo
- `429` - Demasiados intentos de login

---

#### POST /api/auth/refresh

Renovar access token usando refresh token.

**Permisos:** Público

**Request Body:**

```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "data": {
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token"
  }
}
```

**Errores:**

- `401` - Refresh token inválido o expirado

---

#### POST /api/auth/logout

Cerrar sesión (invalida refresh token).

**Permisos:** Público

**Request Body:**

```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### GET /api/auth/profile

Obtener perfil del usuario autenticado.

**Permisos:** Autenticado

**Response:** 200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@example.com",
    "full_name": "Juan Pérez",
    "role": "operator",
    "permissions": ["read_devices", "control_devices"],
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-10-23T01:00:00.000Z"
  }
}
```

---

### Dispositivos

#### GET /api/devices

Listar todos los dispositivos.

**Permisos:** Autenticado

**Query Parameters:**

- `location_id` (opcional) - Filtrar por ubicación
- `status` (opcional) - Filtrar por estado: `online`, `offline`, `error`
- `model_id` (opcional) - Filtrar por modelo

**Ejemplo:**

```
GET /api/devices?status=online&location_id=uuid
```

**Response:** 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "model_id": "uuid",
      "location_id": "uuid",
      "serial_number": "FJT-2024-CF-001",
      "name": "AC Cafetería",
      "ip_address": "192.168.1.102",
      "mqtt_topic": "ac/floor1/cafeteria/unit1",
      "status": "online",
      "last_seen": "2025-10-23T01:00:00.000Z",
      "created_at": "2025-10-22T00:00:00.000Z",
      "updated_at": "2025-10-23T01:00:00.000Z",
      "model_name": "General Slim Series",
      "brand_name": "Fujitsu",
      "protocol_type": "mqtt",
      "location_name": "Cafetería",
      "temperature": 24.0,
      "target_temperature": 22.0,
      "humidity": 58.0,
      "mode": "cool",
      "fan_speed": "low",
      "power_state": true,
      "is_online": true,
      "status_timestamp": "2025-10-23T01:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/devices/:id

Obtener detalles de un dispositivo específico.

**Permisos:** Autenticado

**Response:** 200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "model_id": "uuid",
    "location_id": "uuid",
    "serial_number": "FJT-2024-CF-001",
    "name": "AC Cafetería",
    "ip_address": "192.168.1.102",
    "mqtt_topic": "ac/floor1/cafeteria/unit1",
    "status": "online",
    "last_seen": "2025-10-23T01:00:00.000Z",
    "model_name": "General Slim Series",
    "protocol_type": "mqtt",
    "connection_config": {
      "broker": "mqtt://localhost:1883",
      "clientId": "ac-device",
      "username": "",
      "password": ""
    },
    "capabilities": {
      "hasEco": true,
      "hasSwing": true,
      "hasTimer": true,
      "hasTurbo": false,
      "hasFanSpeed": true,
      "hasHumidity": false,
      "supportedModes": ["cool", "heat", "fan", "auto"],
      "supportedFanSpeeds": ["low", "medium", "high"]
    },
    "min_temperature": 18.0,
    "max_temperature": 30.0,
    "brand_name": "Fujitsu",
    "location_name": "Cafetería",
    "temperature": 24.0,
    "target_temperature": 22.0,
    "humidity": 58.0,
    "mode": "cool",
    "fan_speed": "low",
    "power_state": true,
    "is_online": true,
    "error_code": null,
    "status_timestamp": "2025-10-23T01:00:00.000Z"
  }
}
```

**Errores:**

- `404` - Dispositivo no encontrado

---

#### POST /api/devices

Crear un nuevo dispositivo.

**Permisos:** Admin o Super Admin

**Request Body:**

```json
{
  "model_id": "uuid",
  "location_id": "uuid",
  "serial_number": "DAI-2025-001",
  "name": "AC Sala de Juntas",
  "ip_address": "192.168.1.150",
  "mqtt_topic": "ac/floor2/meeting/unit1"
}
```

**Response:** 201 Created

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "model_id": "uuid",
    "location_id": "uuid",
    "serial_number": "DAI-2025-001",
    "name": "AC Sala de Juntas",
    "ip_address": "192.168.1.150",
    "mqtt_topic": "ac/floor2/meeting/unit1",
    "status": "offline",
    "created_at": "2025-10-23T01:00:00.000Z"
  }
}
```

**Errores:**

- `400` - Datos inválidos
- `400` - Número de serie ya existe
- `403` - Sin permisos

---

#### PUT /api/devices/:id

Actualizar un dispositivo.

**Permisos:** Admin, Super Admin u Operator

**Request Body:**

```json
{
  "name": "AC Sala de Juntas Principal",
  "location_id": "new-location-uuid",
  "ip_address": "192.168.1.151"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "AC Sala de Juntas Principal",
    "location_id": "new-location-uuid",
    "ip_address": "192.168.1.151",
    "updated_at": "2025-10-23T01:05:00.000Z"
  }
}
```

**Errores:**

- `404` - Dispositivo no encontrado
- `403` - Sin permisos

---

#### DELETE /api/devices/:id

Eliminar un dispositivo.

**Permisos:** Super Admin

**Response:** 200 OK

```json
{
  "success": true,
  "message": "Device deleted successfully"
}
```

**Errores:**

- `404` - Dispositivo no encontrado
- `403` - Sin permisos

---

#### GET /api/devices/stats

Obtener estadísticas de dispositivos.

**Permisos:** Autenticado

**Response:** 200 OK

```json
{
  "success": true,
  "data": {
    "total_devices": 15,
    "online_devices": 12,
    "offline_devices": 2,
    "error_devices": 1
  }
}
```

---

### Control de Dispositivos

#### POST /api/control/command

Enviar comando a un dispositivo.

**Permisos:** Operator, Admin o Super Admin

**Rate Limit:** 60 comandos por minuto

**Request Body:**

```json
{
  "deviceId": "uuid",
  "commandType": "setTemperature",
  "parameters": {
    "temperature": 22
  }
}
```

**Tipos de Comando:**

| commandType | parameters | Descripción |
|-------------|------------|-------------|
| `setPower` | `{ power: boolean }` | Encender/apagar |
| `setTemperature` | `{ temperature: number }` | Ajustar temperatura |
| `setMode` | `{ mode: "cool"\|"heat"\|"fan"\|"auto" }` | Cambiar modo |
| `setFanSpeed` | `{ fanSpeed: "low"\|"medium"\|"high"\|"auto" }` | Velocidad ventilador |

**Ejemplos de Comandos:**

Encender dispositivo:
```json
{
  "deviceId": "uuid",
  "commandType": "setPower",
  "parameters": { "power": true }
}
```

Cambiar a modo calor:
```json
{
  "deviceId": "uuid",
  "commandType": "setMode",
  "parameters": { "mode": "heat" }
}
```

Ajustar velocidad del ventilador:
```json
{
  "deviceId": "uuid",
  "commandType": "setFanSpeed",
  "parameters": { "fanSpeed": "high" }
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "message": "Comando enviado"
}
```

**Errores:**

- `400` - Parámetros inválidos
- `404` - Dispositivo no encontrado
- `429` - Rate limit excedido
- `500` - Error al ejecutar comando

---

#### POST /api/control/refresh/:deviceId

Refrescar estado de un dispositivo.

**Permisos:** Autenticado

**Response:** 200 OK

```json
{
  "success": true,
  "message": "Status refreshed successfully"
}
```

---

#### POST /api/control/refresh-all

Refrescar estado de todos los dispositivos online.

**Permisos:** Admin o Super Admin

**Response:** 200 OK

```json
{
  "success": true,
  "message": "Refreshing status for all devices"
}
```

---

### Ubicaciones

#### GET /api/locations

Listar todas las ubicaciones.

**Permisos:** Autenticado

**Response:** 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cafetería",
      "type": "room",
      "parent_id": "floor-uuid",
      "parent_name": "Piso 1",
      "device_count": 2,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/locations

Crear una nueva ubicación.

**Permisos:** Admin o Super Admin

**Request Body:**

```json
{
  "name": "Sala de Reuniones A",
  "type": "room",
  "parent_id": "floor-uuid"
}
```

**Response:** 201 Created

---

### Marcas y Modelos

#### GET /api/brands

Listar todas las marcas.

**Permisos:** Autenticado

**Response:** 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Daikin",
      "logo_url": "https://...",
      "website": "https://www.daikin.com",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/models

Listar todos los modelos.

**Permisos:** Autenticado

**Query Parameters:**

- `brand_id` (opcional) - Filtrar por marca

**Response:** 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "brand_id": "uuid",
      "brand_name": "Daikin",
      "name": "Inverter Series",
      "protocol_type": "mqtt",
      "connection_config": {
        "broker": "mqtt://localhost:1883",
        "clientId": "ac-device"
      },
      "capabilities": {
        "supportedModes": ["cool", "heat", "fan", "auto"],
        "supportedFanSpeeds": ["low", "medium", "high", "auto"]
      },
      "min_temperature": 18.0,
      "max_temperature": 30.0
    }
  ]
}
```

---

### Alertas

#### GET /api/alerts

Listar alertas.

**Permisos:** Autenticado

**Query Parameters:**

- `acknowledged` (opcional) - `true` | `false`
- `severity` (opcional) - `info` | `warning` | `critical`
- `limit` (opcional) - Número de resultados (default: 50)

**Ejemplo:**

```
GET /api/alerts?acknowledged=false&severity=critical
```

**Response:** 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "device_id": "uuid",
      "device_name": "AC Recepción",
      "alert_type": "offline",
      "severity": "critical",
      "message": "Dispositivo sin respuesta desde hace 2 horas",
      "metadata": {},
      "acknowledged": false,
      "acknowledged_by": null,
      "acknowledged_at": null,
      "resolved": false,
      "resolved_at": null,
      "created_at": "2025-10-23T01:00:00.000Z"
    }
  ]
}
```

**Tipos de Alerta:**

- `offline` - Dispositivo desconectado
- `temperature_high` - Temperatura alta
- `temperature_low` - Temperatura baja
- `consumption_anomaly` - Consumo anómalo
- `filter_maintenance` - Mantenimiento de filtro
- `error` - Error de comunicación

---

#### PUT /api/alerts/:id/acknowledge

Marcar una alerta como reconocida.

**Permisos:** Operator, Admin o Super Admin

**Response:** 200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "acknowledged": true,
    "acknowledged_by": "user-uuid",
    "acknowledged_at": "2025-10-23T01:05:00.000Z"
  }
}
```

---

### Telemetría

#### GET /api/telemetry

Obtener datos de telemetría.

**Permisos:** Autenticado

**Query Parameters:**

- `device_id` (requerido) - ID del dispositivo
- `start_date` (opcional) - Fecha inicio (ISO 8601)
- `end_date` (opcional) - Fecha fin (ISO 8601)
- `interval` (opcional) - Intervalo de agregación: `1h`, `1d`, `1w`
- `limit` (opcional) - Número de resultados (default: 100)

**Ejemplo:**

```
GET /api/telemetry?device_id=uuid&start_date=2025-10-20T00:00:00Z&end_date=2025-10-23T00:00:00Z&interval=1h
```

**Response:** 200 OK

```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-10-23T00:00:00.000Z",
      "temperature": 24.5,
      "humidity": 55.0,
      "power_consumption": 1.2,
      "mode": "cool",
      "fan_speed": "medium",
      "power_state": true
    }
  ]
}
```

---

### Horarios

#### GET /api/schedules

Listar horarios programados.

**Permisos:** Autenticado

**Response:** 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Horario Oficina",
      "device_id": "uuid",
      "location_id": null,
      "device_name": "AC Oficina Principal",
      "cron_expression": "0 8 * * 1-5",
      "action": {
        "type": "setPower",
        "parameters": { "power": true }
      },
      "is_active": true,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/schedules

Crear un nuevo horario.

**Permisos:** Admin o Super Admin

**Request Body:**

```json
{
  "name": "Apagar ACs Noche",
  "device_id": "uuid",
  "cron_expression": "0 22 * * *",
  "action": {
    "type": "setPower",
    "parameters": { "power": false }
  },
  "is_active": true
}
```

**Expresiones Cron:**

- `0 8 * * 1-5` - 8:00 AM, Lunes a Viernes
- `0 22 * * *` - 10:00 PM, todos los días
- `*/30 * * * *` - Cada 30 minutos
- `0 */4 * * *` - Cada 4 horas

**Response:** 201 Created

---

### Usuarios

#### GET /api/users

Listar usuarios.

**Permisos:** Admin o Super Admin

**Response:** 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "usuario@example.com",
      "full_name": "Juan Pérez",
      "role": "operator",
      "is_active": true,
      "last_login": "2025-10-23T00:00:00.000Z",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### PUT /api/users/:id

Actualizar usuario.

**Permisos:** Super Admin

**Request Body:**

```json
{
  "full_name": "Juan Pérez García",
  "role": "admin",
  "is_active": true
}
```

**Roles Disponibles:**

- `viewer` - Solo lectura
- `operator` - Lectura y control de dispositivos
- `admin` - Gestión completa excepto usuarios
- `super_admin` - Acceso total

**Response:** 200 OK

---

### Health Check

#### GET /health

Verificar estado del servidor.

**Permisos:** Público

**Response:** 200 OK

```json
{
  "status": "ok",
  "timestamp": "2025-10-23T01:00:00.000Z",
  "uptime": 86400,
  "database": "connected",
  "redis": "connected"
}
```

---

## WebSocket Events

La API incluye soporte de WebSocket para actualizaciones en tiempo real.

### Conectar

```javascript
const socket = io('https://aire-acondicionado-production.up.railway.app', {
  auth: {
    token: 'Bearer your-access-token'
  }
});
```

### Eventos del Servidor

#### device:updated

Emitido cuando un dispositivo cambia de estado.

```json
{
  "deviceId": "uuid",
  "status": {
    "temperature": 22.5,
    "power_state": true,
    "mode": "cool"
  }
}
```

#### alert:created

Emitido cuando se crea una nueva alerta.

```json
{
  "id": "uuid",
  "device_id": "uuid",
  "severity": "warning",
  "message": "Temperatura alta detectada"
}
```

#### command:completed

Emitido cuando un comando se completa.

```json
{
  "commandId": "uuid",
  "deviceId": "uuid",
  "status": "completed"
}
```

---

## Rate Limiting

Límites de requests por endpoint:

| Endpoint | Límite |
|----------|--------|
| `/api/auth/login` | 5 por minuto por IP |
| `/api/auth/register` | 3 por hora por IP |
| `/api/control/command` | 60 por minuto por usuario |
| Otros endpoints | 100 por minuto por usuario |

Cuando se excede el límite:

```json
{
  "success": false,
  "error": {
    "message": "Too many requests",
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 60
  }
}
```

---

## Paginación

Los endpoints que retornan listas soportan paginación:

**Query Parameters:**

- `page` - Número de página (default: 1)
- `limit` - Items por página (default: 50, max: 100)

**Ejemplo:**

```
GET /api/devices?page=2&limit=20
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Códigos de Error Personalizados

| Código | Descripción |
|--------|-------------|
| `INVALID_CREDENTIALS` | Email o contraseña incorrectos |
| `TOKEN_EXPIRED` | Token JWT expirado |
| `TOKEN_INVALID` | Token JWT inválido |
| `INSUFFICIENT_PERMISSIONS` | Sin permisos suficientes |
| `DEVICE_OFFLINE` | Dispositivo no disponible |
| `COMMAND_FAILED` | Fallo al ejecutar comando |
| `RATE_LIMIT_EXCEEDED` | Límite de requests excedido |
| `VALIDATION_ERROR` | Error de validación de datos |

---

## Postman Collection

Importar esta colección para probar la API:

```json
{
  "info": {
    "name": "AC Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://aire-acondicionado-production.up.railway.app"
    }
  ]
}
```

---

## Ejemplos de Uso

### Flujo Completo de Autenticación y Control

```bash
# 1. Login
curl -X POST https://aire-acondicionado-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acplatform.com","password":"admin123"}'

# 2. Guardar token de la respuesta
TOKEN="eyJhbGc..."

# 3. Listar dispositivos
curl -X GET https://aire-acondicionado-production.up.railway.app/api/devices \
  -H "Authorization: Bearer $TOKEN"

# 4. Enviar comando
curl -X POST https://aire-acondicionado-production.up.railway.app/api/control/command \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId":"uuid",
    "commandType":"setTemperature",
    "parameters":{"temperature":22}
  }'
```

---

## Soporte

Para reportar problemas o solicitar nuevos endpoints:

- **Email:** soporte@acplatform.com
- **GitHub Issues:** https://github.com/lrodriolivera/aire-acondicionado/issues
