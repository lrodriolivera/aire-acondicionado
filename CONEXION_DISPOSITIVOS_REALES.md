# Conexión con Dispositivos Reales - Plataforma AC Management

## Resumen Ejecutivo

La aplicación está diseñada para conectarse a aires acondicionados reales en una red de producción. Este documento explica cómo funciona la arquitectura de conexión y cómo configurar dispositivos reales.

---

## 1. Protocolos Soportados

El sistema está diseñado para soportar múltiples protocolos de comunicación:

- **MQTT** (más común): Protocolo de mensajería ligero para IoT
- **HTTP/API REST**: Para dispositivos con API web
- **Modbus**: Protocolo industrial
- **BACnet**: Protocolo de automatización de edificios

---

## 2. Arquitectura de Conexión

```
Dispositivos AC Reales → Protocolo (MQTT/HTTP/etc) → Backend → Frontend
```

### Componentes Clave

#### a) MQTT Broker (si usas MQTT)
- Necesitas un broker MQTT (como Mosquitto) corriendo en tu red
- Los aires acondicionados publican su estado en tópicos MQTT
- El backend se suscribe a estos tópicos para recibir datos en tiempo real

#### b) Backend
- El archivo `/backend/src/services/mqtt.service.ts` maneja la conexión MQTT
- Escucha los mensajes de los dispositivos
- Envía comandos a los dispositivos

#### c) Base de Datos
- Cada dispositivo se registra con su configuración de conexión
- Incluye: IP, topic MQTT, tipo de protocolo, etc.

---

## 3. Flujo de Datos en Producción

### Recibir datos del AC

1. El AC publica telemetría → `ac/device/001/telemetry`
2. Backend escucha el topic y recibe: `{temperature: 24, humidity: 60, power: true}`
3. Backend guarda en la tabla `device_telemetry`
4. Frontend consulta via API y muestra los datos

### Enviar comandos al AC

1. Usuario cambia temperatura en el frontend
2. Frontend envía: `POST /api/control/command {deviceId, command: "setTemperature", value: 22}`
3. Backend publica en MQTT: `ac/device/001/command → {action: "setTemp", value: 22}`
4. El AC recibe el comando y cambia la temperatura

---

## 4. Configuración de Dispositivos para Producción

Cada dispositivo debe configurarse con:

```json
{
  "model_id": "uuid-del-modelo",
  "name": "AC Oficina 101",
  "serial_number": "AC-12345",
  "ip_address": "192.168.1.100",
  "mqtt_topic": "ac/office/101",
  "config": {
    "broker": "mqtt://192.168.1.50:1883",
    "username": "ac_device",
    "password": "secure_password"
  }
}
```

---

## 5. Compatibilidad con Dispositivos Reales

### Opción A - AC con soporte MQTT nativo

Algunos ACs modernos (Daikin, Mitsubishi, etc.) tienen módulos WiFi con MQTT:
- Solo necesitas configurar el broker y topics
- Verificar el manual del fabricante para el formato de mensajes

### Opción B - AC con API REST

Si el AC tiene una API HTTP:
- Usa el protocolo HTTP en el modelo
- El backend hace peticiones HTTP al AC
- Configura la URL base y endpoints en `connection_config`

### Opción C - AC sin conectividad (más común)

Necesitas un **gateway IoT** o **controlador intermediario**:

#### ESP32/ESP8266 con sensor IR
- Emula el control remoto infrarrojo
- Se conecta a WiFi y publica/escucha por MQTT
- Proyectos de referencia: Tasmota, ESPHome

#### Módulos WiFi del fabricante
- Algunos fabricantes venden adaptadores WiFi oficiales
- Ejemplos: Daikin BRP069, Mitsubishi MAC-568IF-E

#### Controladores Modbus/BACnet
- Para sistemas industriales o edificios inteligentes
- Requiere configuración de registros Modbus o puntos BACnet

---

## 6. Ejemplo de Integración Real - Daikin

Si tienes un AC Daikin con módulo WiFi:

```json
{
  "protocol_type": "mqtt",
  "connection_config": {
    "broker": "mqtt://192.168.1.50:1883",
    "topics": {
      "status": "daikin/ac101/status",
      "command": "daikin/ac101/set",
      "telemetry": "daikin/ac101/telemetry"
    },
    "mappings": {
      "temperature": "temp",
      "power": "pow",
      "mode": "mode"
    }
  }
}
```

El backend traduce los comandos al formato que el AC entiende.

---

## 7. Simulación vs Producción

### Actualmente (Desarrollo)

- No hay dispositivos reales conectados
- Puedes crear dispositivos en la BD pero no recibirán/enviarán datos reales
- Los datos de telemetría se insertarían manualmente o con un script de prueba

### En Producción

- El servicio MQTT escucha constantemente
- Cuando un AC publica datos, se guardan automáticamente
- Los comandos se envían inmediatamente al dispositivo
- Telemetría en tiempo real visible en el dashboard

---

## 8. Pasos para Conectar un AC Real

