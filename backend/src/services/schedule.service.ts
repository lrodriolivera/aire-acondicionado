import database from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { Schedule } from '../types';

export class ScheduleService {
  async getAll(deviceId?: string): Promise<Schedule[]> {
    let query = `
      SELECT s.*, d.name as device_name
      FROM schedules s
      LEFT JOIN devices d ON s.device_id = d.id
    `;

    const params: any[] = [];

    if (deviceId) {
      query += ' WHERE s.device_id = $1';
      params.push(deviceId);
    }

    query += ' ORDER BY s.next_execution ASC NULLS LAST';

    const result = await database.query(query, params);
    return result.rows;
  }

  async getById(id: string): Promise<Schedule> {
    const result = await database.query(
      `SELECT s.*, d.name as device_name
       FROM schedules s
       LEFT JOIN devices d ON s.device_id = d.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Schedule not found');
    }

    return result.rows[0];
  }

  async create(data: {
    device_id: string;
    name: string;
    enabled?: boolean;
    schedule_type: string;
    schedule_config: any;
  }): Promise<Schedule> {
    const result = await database.query(
      `INSERT INTO schedules (device_id, name, enabled, schedule_type, schedule_config)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.device_id,
        data.name,
        data.enabled !== undefined ? data.enabled : true,
        data.schedule_type,
        JSON.stringify(data.schedule_config)
      ]
    );

    return result.rows[0];
  }

  async update(id: string, data: Partial<Schedule>): Promise<Schedule> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }

    if (data.enabled !== undefined) {
      fields.push(`enabled = $${paramCount++}`);
      values.push(data.enabled);
    }

    if (data.schedule_config !== undefined) {
      fields.push(`schedule_config = $${paramCount++}`);
      values.push(JSON.stringify(data.schedule_config));
    }

    if (fields.length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    values.push(id);

    const result = await database.query(
      `UPDATE schedules SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Schedule not found');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await database.query(
      'DELETE FROM schedules WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw ApiError.notFound('Schedule not found');
    }
  }

  async updateExecution(id: string, nextExecution?: Date): Promise<void> {
    await database.query(
      'UPDATE schedules SET last_executed = NOW(), next_execution = $1 WHERE id = $2',
      [nextExecution, id]
    );
  }

  async getUpcoming(limit: number = 100): Promise<Schedule[]> {
    const result = await database.query(
      `SELECT s.*, d.name as device_name, d.id as device_id
       FROM schedules s
       LEFT JOIN devices d ON s.device_id = d.id
       WHERE s.enabled = true
         AND s.next_execution IS NOT NULL
         AND s.next_execution <= NOW() + INTERVAL '1 hour'
       ORDER BY s.next_execution ASC
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  }
}

export default new ScheduleService();
