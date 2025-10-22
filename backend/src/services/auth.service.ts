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

  async getProfile(userId: string): Promise<User> {
    const result = await database.query(
      'SELECT id, email, full_name, role, is_active, last_login, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    return result.rows[0];
  }
}

export default new AuthService();
