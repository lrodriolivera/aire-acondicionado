# Manual de Usuario

Bienvenido a la Plataforma de Gestión Centralizada de Aires Acondicionados. Este manual te guiará a través de todas las funcionalidades de la plataforma.

## Índice

1. [Acceso a la Plataforma](#acceso-a-la-plataforma)
2. [Navegación General](#navegación-general)
3. [Dashboard](#dashboard)
4. [Gestión de Dispositivos](#gestión-de-dispositivos)
5. [Control de Dispositivos](#control-de-dispositivos)
6. [Ubicaciones](#ubicaciones)
7. [Horarios Programados](#horarios-programados)
8. [Alertas](#alertas)
9. [Usuarios](#usuarios)
10. [Configuración](#configuración)
11. [Reportes](#reportes)
12. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Acceso a la Plataforma

### Primera vez

1. Abre tu navegador web (Chrome, Firefox, Safari, Edge)
2. Ingresa a: https://aire-acondicionado-frontend.vercel.app
3. Verás la pantalla de inicio de sesión

### Credenciales de Prueba

Para propósitos de demostración:
- **Email:** admin@acplatform.com
- **Contraseña:** admin123

### Iniciar Sesión

1. Ingresa tu email
2. Ingresa tu contraseña
3. Click en **"Iniciar Sesión"**
4. Serás redirigido al Dashboard

### Cerrar Sesión

1. Click en tu nombre/avatar en la esquina superior derecha
2. Selecciona **"Cerrar Sesión"**

### Cambiar Contraseña

1. Ve a **Configuración** (ícono de engranaje)
2. Sección **"Seguridad"**
3. Click en **"Cambiar Contraseña"**
4. Ingresa:
   - Contraseña actual
   - Nueva contraseña
   - Confirmar nueva contraseña
5. Click en **"Guardar"**

---

## Navegación General

### Menú Principal (Sidebar)

La barra lateral izquierda contiene todas las secciones principales:

- **🏠 Dashboard** - Vista general del sistema
- **❄️ Dispositivos** - Listado y control de aires acondicionados
- **📍 Ubicaciones** - Gestión de edificios, pisos y salas
- **📅 Horarios** - Programación automática
- **🔔 Alertas** - Notificaciones y avisos
- **👥 Usuarios** - Administración de usuarios (solo Admin)
- **🎨 Marcas** - Catálogo de marcas (solo Admin)
- **📦 Modelos** - Catálogo de modelos (solo Admin)
- **📊 Reportes** - Analítica y estadísticas
- **⚙️ Configuración** - Ajustes personales

### Header (Parte superior)

- **Nombre de la sección actual**
- **Buscador** (en algunas secciones)
- **Notificaciones** 🔔
- **Perfil de usuario** 👤

---

## Dashboard

El Dashboard es tu página de inicio y proporciona una vista general del sistema.

### Widgets Principales

#### 1. Estadísticas Generales

Muestra 4 tarjetas con métricas clave:

- **Total de Dispositivos** - Cantidad total de ACs en el sistema
- **Dispositivos Online** - ACs conectados y funcionando
- **Dispositivos Offline** - ACs desconectados
- **Alertas Activas** - Número de alertas sin atender

#### 2. Consumo Energético

Gráfico de líneas que muestra:
- Consumo en kWh por día/semana/mes
- Comparativa con períodos anteriores
- Picos de consumo

#### 3. Alertas Recientes

Lista de las últimas alertas:
- Dispositivos offline
- Temperaturas fuera de rango
- Mantenimiento necesario

Click en una alerta para ver detalles.

#### 4. Dispositivos por Ubicación

Gráfico circular que muestra:
- Distribución de dispositivos por piso/área
- Porcentaje de cada ubicación

#### 5. Estado de Temperaturas

Mapa de calor mostrando:
- Temperatura actual por zona
- Comparación con temperatura objetivo
- Zonas que requieren atención

### Filtros de Fecha

En la esquina superior derecha:
- **Hoy** - Datos del día actual
- **Esta Semana** - Últimos 7 días
- **Este Mes** - Mes actual
- **Personalizado** - Rango de fechas específico

### Actualización

El dashboard se actualiza automáticamente cada 30 segundos. Para refrescar manualmente, click en el ícono de **"Actualizar"** ↻

---

## Gestión de Dispositivos

### Ver Listado de Dispositivos

1. Click en **"Dispositivos"** en el menú lateral
2. Verás todas las unidades de AC configuradas

Cada tarjeta de dispositivo muestra:
- **Nombre** del dispositivo
- **Ubicación**
- **Estado** (● Verde = Online, ● Gris = Offline)
- **Temperatura actual**
- **Temperatura objetivo**
- **Humedad**
- **Estado de encendido**
- **Modo** (cool, heat, fan, auto)

### Filtrar Dispositivos

Usa los filtros en la parte superior:

- **Por Estado:**
  - Todos
  - Online
  - Offline
  - Error

- **Por Ubicación:**
  - Selecciona del dropdown

- **Por Modelo:**
  - Selecciona marca/modelo

- **Búsqueda:**
  - Escribe nombre o serial number

### Ver Detalles de un Dispositivo

1. Click en cualquier tarjeta de dispositivo
2. Se abrirá la vista detallada con:
   - **Panel Izquierdo:** Estado actual
   - **Panel Derecho:** Controles

---

## Control de Dispositivos

### Controles Básicos

#### Encender/Apagar

1. Abre el dispositivo
2. Click en botón **"Encender"** o **"Apagar"**
3. El cambio se aplica inmediatamente
4. Verás una notificación de confirmación

#### Ajustar Temperatura

1. Usa el **slider** de temperatura
2. Arrastra para seleccionar temperatura deseada (16°C - 30°C)
3. Click en **"Aplicar Temperatura"**
4. La temperatura se actualiza en ~2 segundos

#### Cambiar Modo de Operación

Selecciona uno de los modos disponibles:

- **❄️ Cool (Frío)** - Enfriamiento
- **🔥 Heat (Calor)** - Calefacción
- **💨 Fan (Ventilador)** - Solo ventilación
- **🔄 Auto (Automático)** - Ajuste automático

Click en el botón del modo deseado.

#### Velocidad del Ventilador

Selecciona la velocidad:

- **Low (Bajo)** - Silencioso
- **Medium (Medio)** - Balance
- **High (Alto)** - Máxima potencia
- **Auto (Automático)** - Ajuste automático

### Respuesta de los Comandos

Cuando envías un comando:

1. ✅ Verás mensaje: **"Comando enviado"**
2. La interfaz se actualiza automáticamente
3. Si hay error: ❌ **"Error al enviar comando"**

**Nota:** En modo demo, los cambios son instantáneos. Con dispositivos reales, puede tomar 2-5 segundos.

### Límites y Restricciones

- **Temperatura mínima:** 16°C (varía según modelo)
- **Temperatura máxima:** 30°C (varía según modelo)
- **Comandos por minuto:** Máximo 60

---

## Ubicaciones

Las ubicaciones te permiten organizar dispositivos por edificio, piso y sala.

### Ver Ubicaciones

1. Click en **"Ubicaciones"** en el menú
2. Verás una estructura jerárquica:
   ```
   Edificio Principal
   ├── Piso 1
   │   ├── Recepción (2 dispositivos)
   │   ├── Cafetería (1 dispositivo)
   │   └── Sala de Juntas (1 dispositivo)
   ├── Piso 2
   │   └── Oficinas (3 dispositivos)
   ```

### Crear Nueva Ubicación

1. Click en **"+ Agregar Ubicación"**
2. Completa el formulario:
   - **Nombre:** Ej: "Sala de Juntas A"
   - **Tipo:**
     - Building (Edificio)
     - Floor (Piso)
     - Room (Sala)
     - Zone (Zona)
   - **Ubicación Padre:** Selecciona la ubicación superior
3. Click en **"Guardar"**

### Editar Ubicación

1. Click en el ícono de lápiz ✏️ junto a la ubicación
2. Modifica los campos
3. Click en **"Guardar"**

### Eliminar Ubicación

1. Click en el ícono de papelera 🗑️
2. Confirma la eliminación

**⚠️ Nota:** No puedes eliminar ubicaciones que tengan dispositivos asignados. Primero reasigna los dispositivos.

### Ver Dispositivos por Ubicación

1. Click en el nombre de la ubicación
2. Se mostrarán todos los dispositivos en esa ubicación
3. Puedes controlar dispositivos directamente desde aquí

---

## Horarios Programados

Los horarios permiten automatizar acciones en tus dispositivos.

### Ver Horarios

1. Click en **"Horarios"** en el menú
2. Verás lista de horarios configurados
3. Cada horario muestra:
   - Nombre
   - Dispositivo o ubicación
   - Frecuencia (diario, días específicos, etc.)
   - Acción a ejecutar
   - Estado (activo/inactivo)

### Crear Nuevo Horario

1. Click en **"+ Crear Horario"**

2. **Paso 1: Información Básica**
   - **Nombre:** Ej: "Encender ACs Mañana"
   - **Descripción:** (opcional)

3. **Paso 2: Seleccionar Objetivo**
   - **Dispositivo específico** o
   - **Todos los dispositivos de una ubicación**

4. **Paso 3: Programación**
   - **Frecuencia:**
     - Una vez
     - Diariamente
     - Días específicos de la semana
     - Mensualmente
   - **Hora:** Selecciona hora de ejecución
   - **Zona horaria:** Tu zona horaria

5. **Paso 4: Acción**
   - Selecciona qué comando ejecutar:
     - Encender/Apagar
     - Ajustar temperatura
     - Cambiar modo
     - Cambiar velocidad ventilador

6. **Paso 5: Confirmar**
   - Revisa resumen
   - Click en **"Crear Horario"**

### Ejemplos de Horarios

**Ejemplo 1: Encender oficinas en la mañana**
- Nombre: "Encender Oficinas"
- Ubicación: Piso 2 - Oficinas
- Frecuencia: Lunes a Viernes
- Hora: 08:00 AM
- Acción: Encender + Temperatura 24°C + Modo Cool

**Ejemplo 2: Apagar todo en la noche**
- Nombre: "Apagar Todo"
- Ubicación: Edificio Principal
- Frecuencia: Diario
- Hora: 10:00 PM
- Acción: Apagar

**Ejemplo 3: Modo eco durante almuerzo**
- Nombre: "Modo Eco Almuerzo"
- Dispositivos: Cafetería
- Frecuencia: Lunes a Viernes
- Hora: 12:00 PM - 02:00 PM
- Acción: Temperatura 26°C

### Activar/Desactivar Horario

Click en el switch ⚪/🟢 junto al horario.

### Editar Horario

1. Click en el ícono de editar ✏️
2. Modifica los campos necesarios
3. Click en **"Guardar"**

### Eliminar Horario

1. Click en el ícono de eliminar 🗑️
2. Confirma la eliminación

### Ver Historial de Ejecución

1. Click en un horario
2. Tab **"Historial"**
3. Verás todas las ejecuciones:
   - Fecha y hora
   - Resultado (exitoso/fallido)
   - Dispositivos afectados

---

## Alertas

El sistema genera alertas automáticamente cuando detecta problemas.

### Ver Alertas

1. Click en **"Alertas"** en el menú o
2. Click en el ícono de campana 🔔 en el header

### Tipos de Alertas

#### 🔴 Críticas
- Dispositivo offline más de 1 hora
- Error de comunicación
- Falla del sistema

#### 🟡 Advertencias
- Temperatura fuera de rango
- Consumo energético alto
- Mantenimiento próximo

#### 🔵 Informativas
- Dispositivo reconectado
- Horario ejecutado
- Actualización de firmware disponible

### Filtrar Alertas

**Por Severidad:**
- Todas
- Críticas
- Advertencias
- Informativas

**Por Estado:**
- No atendidas
- Atendidas
- Resueltas

**Por Dispositivo:**
- Selecciona del dropdown

### Atender una Alerta

1. Click en la alerta
2. Se abre panel de detalles
3. Revisa información
4. Click en **"Marcar como Atendida"**
5. (Opcional) Agrega un comentario

### Resolver una Alerta

Algunas alertas requieren acción:

**Ejemplo: "Dispositivo Offline"**
1. Verifica conexión del dispositivo
2. Reinicia el dispositivo si es necesario
3. Cuando el dispositivo se reconecte, la alerta se marcará como resuelta automáticamente

**Ejemplo: "Temperatura Alta"**
1. Ve al dispositivo
2. Ajusta la temperatura
3. La alerta se resolverá cuando la temperatura vuelva al rango normal

### Notificaciones

Las alertas críticas generan notificaciones:

- **Navegador:** Notificación push (requiere permiso)
- **Email:** Si está configurado (Admin)
- **Sonido:** Para alertas críticas

#### Configurar Notificaciones

1. Ve a **Configuración** → **Notificaciones**
2. Activa/desactiva:
   - Notificaciones del navegador
   - Notificaciones por email
   - Sonidos
3. Click en **"Guardar"**

---

## Usuarios

**Nota:** Esta sección solo está disponible para Administradores.

### Roles de Usuario

#### 👁️ Viewer (Visor)
- Ver dashboard
- Ver dispositivos
- Ver reportes
- **No puede:** Controlar dispositivos

#### 🎮 Operator (Operador)
- Todo lo de Viewer +
- Controlar dispositivos
- Atender alertas
- **No puede:** Gestionar usuarios, crear horarios

#### 👨‍💼 Admin (Administrador)
- Todo lo de Operator +
- Crear/editar dispositivos
- Crear horarios
- Gestionar ubicaciones
- Gestionar marcas y modelos
- **No puede:** Gestionar usuarios super admin

#### 👑 Super Admin
- Acceso total al sistema
- Gestionar todos los usuarios
- Configuración avanzada
- Eliminación de datos

### Listar Usuarios

1. Click en **"Usuarios"**
2. Verás tabla con:
   - Nombre completo
   - Email
   - Rol
   - Estado (Activo/Inactivo)
   - Último acceso

### Crear Nuevo Usuario

1. Click en **"+ Agregar Usuario"**
2. Completa el formulario:
   - **Nombre Completo:** Ej: "Juan Pérez"
   - **Email:** usuario@empresa.com
   - **Rol:** Selecciona del dropdown
   - **Contraseña Temporal:** Min. 8 caracteres
3. Click en **"Crear Usuario"**
4. El usuario recibirá un email con sus credenciales

### Editar Usuario

1. Click en el ícono de editar ✏️
2. Puedes cambiar:
   - Nombre completo
   - Rol
   - Estado (Activo/Inactivo)
3. Click en **"Guardar"**

**⚠️ Nota:** No puedes cambiar tu propio rol.

### Desactivar Usuario

1. Click en el switch junto al usuario
2. El usuario ya no podrá acceder al sistema
3. Sus sesiones activas se cerrarán

### Resetear Contraseña

1. Click en el ícono de llave 🔑
2. Se genera una contraseña temporal
3. El usuario recibirá un email para cambiarla

### Eliminar Usuario

1. Click en el ícono de eliminar 🗑️
2. Confirma la eliminación
3. **⚠️ Esta acción no se puede deshacer**

---

## Configuración

### Perfil Personal

1. Click en tu nombre → **"Perfil"**
2. Puedes editar:
   - Nombre completo
   - Email
   - Avatar (foto de perfil)
   - Idioma
   - Zona horaria

### Preferencias

#### Tema
- **Claro** - Fondo blanco
- **Oscuro** - Fondo negro (próximamente)
- **Auto** - Según sistema operativo

#### Idioma
- Español
- English (próximamente)

#### Formato de Fecha
- DD/MM/YYYY
- MM/DD/YYYY
- YYYY-MM-DD

#### Unidades
- **Temperatura:** Celsius / Fahrenheit
- **Energía:** kWh / BTU

### Notificaciones

Configura cómo quieres recibir alertas:

- ✅ Notificaciones del navegador
- ✅ Notificaciones por email
- ✅ Sonidos para alertas críticas
- ⬜ Alertas solo durante horario laboral

### Seguridad

#### Cambiar Contraseña

1. Tab **"Seguridad"**
2. **"Cambiar Contraseña"**
3. Ingresa:
   - Contraseña actual
   - Nueva contraseña
   - Confirmar contraseña
4. Click en **"Cambiar"**

#### Sesiones Activas

Ver todas las sesiones donde has iniciado sesión:
- Dispositivo
- Ubicación (aproximada)
- Última actividad
- Click en **"Cerrar Sesión"** para terminar sesión en ese dispositivo

#### Autenticación de Dos Factores (2FA)

*Próximamente*

---

## Reportes

### Tipos de Reportes

#### Consumo Energético

1. Click en **"Reportes"** → **"Consumo"**
2. Selecciona:
   - Período (día, semana, mes, año)
   - Dispositivos o ubicaciones
3. Visualiza:
   - Gráfico de consumo
   - Comparativa con períodos anteriores
   - Costo estimado
4. Click en **"Exportar"** para descargar (PDF/Excel)

#### Uso de Dispositivos

1. **"Reportes"** → **"Uso"**
2. Muestra:
   - Horas de operación por dispositivo
   - Modos más utilizados
   - Temperaturas promedio
   - Patrones de uso

#### Eficiencia

1. **"Reportes"** → **"Eficiencia"**
2. Analiza:
   - Consumo vs. horas de uso
   - Dispositivos más eficientes
   - Dispositivos que requieren mantenimiento
   - Recomendaciones de optimización

#### Alertas

1. **"Reportes"** → **"Alertas"**
2. Resumen de:
   - Total de alertas por tipo
   - Tiempo promedio de resolución
   - Dispositivos con más alertas
   - Tendencias

### Exportar Reportes

1. Configura el reporte
2. Click en **"Exportar"**
3. Selecciona formato:
   - **PDF** - Para imprimir o presentar
   - **Excel** - Para análisis adicional
   - **CSV** - Para importar a otros sistemas
4. El archivo se descargará automáticamente

### Programar Reportes

1. En cualquier reporte, click en **"Programar"**
2. Configura:
   - Frecuencia (diaria, semanal, mensual)
   - Destinatarios (emails)
   - Formato
3. Recibirás el reporte automáticamente por email

---

## Preguntas Frecuentes

### ¿Cómo sé si un dispositivo está online?

Verás un punto verde (●) junto al nombre del dispositivo. Si está gris, el dispositivo está offline.

### ¿Por qué un dispositivo aparece offline?

Posibles causas:
- Dispositivo apagado físicamente
- Problema de red/WiFi
- Cable de red desconectado
- Mantenimiento en progreso

**Solución:** Verifica la conexión física del dispositivo y reinícialo si es necesario.

### ¿Cuánto tarda en aplicarse un comando?

- **Modo demo:** Inmediato (~500ms)
- **Dispositivos reales:** 2-5 segundos

### ¿Puedo controlar múltiples dispositivos a la vez?

Sí, usa Horarios para programar acciones en múltiples dispositivos o ubicaciones completas.

### ¿Se guardan los cambios de configuración?

Sí, todos los cambios se guardan automáticamente en la base de datos y se sincronizan en tiempo real.

### ¿Qué pasa si pierdo la conexión a Internet?

El sistema mostrará un mensaje de "Sin conexión". Los dispositivos físicos seguirán funcionando con su última configuración, pero no podrás controlarlos hasta que se restablezca la conexión.

### ¿Puedo acceder desde mi móvil?

Sí, la plataforma es responsive y funciona en:
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablets (iPad, Android)
- ✅ Móviles (iPhone, Android)

### ¿Cómo actualizo la página sin perder mi sesión?

Simplemente recarga la página (F5). Tu sesión permanecerá activa por 7 días.

### ¿Puedo ver el historial de cambios?

Sí, en la vista de dispositivo → Tab "Historial" verás todos los comandos ejecutados y cambios de estado.

### ¿Cómo obtengo más ayuda?

- **Email:** soporte@acplatform.com
- **Chat en vivo:** Click en el ícono de ayuda (?)
- **Documentación:** Menú → Ayuda → Documentación

---

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Alt + D` | Ir a Dashboard |
| `Alt + V` | Ir a Dispositivos |
| `Alt + L` | Ir a Ubicaciones |
| `Alt + A` | Ver Alertas |
| `Ctrl + K` | Buscador rápido |
| `Esc` | Cerrar modales |
| `/` | Focus en búsqueda |

---

## Glosario

- **AC:** Aire Acondicionado
- **Dashboard:** Panel de control principal
- **Dispositivo:** Unidad de aire acondicionado
- **Ubicación:** Lugar físico donde está instalado un dispositivo
- **Horario:** Programación automática de acciones
- **Alerta:** Notificación de un evento importante
- **Modo:** Forma de operación del AC (frío, calor, ventilador, auto)
- **Telemetría:** Datos enviados por el dispositivo (temperatura, humedad, etc.)
- **kWh:** Kilovatio-hora, unidad de consumo energético

---

## Soporte

### Contacto

- **Email:** soporte@acplatform.com
- **Teléfono:** +XX XXX XXX XXXX
- **Horario:** Lunes a Viernes, 9:00 AM - 6:00 PM

### Reportar un Problema

1. Click en **"Ayuda"** → **"Reportar Problema"**
2. Completa el formulario:
   - Descripción del problema
   - Pasos para reproducirlo
   - Capturas de pantalla (opcional)
3. Click en **"Enviar"**
4. Recibirás un número de ticket

### Solicitar Nueva Funcionalidad

Envía tus sugerencias a: features@acplatform.com

---

**¡Gracias por usar nuestra plataforma!** 🎉

Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