### Paso 1: Instalar broker MQTT (si usas MQTT)

```bash
# Usando Docker
docker run -d \
  --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto

# O instalar directamente
sudo apt-get install mosquitto mosquitto-clients
```

### Paso 2: Configurar el AC o gateway

- Conectar el dispositivo a la red
- Configurar IP estática (recomendado)
- Configurar conexión al broker MQTT
- Establecer topics de publicación/suscripción

### Paso 3: Registrar el dispositivo en la plataforma

Usa la interfaz web o API para crear el dispositivo con:
- Modelo (debe existir previamente)
- Ubicación
- Número de serie
- IP del dispositivo
- Topic MQTT
- Configuración de conexión

### Paso 4: Verificación

El backend automáticamente:
- Se suscribe a los topics del dispositivo
- Recibe telemetría en tiempo real
- Puede enviar comandos
- Actualiza el estado en la base de datos

---

## 9. Configuración del Backend para MQTT

El servicio MQTT debe estar configurado en `/backend/src/config/index.ts`:

```typescript
mqtt: {
  broker: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
  username: process.env.MQTT_USERNAME || '',
  password: process.env.MQTT_PASSWORD || '',
  clientId: process.env.MQTT_CLIENT_ID || 'ac-platform-backend'
}
```

Variables de entorno necesarias en `.env`:

```env
MQTT_BROKER=mqtt://192.168.1.50:1883
MQTT_USERNAME=ac_platform
MQTT_PASSWORD=secure_password
MQTT_CLIENT_ID=ac-platform-backend
```

---

## 10. Formato de Mensajes MQTT

### Telemetría (AC → Backend)

Topic: `ac/{device_id}/telemetry`

```json
{
  "temperature": 24.5,
  "humidity": 60,
  "power_state": true,
  "mode": "cool",
  "fan_speed": "auto",
  "target_temperature": 22,
  "power_consumption": 1.2,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Comandos (Backend → AC)

Topic: `ac/{device_id}/command`

```json
{
  "action": "setTemperature",
  "value": 22,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Estado (AC → Backend)

Topic: `ac/{device_id}/status`

```json
{
  "online": true,
  "error_code": null,
  "last_update": "2025-01-15T10:30:00Z"
}
```

---

## 11. Solución de Problemas

### El dispositivo no aparece online

1. Verificar que el broker MQTT esté corriendo
2. Verificar conectividad de red del AC
3. Revisar logs del backend: `docker logs ac-backend`
4. Verificar que los topics coincidan exactamente

### Los comandos no funcionan

1. Verificar permisos en el broker MQTT
2. Revisar el formato de mensajes del fabricante
3. Verificar los mappings en `connection_config`
4. Probar comandos manualmente con `mosquitto_pub`

### Telemetría no se recibe

1. Verificar que el AC esté publicando (usar `mosquitto_sub`)
2. Revisar suscripciones del backend en los logs
3. Verificar formato del mensaje JSON
4. Verificar base de datos para inserción de datos

---

## 12. Herramientas de Depuración

### Mosquitto Clients (línea de comandos)

```bash
# Escuchar todos los mensajes
mosquitto_sub -h localhost -t '#' -v

# Escuchar topic específico
mosquitto_sub -h localhost -t 'ac/+/telemetry'

# Publicar comando de prueba
mosquitto_pub -h localhost -t 'ac/device001/command' -m '{"action":"setPower","value":true}'
```

### MQTT Explorer (GUI)

- Aplicación gráfica para ver topics y mensajes
- Descarga: http://mqtt-explorer.com

---

## 13. Seguridad en Producción

### Recomendaciones

1. **Usar TLS/SSL** para conexiones MQTT:
   ```
   mqtts://192.168.1.50:8883
   ```

2. **Autenticación** requerida en el broker

3. **ACLs** (Access Control Lists) por dispositivo:
   - Cada AC solo puede publicar/suscribirse a sus propios topics

4. **Red segregada** para dispositivos IoT

5. **Firewall** configurado para permitir solo tráfico necesario

---

## 14. Escalabilidad

Para instalaciones grandes:

- **Cluster de brokers MQTT** para alta disponibilidad
- **Load balancers** para el backend
- **Particionamiento** de base de datos por ubicación
- **Caching** con Redis para datos de telemetría recientes
- **Compresión** de datos históricos

---

## 15. Próximos Pasos

1. Identificar el modelo/marca de tus aires acondicionados
2. Verificar si tienen conectividad nativa o necesitan gateway
3. Configurar broker MQTT en la red
4. Probar conexión con un dispositivo piloto
5. Registrar dispositivo en la plataforma
6. Verificar telemetría y comandos
7. Escalar a todos los dispositivos

---

## Contacto y Soporte

Para asistencia con la integración de dispositivos específicos, consulta:
- Documentación del fabricante del AC
- Manual del módulo WiFi/gateway
- Especificaciones del protocolo MQTT/Modbus/BACnet utilizado

---

**Fecha de creación:** 2025-10-22
**Versión:** 1.0
**Plataforma:** AC Management Platform
