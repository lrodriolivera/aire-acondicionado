# Guía de Despliegue - Plataforma AC Management

Esta guía te ayudará a desplegar la aplicación en **Railway** (backend) y **Firebase Hosting** (frontend).

---

## 📋 Requisitos Previos

- Cuenta de GitHub (para conectar con Railway)
- Cuenta de Google (para Firebase)
- Git instalado
- Node.js instalado localmente (para pruebas)

---

## 🚂 PARTE 1: Desplegar Backend en Railway

### Paso 1: Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"Login"** → **"Login with GitHub"**
3. Autoriza Railway a acceder a tu cuenta de GitHub
4. ¡Listo! Ya tienes cuenta

### Paso 2: Subir tu Código a GitHub

```bash
# Si no tienes repositorio Git, inicialízalo
cd /home/rypcloud/Documentos/Aire_Acondicionado
git init

# Añade todos los archivos
git add .
git commit -m "Initial commit - AC Management Platform"

# Crea un repositorio en GitHub y conecta
# Ve a github.com → New Repository → "aire-acondicionado"
git remote add origin https://github.com/TU-USUARIO/aire-acondicionado.git
git branch -M main
git push -u origin main
```

### Paso 3: Crear Proyecto en Railway

1. En Railway dashboard, click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona tu repositorio `aire-acondicionado`
4. Railway detectará automáticamente tu backend Node.js

### Paso 4: Agregar PostgreSQL

1. En tu proyecto Railway, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway creará automáticamente la base de datos
3. La variable `DATABASE_URL` se agregará automáticamente a tu backend

### Paso 5: Agregar Redis

1. Click **"+ New"** → **"Database"** → **"Add Redis"**
2. Railway creará automáticamente Redis
3. La variable `REDIS_URL` se agregará automáticamente a tu backend

### Paso 6: Configurar Variables de Entorno

1. Click en tu servicio del backend
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=tu-clave-secreta-super-segura-cambiala-ahora
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://tu-dominio.web.app
LOG_LEVEL=info
```

**IMPORTANTE**: Cambia `JWT_SECRET` por una clave aleatoria segura y `CORS_ORIGIN` por tu dominio de Firebase (lo obtendrás en el Paso 11).

### Paso 7: Configurar Root Directory (Importante)

1. En tu servicio backend, ve a **"Settings"**
2. En **"Root Directory"**, establece: `backend`
3. Esto le dice a Railway que el backend está en la carpeta `backend/`

### Paso 8: Deploy

1. Railway desplegará automáticamente tu backend
2. Espera unos minutos (se mostrará el progreso)
3. Una vez completado, verás el estado **"Active"**

### Paso 9: Obtener URL del Backend

1. En tu servicio backend, ve a **"Settings"**
2. Click en **"Generate Domain"**
3. Railway te dará una URL como: `https://tu-app.up.railway.app`
4. **Guarda esta URL**, la necesitarás para el frontend

### Paso 10: Ejecutar Migraciones (Primera vez)

Las tablas se crean automáticamente cuando el backend inicia. Pero si necesitas ejecutar el script de seed para datos de prueba:

1. En Railway, ve a tu servicio backend
2. Click en la pestaña **"Deployments"**
3. Click en el deployment activo
4. Busca los logs para verificar que todo inició correctamente

**Los logs deberían mostrar**:
```
info: Database connected successfully
info: Redis connected successfully
info: Server running on port 3000
```

---

## 🔥 PARTE 2: Desplegar Frontend en Firebase Hosting

### Paso 11: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 12: Login en Firebase

```bash
firebase login
```

Se abrirá tu navegador para autenticarte con Google.

### Paso 13: Crear Proyecto en Firebase Console

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Agregar proyecto"**
3. Nombre: `ac-management` (o el que prefieras)
4. Desactiva Google Analytics (no lo necesitas)
5. Click **"Crear proyecto"**

### Paso 14: Configurar Frontend

```bash
# Ve al directorio del frontend
cd /home/rypcloud/Documentos/Aire_Acondicionado/frontend

# Inicializar Firebase
firebase init hosting
```

**Responde así a las preguntas**:
- **Use an existing project**: Sí
- **Select a project**: Selecciona `ac-management`
- **What do you want to use as your public directory?**: `dist`
- **Configure as a single-page app?**: `Yes`
- **Set up automatic builds with GitHub?**: `No` (por ahora)
- **File dist/index.html already exists. Overwrite?**: `No`

### Paso 15: Actualizar URL del Backend en el Frontend

Necesitas decirle al frontend dónde está tu backend:

```bash
# Edita el archivo de configuración de API
nano src/services/api.ts
```

Busca la línea que dice:
```typescript
baseURL: 'http://localhost:3000/api',
```

