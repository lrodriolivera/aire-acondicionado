# 🚀 Inicio Rápido - Deploy en 15 Minutos

Sigue estos pasos para desplegar tu aplicación rápidamente.

## ✅ Checklist Pre-Deploy

- [ ] Tienes cuenta de GitHub
- [ ] Tu código está listo localmente
- [ ] Backend funciona en local (puerto 3000)
- [ ] Frontend funciona en local (puerto 5173)

---

## 📦 PASO 1: Subir a GitHub (5 min)

```bash
cd /home/rypcloud/Documentos/Aire_Acondicionado

# Inicializar Git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit - AC Management Platform"

# Crear repo en GitHub y subir
# Ve a: github.com → New Repository → "aire-acondicionado"
git remote add origin https://github.com/TU-USUARIO/aire-acondicionado.git
git branch -M main
git push -u origin main
```

---

## 🚂 PASO 2: Railway - Backend (5 min)

### 2.1 Crear Cuenta
1. Ve a [railway.app](https://railway.app)
2. **Login with GitHub**

### 2.2 Nuevo Proyecto
1. **New Project** → **Deploy from GitHub repo**
2. Selecciona: `aire-acondicionado`

### 2.3 Agregar Bases de Datos
1. **+ New** → **Database** → **PostgreSQL**
2. **+ New** → **Database** → **Redis**

### 2.4 Configurar Backend
1. Click en el servicio del backend
2. **Settings** → **Root Directory**: `backend`
3. **Variables** → Agregar:
   ```
   NODE_ENV=production
   JWT_SECRET=cambia-esto-por-algo-aleatorio-y-seguro
   CORS_ORIGIN=https://tu-proyecto.web.app
   ```
4. **Settings** → **Generate Domain**
5. **Copia la URL** (ejemplo: https://tu-app.up.railway.app)

---

## 🔥 PASO 3: Firebase - Frontend (5 min)

### 3.1 Instalar CLI
```bash
npm install -g firebase-tools
firebase login
```

### 3.2 Crear Proyecto
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. **Agregar proyecto** → Nombre: `ac-management`

### 3.3 Configurar
```bash
cd frontend
firebase init hosting
```
Respuestas:
- Proyecto: Selecciona `ac-management`
- Public directory: `dist`
- Single-page app: `Yes`
- Overwrite index.html: `No`

### 3.4 Actualizar URL del Backend
Edita `frontend/src/services/api.ts`:
```typescript
baseURL: 'https://tu-app.up.railway.app/api',  // URL de Railway
```

### 3.5 Deploy
```bash
npm run build
firebase deploy --only hosting
```

### 3.6 Actualizar CORS
1. Firebase te dará: `https://ac-management.web.app`
2. Ve a Railway → Variables → Edita `CORS_ORIGIN`
3. Establece tu URL de Firebase

---

## 🎉 ¡LISTO!

Tu aplicación está desplegada:
- **Backend**: https://tu-app.up.railway.app
- **Frontend**: https://ac-management.web.app

---

## 🔐 Crear Usuario Admin

Necesitas crear tu primer usuario manualmente:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Conectar
railway login
railway link

# Abrir PostgreSQL
railway run psql $DATABASE_URL
```

En PostgreSQL:
```sql
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

**Login**: admin@tuempresa.com / admin123 (¡cámbialo después!)

---

## 🔄 Re-Desplegar

### Backend
```bash
git add .
git commit -m "Actualización"
git push
# Railway desplegará automáticamente
```

### Frontend
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

---

## 📚 Documentación Completa

Para más detalles, consulta: `GUIA_DEPLOY.md`

---

**¡Éxito! 🚀**
