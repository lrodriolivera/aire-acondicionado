import database from '../config/database';

export class TelemetryService {
  async store(deviceId: string, data: {
    temperature?: number;
    humidity?: number;
    power_consumption?: number;
    mode?: string;
    fan_speed?: string;
    power_state: boolean;
  }): Promise<void> {
    await database.query(
      `INSERT INTO device_telemetry (
        device_id, temperature, humidity, power_consumption, mode, fan_speed, power_state
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        deviceId,
        data.temperature,
        data.humidity,
        data.power_consumption,
        data.mode,
        data.fan_speed,
        data.power_state
      ]
    );
  }

  async getByDevice(
    deviceId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 1000
  ): Promise<any[]> {
    const result = await database.query(
      `SELECT *
       FROM device_telemetry
       WHERE device_id = $1
         AND timestamp >= $2
         AND timestamp <= $3
       ORDER BY timestamp DESC
       LIMIT $4`,
      [deviceId, startDate, endDate, limit]
    );

    return result.rows;
  }

  async getLatest(deviceId: string, limit: number = 100): Promise<any[]> {
    const result = await database.query(
      `SELECT *
       FROM device_telemetry
       WHERE device_id = $1
       ORDER BY timestamp DESC
       LIMIT $2`,
      [deviceId, limit]
    );

    return result.rows;
  }

  async getAggregated(
    deviceId: string,
    startDate: Date,
    endDate: Date,
    interval: 'hour' | 'day' = 'hour'
  ): Promise<any[]> {
    const truncate = interval === 'hour' ? 'hour' : 'day';

    const result = await database.query(
      `SELECT
        date_trunc($4, timestamp) as time_bucket,
        AVG(temperature) as avg_temperature,
        MIN(temperature) as min_temperature,
        MAX(temperature) as max_temperature,
        AVG(humidity) as avg_humidity,
        SUM(power_consumption) as total_consumption
       FROM device_telemetry
       WHERE device_id = $1
         AND timestamp >= $2
         AND timestamp <= $3
       GROUP BY time_bucket
       ORDER BY time_bucket ASC`,
      [deviceId, startDate, endDate, truncate]
    );

    return result.rows;
  }

  async getConsumptionStats(deviceId: string, days: number = 30): Promise<any> {
    const result = await database.query(
      `SELECT
        SUM(power_consumption) as total_consumption,
        AVG(power_consumption) as avg_consumption,
        MAX(power_consumption) as max_consumption
       FROM device_telemetry
       WHERE device_id = $1
         AND timestamp >= NOW() - INTERVAL '${days} days'`,
      [deviceId]
    );

    return result.rows[0];
  }
}

export default new TelemetryService();
