import database from '../config/database';
import { hashPassword } from '../utils/password';
import { ApiError } from '../middleware/errorHandler';
import { User, UserRole } from '../types';

export class UserService {
  async getAll(): Promise<User[]> {
    const result = await database.query(
      'SELECT id, email, full_name, role, is_active, last_login, created_at FROM users ORDER BY full_name ASC'
    );
    return result.rows;
  }

  async getById(id: string): Promise<User> {
    const result = await database.query(
      'SELECT id, email, full_name, role, is_active, last_login, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    return result.rows[0];
  }

  async create(data: {
    email: string;
    password: string;
    full_name: string;
    role: UserRole;
  }): Promise<User> {
    // Verificar si el email ya existe
    const existing = await database.query(
      'SELECT id FROM users WHERE email = $1',
      [data.email]
    );

    if (existing.rows.length > 0) {
      throw ApiError.badRequest('Email already in use');
    }

    const password_hash = await hashPassword(data.password);

    const result = await database.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, is_active, created_at`,
      [data.email, password_hash, data.full_name, data.role]
    );

    return result.rows[0];
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.full_name !== undefined) {
      fields.push(`full_name = $${paramCount++}`);
      values.push(data.full_name);
    }

    if (data.role !== undefined) {
      fields.push(`role = $${paramCount++}`);
      values.push(data.role);
    }

    if (data.is_active !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(data.is_active);
    }

    if (fields.length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    values.push(id);

    const result = await database.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, full_name, role, is_active, created_at`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    return result.rows[0];
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const password_hash = await hashPassword(newPassword);

    await database.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [password_hash, id]
    );
  }

  async delete(id: string): Promise<void> {
    const result = await database.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw ApiError.notFound('User not found');
    }
  }
}

export default new UserService();
