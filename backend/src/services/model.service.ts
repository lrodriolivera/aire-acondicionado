import database from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { Model } from '../types';

export class ModelService {
  async getAll(brandId?: string): Promise<Model[]> {
    let query = `
      SELECT m.*, b.name as brand_name
      FROM models m
      LEFT JOIN brands b ON m.brand_id = b.id
    `;
    const params: any[] = [];

    if (brandId) {
      query += ' WHERE m.brand_id = $1';
      params.push(brandId);
    }

    query += ' ORDER BY b.name, m.name';

    const result = await database.query(query, params);
    return result.rows;
  }

  async getById(id: string): Promise<Model> {
    const result = await database.query(
      `SELECT m.*, b.name as brand_name
       FROM models m
       LEFT JOIN brands b ON m.brand_id = b.id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Model not found');
    }

    return result.rows[0];
  }

  async create(data: {
    brand_id: string;
    name: string;
    protocol_type: string;
    connection_config?: any;
    capabilities?: any;
    min_temperature?: number;
    max_temperature?: number;
  }): Promise<Model> {
    const result = await database.query(
      `INSERT INTO models (
        brand_id, name, protocol_type, connection_config, capabilities,
        min_temperature, max_temperature
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.brand_id,
        data.name,
        data.protocol_type,
        JSON.stringify(data.connection_config || {}),
        JSON.stringify(data.capabilities || {}),
        data.min_temperature || 16,
        data.max_temperature || 30
      ]
    );

    return result.rows[0];
  }

  async update(id: string, data: Partial<Model>): Promise<Model> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.protocol_type !== undefined) {
      fields.push(`protocol_type = $${paramCount++}`);
      values.push(data.protocol_type);
    }
    if (data.connection_config !== undefined) {
      fields.push(`connection_config = $${paramCount++}`);
      values.push(JSON.stringify(data.connection_config));
    }
    if (data.capabilities !== undefined) {
      fields.push(`capabilities = $${paramCount++}`);
      values.push(JSON.stringify(data.capabilities));
    }
    if (data.min_temperature !== undefined) {
      fields.push(`min_temperature = $${paramCount++}`);
      values.push(data.min_temperature);
    }
    if (data.max_temperature !== undefined) {
      fields.push(`max_temperature = $${paramCount++}`);
      values.push(data.max_temperature);
    }

    if (fields.length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    values.push(id);

    const result = await database.query(
      `UPDATE models SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Model not found');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await database.query(
      'DELETE FROM models WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw ApiError.notFound('Model not found');
    }
  }
}

export default new ModelService();
