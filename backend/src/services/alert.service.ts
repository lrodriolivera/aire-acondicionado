import database from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { Alert, AlertType, AlertSeverity } from '../types';

export class AlertService {
  async getAll(filters?: {
    deviceId?: string;
    severity?: AlertSeverity;
    acknowledged?: boolean;
    resolved?: boolean;
  }): Promise<Alert[]> {
    let query = `
      SELECT a.*, d.name as device_name
      FROM alerts a
      LEFT JOIN devices d ON a.device_id = d.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.deviceId) {
      conditions.push(`a.device_id = $${paramCount++}`);
      params.push(filters.deviceId);
    }

    if (filters?.severity) {
      conditions.push(`a.severity = $${paramCount++}`);
      params.push(filters.severity);
    }

    if (filters?.acknowledged !== undefined) {
      conditions.push(`a.acknowledged = $${paramCount++}`);
      params.push(filters.acknowledged);
    }

    if (filters?.resolved !== undefined) {
      conditions.push(`a.resolved = $${paramCount++}`);
      params.push(filters.resolved);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.created_at DESC';

    const result = await database.query(query, params);
    return result.rows;
  }

  async getById(id: string): Promise<Alert> {
    const result = await database.query(
      `SELECT a.*, d.name as device_name
       FROM alerts a
       LEFT JOIN devices d ON a.device_id = d.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Alert not found');
    }

    return result.rows[0];
  }

  async create(data: {
    device_id: string;
    alert_type: AlertType;
    severity: AlertSeverity;
    message: string;
    metadata?: any;
  }): Promise<Alert> {
    const result = await database.query(
      `INSERT INTO alerts (device_id, alert_type, severity, message, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.device_id,
        data.alert_type,
        data.severity,
        data.message,
        JSON.stringify(data.metadata || {})
      ]
    );

    return result.rows[0];
  }

  async acknowledge(id: string, userId: string): Promise<Alert> {
    const result = await database.query(
      `UPDATE alerts
       SET acknowledged = true, acknowledged_by = $1, acknowledged_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [userId, id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Alert not found');
    }

    return result.rows[0];
  }

  async resolve(id: string): Promise<Alert> {
    const result = await database.query(
      `UPDATE alerts
       SET resolved = true, resolved_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Alert not found');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await database.query(
      'DELETE FROM alerts WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw ApiError.notFound('Alert not found');
    }
  }

  async getStats(): Promise<any> {
    const result = await database.query(`
      SELECT
        COUNT(*) as total_alerts,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_alerts,
        COUNT(CASE WHEN severity = 'warning' THEN 1 END) as warning_alerts,
        COUNT(CASE WHEN severity = 'info' THEN 1 END) as info_alerts,
        COUNT(CASE WHEN acknowledged = false THEN 1 END) as unacknowledged_alerts,
        COUNT(CASE WHEN resolved = false THEN 1 END) as unresolved_alerts
      FROM alerts
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    return result.rows[0];
  }
}

export default new AlertService();
