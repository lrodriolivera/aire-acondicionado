import database from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { Brand } from '../types';

export class BrandService {
  async getAll(): Promise<Brand[]> {
    const result = await database.query(
      'SELECT * FROM brands ORDER BY name ASC'
    );
    return result.rows;
  }

  async getById(id: string): Promise<Brand> {
    const result = await database.query(
      'SELECT * FROM brands WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Brand not found');
    }

    return result.rows[0];
  }

  async create(data: { name: string; logo_url?: string; website?: string }): Promise<Brand> {
    const result = await database.query(
      `INSERT INTO brands (name, logo_url, website)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name, data.logo_url, data.website]
    );

    return result.rows[0];
  }

  async update(id: string, data: Partial<Brand>): Promise<Brand> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.logo_url !== undefined) {
      fields.push(`logo_url = $${paramCount++}`);
      values.push(data.logo_url);
    }
    if (data.website !== undefined) {
      fields.push(`website = $${paramCount++}`);
      values.push(data.website);
    }

    if (fields.length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    values.push(id);

    const result = await database.query(
      `UPDATE brands SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Brand not found');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await database.query(
      'DELETE FROM brands WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw ApiError.notFound('Brand not found');
    }
  }
}

export default new BrandService();
