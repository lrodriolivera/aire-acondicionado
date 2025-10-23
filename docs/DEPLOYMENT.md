# Guía de Despliegue

Esta guía cubre el despliegue completo de la plataforma en producción utilizando Railway (backend) y Vercel (frontend).

## Índice

1. [Prerequisitos](#prerequisitos)
2. [Despliegue del Backend en Railway](#despliegue-del-backend-en-railway)
3. [Despliegue del Frontend en Vercel](#despliegue-del-frontend-en-vercel)
4. [Configuración de Dominios](#configuración-de-dominios)
5. [Variables de Entorno](#variables-de-entorno)
6. [Inicialización de Base de Datos](#inicialización-de-base-de-datos)
7. [Verificación del Despliegue](#verificación-del-despliegue)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisitos

### Cuentas Necesarias

- [ ] Cuenta de GitHub (para repositorio)
- [ ] Cuenta de Railway (https://railway.app)
- [ ] Cuenta de Vercel (https://vercel.com)

### Repositorio

Asegúrate de que tu código esté en GitHub:

```bash
git remote -v
# Debería mostrar el repositorio remoto
```

---

## Despliegue del Backend en Railway

### Paso 1: Crear Proyecto en Railway

1. Ve a [Railway.app](https://railway.app) e inicia sesión
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu cuenta de GitHub
5. Selecciona el repositorio `aire-acondicionado`

### Paso 2: Agregar Servicios

Railway creará automáticamente un servicio para tu aplicación. Ahora necesitas agregar PostgreSQL y Redis:

#### Agregar PostgreSQL

1. Click en "+ New" → "Database" → "Add PostgreSQL"
2. Railway creará automáticamente:
   - Servicio de PostgreSQL
   - Variable `DATABASE_URL`
3. Espera a que el servicio esté listo (● Ready)

#### Agregar Redis

1. Click en "+ New" → "Database" → "Add Redis"
2. Railway creará automáticamente:
   - Servicio de Redis
   - Variable `REDIS_URL`
3. Espera a que el servicio esté listo (● Ready)

### Paso 3: Configurar Backend Service

1. Click en el servicio del backend (Node.js)
2. Ve a "Settings"

#### Configurar Root Directory

1. En "Settings" → "Build"
2. Set "Root Directory" = `backend`
3. Set "Build Command" = `npm run build`
4. Set "Start Command" = `npm run start`

#### Configurar Variables de Entorno

1. Ve a la pestaña "Variables"
2. Click en "New Variable" y agrega:

```bash
NODE_ENV=production
PORT=3000

# Database (automático desde PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (automático desde Redis service)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT Secrets (genera valores seguros)
JWT_SECRET=<genera-un-secreto-muy-seguro>
JWT_REFRESH_SECRET=<genera-otro-secreto-diferente>

# CORS Origin (URL del frontend en Vercel)
CORS_ORIGIN=https://tu-frontend.vercel.app

# MQTT (opcional, para dispositivos reales)
MQTT_BROKER_URL=mqtt://localhost:1883
```

**Generar Secrets Seguros:**

```bash
# En tu terminal local
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Configurar Puerto

1. En "Settings" → "Networking"
2. Verify que el puerto público sea 3000 (o agrega PORT=3000 en variables)

### Paso 4: Deploy

1. Railway desplegará automáticamente
2. Monitorea los logs en la pestaña "Deployments"
3. Espera a ver "Server running on port 3000"

### Paso 5: Obtener URL de Producción

1. En "Settings" → "Networking"
2. Click en "Generate Domain"
3. Railway generará una URL como:
   ```
   https://aire-acondicionado-production.up.railway.app
   ```
4. Guarda esta URL para usarla en el frontend

---

## Inicialización de Base de Datos

### Método 1: Via psql (Recomendado)

1. En Railway, ve al servicio de PostgreSQL
2. Click en "Connect" → Copia las credenciales

Desde tu máquina local:

```bash
# Formato de conexión
PGPASSWORD=<password> psql -h <host> -U postgres -p <port> -d railway < backend/init.sql

# Ejemplo real
PGPASSWORD=ymRTXWTVvAOBjdnMvClNvLpEsGbcGxlO psql \
  -h yamanote.proxy.rlwy.net \
  -U postgres \
  -p 13144 \
  -d railway < backend/init.sql
```

#### Cargar Datos de Prueba (Opcional)

```bash
PGPASSWORD=<password> psql -h <host> -U postgres -p <port> -d railway < backend/seed-data.sql
```

### Método 2: Via Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Ejecutar migraciones
railway run psql < backend/init.sql
```

### Método 3: Via Database Client (TablePlus, DBeaver, etc.)

1. Abre tu cliente SQL preferido
2. Conecta usando las credenciales de Railway:
   - Host: `yamanote.proxy.rlwy.net`
   - Port: `13144`
   - Database: `railway`
   - User: `postgres`
   - Password: (from Railway)
3. Ejecuta manualmente los scripts:
   - `backend/init.sql`
   - `backend/seed-data.sql` (opcional)

### Verificar Tablas Creadas

```sql
-- Conecta y ejecuta
\dt

-- Deberías ver:
-- brands, models, devices, device_status, locations, users, etc.
```

### Crear Usuario Administrador

El script `init.sql` ya crea el usuario admin. Verifica:

```sql
SELECT email, role FROM users WHERE role = 'super_admin';
```

Credenciales por defecto:
- Email: `admin@acplatform.com`
- Password: `admin123`

**⚠️ IMPORTANTE:** Cambia la contraseña después del primer login.

---

## Despliegue del Frontend en Vercel

### Paso 1: Importar Proyecto

1. Ve a [Vercel.com](https://vercel.com) e inicia sesión
2. Click en "Add New..." → "Project"
3. Selecciona "Import Git Repository"
4. Conecta tu cuenta de GitHub
5. Selecciona el repositorio `aire-acondicionado`

### Paso 2: Configurar Proyecto

En la pantalla de configuración:

1. **Framework Preset:** Vite
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Install Command:** `npm install`

### Paso 3: Configurar Variables de Entorno

En "Environment Variables":

```bash
VITE_API_URL=https://aire-acondicionado-production.up.railway.app
VITE_WS_URL=wss://aire-acondicionado-production.up.railway.app
```

⚠️ **Importante:**
- Usa la URL de Railway del paso anterior
- Para WebSockets usa `wss://` (no `https://`)

### Paso 4: Deploy

1. Click en "Deploy"
2. Vercel construirá y desplegará automáticamente
3. Espera a ver "✓ Deployment ready"
4. Vercel generará una URL como:
   ```
   https://aire-acondicionado-frontend.vercel.app
   ```

### Paso 5: Actualizar CORS en Backend

1. Vuelve a Railway → Backend service → Variables
2. Actualiza `CORS_ORIGIN` con la URL de Vercel:
   ```
   CORS_ORIGIN=https://aire-acondicionado-frontend.vercel.app
   ```
3. Railway redesplegará automáticamente

### Paso 6: Desactivar Deployment Protection (Opcional)

Si quieres que el sitio sea público:

1. En Vercel → Project Settings
2. Ve a "Deployment Protection"
3. Desactiva "Vercel Authentication"

---

## Configuración de Dominios (Opcional)

### Dominio Personalizado en Vercel

1. En tu proyecto de Vercel → Settings → Domains
2. Click en "Add"
3. Ingresa tu dominio: `ac.tuempresa.com`
4. Sigue las instrucciones para configurar DNS:

```
Type: CNAME
Name: ac
Value: cname.vercel-dns.com
```

### Dominio Personalizado en Railway

1. En tu servicio de backend → Settings → Networking
2. Click en "Custom Domain"
3. Ingresa tu dominio: `api.tuempresa.com`
4. Configura DNS:

```
Type: CNAME
Name: api
Value: <railway-dns-provided>
```

### Actualizar Variables de Entorno

Después de configurar dominios personalizados, actualiza:

**Vercel (Frontend):**
```bash
VITE_API_URL=https://api.tuempresa.com
VITE_WS_URL=wss://api.tuempresa.com
```

**Railway (Backend):**
```bash
CORS_ORIGIN=https://ac.tuempresa.com
```

---

## Variables de Entorno Completas

### Backend (Railway)

```bash
# Environment
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis
REDIS_URL=${{Redis.REDIS_URL}}

# JWT
JWT_SECRET=<secreto-muy-seguro-64-chars>
JWT_REFRESH_SECRET=<otro-secreto-diferente-64-chars>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=https://aire-acondicionado-frontend.vercel.app

# MQTT (opcional)
MQTT_BROKER_URL=mqtt://broker.emqx.io:1883
MQTT_CLIENT_ID=ac-platform-prod

# Logging
LOG_LEVEL=info
```

### Frontend (Vercel)

```bash
# API URLs
VITE_API_URL=https://aire-acondicionado-production.up.railway.app
VITE_WS_URL=wss://aire-acondicionado-production.up.railway.app

# Optional: Analytics
VITE_GA_ID=UA-XXXXXXXXX-X
```

---

## Verificación del Despliegue

### 1. Health Check del Backend

```bash
curl https://aire-acondicionado-production.up.railway.app/health
```

Esperado:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T01:00:00.000Z",
  "database": "connected",
  "redis": "connected"
}
```

### 2. Test de Login

```bash
curl -X POST https://aire-acondicionado-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acplatform.com","password":"admin123"}'
```

Esperado:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

### 3. Verificar Frontend

1. Abre la URL de Vercel en el navegador
2. Deberías ver la página de login
3. Inicia sesión con las credenciales de admin
4. Verifica que el dashboard cargue correctamente

### 4. Test de WebSockets

En la consola del navegador (F12):

```javascript
const socket = io('wss://aire-acondicionado-production.up.railway.app', {
  auth: { token: 'Bearer <tu-token>' }
});

socket.on('connect', () => console.log('WebSocket connected!'));
```

### 5. Test de Comandos

1. Ve a la página de dispositivos
2. Click en un dispositivo
3. Intenta cambiar la temperatura
4. Verifica que la UI se actualice inmediatamente

---

## CI/CD Automático

Ambas plataformas tienen CI/CD automático configurado:

### Railway

- **Trigger:** Push a branch `main`
- **Build:** Automático
- **Deploy:** Automático
- **Rollback:** Disponible en Deployments tab

### Vercel

- **Trigger:** Push a cualquier branch
- **Preview:** Deployment automático para cada PR
- **Production:** Solo branch `main`
- **Rollback:** Click en deployment anterior → "Promote to Production"

### Workflow de Desarrollo Recomendado

```bash
# Crear feature branch
git checkout -b feature/nueva-funcionalidad

# Desarrollar y hacer commits
git add .
git commit -m "Add nueva funcionalidad"

# Push a GitHub
git push origin feature/nueva-funcionalidad

# Vercel creará un deployment de preview automáticamente
# Railway NO desplegará (solo main)

# Cuando esté listo, merge a main
git checkout main
git merge feature/nueva-funcionalidad
git push origin main

# Ambos servicios desplegarán automáticamente
```

---

## Monitoreo

### Railway Dashboard

1. Ve a tu proyecto en Railway
2. Click en el servicio (Backend)
3. Tabs disponibles:
   - **Metrics:** CPU, RAM, Network
   - **Deployments:** Historia de deploys
   - **Logs:** Logs en tiempo real

### Vercel Analytics

1. Ve a tu proyecto en Vercel
2. Tab "Analytics":
   - Core Web Vitals
   - Page views
   - Performance metrics

### Logs

**Railway:**
```bash
# Ver logs en tiempo real
railway logs --tail

# O en el dashboard web
```

**Vercel:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Ver logs
vercel logs <deployment-url>
```

---

## Backups

### Base de Datos (PostgreSQL)

Railway hace backups automáticos, pero también puedes hacer backups manuales:

```bash
# Backup
PGPASSWORD=<password> pg_dump \
  -h <host> -U postgres -p <port> railway \
  > backup_$(date +%Y%m%d).sql

# Restore
PGPASSWORD=<password> psql \
  -h <host> -U postgres -p <port> railway \
  < backup_20251023.sql
```

### Automatizar Backups

Crea un cron job o GitHub Action:

```yaml
# .github/workflows/backup.yml
name: Database Backup
on:
  schedule:
    - cron: '0 2 * * *' # Diario a las 2 AM
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Backup Database
        run: |
          PGPASSWORD=${{ secrets.DB_PASSWORD }} pg_dump \
            -h ${{ secrets.DB_HOST }} \
            -U postgres \
            -p ${{ secrets.DB_PORT }} \
            railway > backup.sql
      - name: Upload to S3
        uses: aws-actions/configure-aws-credentials@v1
        # ... configurar upload a S3
```

---

## Troubleshooting

### Backend no despliega en Railway

**Error:** "Build failed"

**Solución:**
1. Verifica que `backend/package.json` tenga:
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js"
     }
   }
   ```
2. Verifica Root Directory = `backend`
3. Revisa los logs de build

---

**Error:** "Application failed to respond"

**Solución:**
1. Verifica que el servidor escuche en `0.0.0.0`:
   ```typescript
   app.listen(PORT, '0.0.0.0', () => { ... });
   ```
2. Agrega `app.set('trust proxy', 1)` para Railway

---

**Error:** "Database connection failed"

**Solución:**
1. Verifica que DATABASE_URL esté configurada:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
2. Verifica que el servicio de PostgreSQL esté ● Ready
3. Revisa logs para errores de conexión

---

### Frontend no carga en Vercel

**Error:** "404 Not Found"

**Solución:**
1. Verifica Root Directory = `frontend`
2. Verifica Output Directory = `dist`
3. Agrega `vercel.json` en frontend:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

**Error:** "Failed to compile"

**Solución:**
1. Verifica que `frontend/package.json` tenga:
   ```json
   {
     "scripts": {
       "build": "tsc && vite build"
     }
   }
   ```
2. Revisa logs de build
3. Verifica que no haya errores de TypeScript

---

### CORS Errors

**Error:** "Access-Control-Allow-Origin"

**Solución:**
1. En Railway, verifica CORS_ORIGIN:
   ```
   CORS_ORIGIN=https://tu-frontend.vercel.app
   ```
2. En el backend, verifica configuración:
   ```typescript
   app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true
   }));
   ```
3. Redespliega el backend

---

### WebSockets no conectan

**Error:** "WebSocket connection failed"

**Solución:**
1. Verifica que uses `wss://` (no `https://`)
2. En frontend:
   ```
   VITE_WS_URL=wss://aire-acondicionado-production.up.railway.app
   ```
3. Verifica que Railway soporte WebSockets (lo soporta)

---

## Scaling

### Railway

**Vertical Scaling:**
1. Ve a Settings → Resources
2. Ajusta:
   - CPU: 1-8 vCPUs
   - RAM: 1-32 GB
3. Railway cobra por uso

**Horizontal Scaling:**
1. Railway soporta múltiples replicas
2. Requiere plan Pro
3. Load balancer incluido

### Vercel

**Edge Network:**
- Vercel automáticamente distribuye en CDN global
- Sin configuración necesaria
- Incluido en todos los planes

---

## Costos Estimados

### Railway (Backend + DB + Redis)

- **Hobby Plan:** $5/mes (limitado)
- **Pro Plan:** Pay as you go
  - Estimado para tráfico medio: $10-20/mes
  - PostgreSQL: ~$5/mes
  - Redis: ~$3/mes
  - Backend: ~$5-10/mes

### Vercel (Frontend)

- **Hobby Plan:** $0 (gratis)
  - 100GB bandwidth
  - Unlimited deploys
  - Suficiente para MVP

- **Pro Plan:** $20/mes
  - 1TB bandwidth
  - Advanced analytics
  - Password protection

**Total Estimado:** $15-40/mes dependiendo del tráfico

---

## Conclusión

Siguiendo esta guía, tendrás:

- ✅ Backend desplegado en Railway con PostgreSQL y Redis
- ✅ Frontend desplegado en Vercel con CDN global
- ✅ CI/CD automático desde GitHub
- ✅ HTTPS habilitado en ambos
- ✅ WebSockets funcionando
- ✅ Base de datos inicializada con datos de prueba
- ✅ Monitoring y logs configurados

La aplicación está lista para producción y escalar según sea necesario.

Para soporte, contacta: soporte@acplatform.com
