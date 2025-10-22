import database from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { Device } from '../types';

export class DeviceService {
  async getAll(filters?: {
    location_id?: string;
    status?: string;
    model_id?: string;
  }): Promise<any[]> {
    let query = `
      SELECT
        d.*,
        m.name as model_name,
        m.protocol_type,
        b.name as brand_name,
        l.name as location_name,
        ds.temperature,
        ds.target_temperature,
        ds.humidity,
        ds.mode,
        ds.fan_speed,
        ds.power_state,
        ds.is_online,
        ds.timestamp as status_timestamp
      FROM devices d
      LEFT JOIN models m ON d.model_id = m.id
      LEFT JOIN brands b ON m.brand_id = b.id
      LEFT JOIN locations l ON d.location_id = l.id
      LEFT JOIN device_status ds ON d.id = ds.device_id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.location_id) {
      conditions.push(`d.location_id = $${paramCount++}`);
      params.push(filters.location_id);
    }

    if (filters?.status) {
      conditions.push(`d.status = $${paramCount++}`);
      params.push(filters.status);
    }

    if (filters?.model_id) {
      conditions.push(`d.model_id = $${paramCount++}`);
      params.push(filters.model_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY d.name ASC';

    const result = await database.query(query, params);
    return result.rows;
  }

  async getById(id: string): Promise<any> {
    const result = await database.query(
      `SELECT
        d.*,
        m.name as model_name,
        m.protocol_type,
        m.connection_config,
        m.capabilities,
        m.min_temperature,
        m.max_temperature,
        b.name as brand_name,
        l.name as location_name,
        ds.temperature,
        ds.target_temperature,
        ds.humidity,
        ds.mode,
        ds.fan_speed,
        ds.power_state,
        ds.is_online,
        ds.error_code,
        ds.timestamp as status_timestamp
      FROM devices d
      LEFT JOIN models m ON d.model_id = m.id
      LEFT JOIN brands b ON m.brand_id = b.id
      LEFT JOIN locations l ON d.location_id = l.id
      LEFT JOIN device_status ds ON d.id = ds.device_id
      WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Device not found');
    }

    return result.rows[0];
  }

  async create(data: {
    model_id: string;
    location_id?: string;
    serial_number: string;
    name: string;
    ip_address?: string;
    mqtt_topic?: string;
    config?: any;
  }): Promise<Device> {
    const result = await database.query(
      `INSERT INTO devices (
        model_id, location_id, serial_number, name, ip_address, mqtt_topic, config
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.model_id,
        data.location_id,
        data.serial_number,
        data.name,
        data.ip_address,
        data.mqtt_topic,
        JSON.stringify(data.config || {})
      ]
    );

    // Crear estado inicial del dispositivo
    await database.query(
      `INSERT INTO device_status (device_id, power_state, is_online)
       VALUES ($1, false, false)`,
      [result.rows[0].id]
    );

    return result.rows[0];
  }

  async update(id: string, data: Partial<Device>): Promise<Device> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.location_id !== undefined) {
      fields.push(`location_id = $${paramCount++}`);
      values.push(data.location_id);
    }
    if (data.ip_address !== undefined) {
      fields.push(`ip_address = $${paramCount++}`);
      values.push(data.ip_address);
    }
    if (data.mqtt_topic !== undefined) {
      fields.push(`mqtt_topic = $${paramCount++}`);
      values.push(data.mqtt_topic);
    }
    if (data.config !== undefined) {
      fields.push(`config = $${paramCount++}`);
      values.push(JSON.stringify(data.config));
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    if (fields.length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    values.push(id);

    const result = await database.query(
      `UPDATE devices SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Device not found');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await database.query(
      'DELETE FROM devices WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw ApiError.notFound('Device not found');
    }
  }

  async updateStatus(deviceId: string, status: {
    temperature?: number;
    target_temperature?: number;
    humidity?: number;
    mode?: string;
    fan_speed?: string;
    power_state?: boolean;
    is_online?: boolean;
    error_code?: string;
  }): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (status.temperature !== undefined) {
      fields.push(`temperature = $${paramCount++}`);
      values.push(status.temperature);
    }
    if (status.target_temperature !== undefined) {
      fields.push(`target_temperature = $${paramCount++}`);
      values.push(status.target_temperature);
    }
    if (status.humidity !== undefined) {
      fields.push(`humidity = $${paramCount++}`);
      values.push(status.humidity);
    }
    if (status.mode !== undefined) {
      fields.push(`mode = $${paramCount++}`);
      values.push(status.mode);
    }
    if (status.fan_speed !== undefined) {
      fields.push(`fan_speed = $${paramCount++}`);
      values.push(status.fan_speed);
    }
    if (status.power_state !== undefined) {
      fields.push(`power_state = $${paramCount++}`);
      values.push(status.power_state);
    }
    if (status.is_online !== undefined) {
      fields.push(`is_online = $${paramCount++}`);
      values.push(status.is_online);
    }
    if (status.error_code !== undefined) {
      fields.push(`error_code = $${paramCount++}`);
      values.push(status.error_code);
    }

    fields.push(`timestamp = NOW()`);
    values.push(deviceId);

    await database.query(
      `UPDATE device_status SET ${fields.join(', ')} WHERE device_id = $${paramCount}`,
      values
    );

    // Actualizar last_seen en devices
    await database.query(
      'UPDATE devices SET last_seen = NOW() WHERE id = $1',
      [deviceId]
    );
  }

  async getStats(): Promise<any> {
    const result = await database.query(`
      SELECT
        COUNT(*) as total_devices,
        COUNT(CASE WHEN status = 'online' THEN 1 END) as online_devices,
        COUNT(CASE WHEN status = 'offline' THEN 1 END) as offline_devices,
        COUNT(CASE WHEN status = 'error' THEN 1 END) as error_devices
      FROM devices
    `);

    return result.rows[0];
  }
}

export default new DeviceService();