Cámbiala por:
```typescript
baseURL: 'https://tu-app.up.railway.app/api',
```

**Usa la URL que obtuviste en el Paso 9**

### Paso 16: Actualizar CORS_ORIGIN en Railway

Ahora que tienes el dominio de Firebase, necesitas actualizarlo en Railway:

1. Firebase te dará un dominio como: `https://ac-management.web.app`
2. Ve a Railway → Variables → Edita `CORS_ORIGIN`
3. Establece: `https://ac-management.web.app` (tu dominio de Firebase)
4. Railway re-desplegará automáticamente

### Paso 17: Build y Deploy del Frontend

```bash
# Asegúrate de estar en /frontend
cd /home/rypcloud/Documentos/Aire_Acondicionado/frontend

# Build de producción
npm run build

# Deploy a Firebase
firebase deploy --only hosting
```

### Paso 18: ¡Listo! 🎉

Firebase te mostrará URLs como:
```
✔  Deploy complete!

Hosting URL: https://ac-management.web.app
```

**¡Tu aplicación está en vivo!**

---

## 🔧 Comandos Útiles

### Re-desplegar Frontend (después de cambios)

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Re-desplegar Backend (después de cambios)

```bash
# Solo haz commit y push a GitHub
git add .
git commit -m "Actualización del backend"
git push

# Railway desplegará automáticamente
```

### Ver Logs del Backend

1. Ve a Railway dashboard
2. Click en tu servicio backend
3. Pestaña **"Deployments"** → Click en el deployment activo
4. Verás los logs en tiempo real

---

## ⚠️ Problemas Comunes

### Error: CORS en el Frontend

**Solución**: Verifica que `CORS_ORIGIN` en Railway tenga tu dominio correcto de Firebase.

### Error: Cannot connect to database

**Solución**: Verifica que PostgreSQL esté agregado y que `DATABASE_URL` exista en Variables.

### Error: Cannot connect to Redis

**Solución**: Verifica que Redis esté agregado y que `REDIS_URL` exista en Variables.

### Frontend no se conecta al Backend

**Solución**:
1. Verifica que la URL en `src/services/api.ts` sea correcta
2. Haz un nuevo build: `npm run build`
3. Re-despliega: `firebase deploy --only hosting`

---

## 💰 Costos

### Railway (Plan Gratuito)
- **$5 USD de crédito mensual** gratis
- Suficiente para desarrollo y aplicaciones pequeñas
- Si necesitas más, planes desde $5/mes

### Firebase Hosting (Plan Gratuito)
- **10 GB de almacenamiento**
- **360 MB/día de transferencia**
- Más que suficiente para empezar

---

## 🔐 Seguridad Post-Deploy

### 1. Cambiar JWT_SECRET

```bash
# Genera un secreto aleatorio
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copia el resultado y actualiza JWT_SECRET en Railway
```

### 2. Crear Usuario Admin

Una vez desplegado, necesitas crear tu primer usuario admin manualmente en la base de datos.

**Opción A: Desde Railway CLI**

```bash
# Instala Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conecta a tu proyecto
railway link

# Abre consola de PostgreSQL
railway run psql $DATABASE_URL
```

Luego ejecuta:
```sql
-- El password hasheado es "admin123" - CÁMBIALO DESPUÉS
INSERT INTO users (id, email, password, full_name, role, is_active)
VALUES (
  uuid_generate_v4(),
  'admin@tuempresa.com',
  '$2b$10$rVP8Y.qn0L.0qzJGZQ6iSO7d8kB3YL/mXz1z1tJKq5.K8gRVGLDQi',
  'Administrador',
  'super_admin',
  true
);
```

**IMPORTANTE**: Inicia sesión y cambia la contraseña inmediatamente desde la interfaz.

---

## 🚀 Siguientes Pasos

1. **Configurar un dominio custom** (opcional)
   - Firebase: Settings → Hosting → Add custom domain
   - Railway: Settings → Domains → Custom Domain

2. **Configurar backups automáticos** (Railway)
   - Railway hace backups automáticos de PostgreSQL

3. **Monitoreo**
   - Railway tiene métricas integradas
   - Firebase Analytics (si lo necesitas)

4. **CI/CD Avanzado**
   - Configurar GitHub Actions para tests automáticos
   - Deploy automático en cada push a main

---

## 📞 Soporte

Si tienes problemas:

1. **Railway Docs**: [docs.railway.app](https://docs.railway.app)
2. **Firebase Docs**: [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)
3. **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)

---

**¡Éxito con tu deploy!** 🎉

---

**Fecha de creación**: 2025-10-22
**Versión**: 1.0
**Plataforma**: AC Management Platform
