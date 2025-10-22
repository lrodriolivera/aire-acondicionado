import database from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { DeviceCommand, CommandType, CommandStatus } from '../types';

export class CommandService {
  async create(deviceId: string, userId: string, commandType: CommandType, parameters: any): Promise<DeviceCommand> {
    const result = await database.query(
      `INSERT INTO device_commands (device_id, user_id, command_type, parameters, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [deviceId, userId, commandType, JSON.stringify(parameters), CommandStatus.PENDING]
    );

    return result.rows[0];
  }

  async getByDevice(deviceId: string, limit: number = 50): Promise<DeviceCommand[]> {
    const result = await database.query(
      `SELECT dc.*, u.full_name as user_name
       FROM device_commands dc
       LEFT JOIN users u ON dc.user_id = u.id
       WHERE dc.device_id = $1
       ORDER BY dc.created_at DESC
       LIMIT $2`,
      [deviceId, limit]
    );

    return result.rows;
  }

  async getById(id: string): Promise<DeviceCommand> {
    const result = await database.query(
      'SELECT * FROM device_commands WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Command not found');
    }

    return result.rows[0];
  }

  async updateStatus(id: string, status: CommandStatus, errorMessage?: string): Promise<void> {
    const fields = ['status = $1', 'executed_at = NOW()'];
    const params: any[] = [status];
    let paramCount = 2;

    if (errorMessage) {
      fields.push(`error_message = $${paramCount++}`);
      params.push(errorMessage);
    }

    params.push(id);

    await database.query(
      `UPDATE device_commands SET ${fields.join(', ')} WHERE id = $${paramCount}`,
      params
    );
  }

  async getPending(): Promise<DeviceCommand[]> {
    const result = await database.query(
      `SELECT * FROM device_commands
       WHERE status = $1
       ORDER BY created_at ASC`,
      [CommandStatus.PENDING]
    );

    return result.rows;
  }
}

export default new CommandService();
