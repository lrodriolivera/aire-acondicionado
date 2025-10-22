import database from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { Location } from '../types';

export class LocationService {
  async getAll(): Promise<Location[]> {
    const result = await database.query(
      'SELECT * FROM locations ORDER BY name ASC'
    );
    return result.rows;
  }

  async getById(id: string): Promise<Location> {
    const result = await database.query(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Location not found');
    }

    return result.rows[0];
  }

  async getTree(): Promise<any[]> {
    // Obtener todas las ubicaciones
    const result = await database.query(
      'SELECT * FROM locations ORDER BY name ASC'
    );

    const locations = result.rows;

    // Construir árbol jerárquico
    const buildTree = (parentId: string | null = null): any[] => {
      return locations
        .filter(loc => loc.parent_id === parentId)
        .map(loc => ({
          ...loc,
          children: buildTree(loc.id)
        }));
    };

    return buildTree(null);
  }

  async create(data: {
    name: string;
    parent_id?: string;
    type: string;
    description?: string;
  }): Promise<Location> {
    const result = await database.query(
      `INSERT INTO locations (name, parent_id, type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.parent_id, data.type, data.description]
    );

    return result.rows[0];
  }

  async update(id: string, data: Partial<Location>): Promise<Location> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.parent_id !== undefined) {
      fields.push(`parent_id = $${paramCount++}`);
      values.push(data.parent_id);
    }
    if (data.type !== undefined) {
      fields.push(`type = $${paramCount++}`);
      values.push(data.type);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    if (fields.length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    values.push(id);

    const result = await database.query(
      `UPDATE locations SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Location not found');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await database.query(
      'DELETE FROM locations WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw ApiError.notFound('Location not found');
    }
  }
}

export default new LocationService();
