# Guía de Inicio Rápido

## 🚀 Primeros Pasos

### 1. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 2. Iniciar Base de Datos y Servicios

```bash
# Desde la raíz del proyecto
docker-compose up -d postgres redis mosquitto
```

Esto iniciará:
- PostgreSQL en puerto 5432
- Redis en puerto 6379
- MQTT Broker en puerto 1883

La base de datos se inicializará automáticamente con el schema completo.

### 3. Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en http://localhost:3000

### 4. Iniciar el Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en http://localhost:5173

---

## ✅ Verificar que Todo Funciona

### Base de Datos
```bash
# Conectar a PostgreSQL
docker exec -it ac-postgres psql -U acuser -d ac_management

# Ver tablas
\dt

# Ver marcas precargadas
SELECT * FROM brands;
```

### Backend
Abrir en el navegador: http://localhost:3000/health

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2025-10-22T..."
}
```

### MQTT
```bash
# Subscribirse a todos los topics (para testing)
docker exec -it ac-mqtt mosquitto_sub -h localhost -t '#' -v
```

---

## 🔨 Próximo Paso: Implementar Autenticación

### Backend

#### 1. Crear el Service de Autenticación

Crear `backend/src/services/auth.service.ts`:

```typescript
import database from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens } from '../utils/jwt';
import { ApiError } from '../middleware/errorHandler';
import { User, UserRole, AuthTokens } from '../types';

export class AuthService {
  async register(email: string, password: string, full_name: string): Promise<{ user: User; tokens: AuthTokens }> {
    // Verificar si el usuario ya existe
    const existing = await database.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      throw ApiError.badRequest('Email already registered');
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Crear usuario
    const result = await database.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, is_active, created_at`,
      [email, password_hash, full_name, UserRole.VIEWER]
    );

    const user = result.rows[0];

    // Generar tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Guardar refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await database.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokens.refreshToken, expiresAt]
    );

    return { user, tokens };
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    // Buscar usuario
    const result = await database.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const user = result.rows[0];

    // Verificar password
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Generar tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Guardar refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await database.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokens.refreshToken, expiresAt]
    );

    // Actualizar last_login
    await database.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Remover password_hash de la respuesta
    delete user.password_hash;

    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const result = await database.query(
      `SELECT rt.*, u.id, u.email, u.role
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
       WHERE rt.token = $1 AND rt.expires_at > NOW()`,
      [refreshToken]
    );

    if (result.rows.length === 0) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const { id, email, role } = result.rows[0];

    // Generar nuevos tokens
    const tokens = generateTokens({
      userId: id,
      email,
      role
    });

    // Eliminar el token viejo
    await database.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);

    // Guardar el nuevo refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await database.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [id, tokens.refreshToken, expiresAt]
    );

    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    await database.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  }
}

export default new AuthService();
```

#### 2. Crear el Controller

Crear `backend/src/controllers/auth.controller.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { z } from 'zod';

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(2)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, full_name } = req.body;
      const result = await authService.register(email, password, full_name);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
```

#### 3. Crear las Routes

Crear `backend/src/routes/auth.routes.ts`:

```typescript
import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authLimiter, authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
```

### Frontend

#### 1. Crear Página de Login

Crear `frontend/src/pages/Login.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('admin@acplatform.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, tokens } = await authService.login({ email, password });
      setAuth(user, tokens);
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          AC Management Platform
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

#### 2. Crear PrivateRoute

Crear `frontend/src/components/PrivateRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

#### 3. Crear Layout Básico

Crear `frontend/src/components/Layout.tsx`:

```typescript
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">AC Platform</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/devices"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dispositivos
                </Link>
                <Link
                  to="/alerts"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Alertas
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">{user?.full_name}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
```

#### 4. Crear Dashboard Temporal

Crear `frontend/src/pages/Dashboard.tsx`:

```typescript
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">
          Bienvenido a la Plataforma de Gestión de Aires Acondicionados
        </p>
      </div>
    </div>
  );
}
```

#### 5. Crear páginas temporales vacías

Crear archivos vacíos (temporales) en `frontend/src/pages/`:
- `Devices.tsx`
- `DeviceDetail.tsx`
- `Brands.tsx`
- `Models.tsx`
- `Locations.tsx`
- `Alerts.tsx`
- `Schedules.tsx`
- `Users.tsx`
- `Reports.tsx`
- `Settings.tsx`

Contenido temporal para cada uno:
```typescript
export default function [NombrePagina]() {
  return (
    <div>
      <h1 className="text-2xl font-bold">[Nombre Página]</h1>
      <p>En desarrollo...</p>
    </div>
  );
}
```

---

## 🧪 Probar la Autenticación

1. Iniciar backend y frontend
2. Ir a http://localhost:5173
3. Usar credenciales:
   - Email: `admin@acplatform.com`
   - Password: `admin123`
4. Deberías ser redirigido al Dashboard

---

## 📝 Siguiente: Implementar CRUD de Dispositivos

Una vez que la autenticación funcione, el siguiente paso sería:

1. Crear el service de devices en el backend
2. Crear los controladores y routes
3. Crear la página de lista de dispositivos
4. Crear formularios de crear/editar dispositivo
5. Integrar con el adaptador MQTT genérico

Revisa `PROYECTO_RESUMEN.md` para más detalles sobre la estructura completa.
