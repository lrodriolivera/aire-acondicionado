import cron from 'node-cron';
import scheduleService from './schedule.service';
import deviceControlService from './device-control.service';
import logger from '../utils/logger';

class SchedulerService {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private statusRefreshTask: cron.ScheduledTask | null = null;

  async start() {
    logger.info('Starting scheduler service...');

    // Cargar todos los schedules habilitados
    await this.loadSchedules();

    // Iniciar tarea periódica de actualización de estados (cada 30 segundos)
    this.startStatusRefreshTask();

    logger.info('Scheduler service started');
  }

  async loadSchedules() {
    try {
      const schedules = await scheduleService.getAll();

      for (const schedule of schedules) {
        if (schedule.enabled && schedule.schedule_config.cron) {
          await this.addSchedule(schedule.id, schedule.schedule_config.cron, async () => {
            await this.executeSchedule(schedule);
          });
        }
      }

      logger.info(`Loaded ${schedules.length} schedules`);
    } catch (error) {
      logger.error('Failed to load schedules:', error);
    }
  }

  private startStatusRefreshTask() {
    // Ejecutar cada 30 segundos
    this.statusRefreshTask = cron.schedule('*/30 * * * * *', async () => {
      try {
        await deviceControlService.refreshAllDeviceStatuses();
      } catch (error) {
        logger.error('Error in status refresh task:', error);
      }
    });

    logger.info('Status refresh task started (every 30 seconds)');
  }

  async addSchedule(scheduleId: string, cronExpression: string, task: () => Promise<void>) {
    try {
      // Eliminar tarea existente si hay
      this.removeSchedule(scheduleId);

      const cronTask = cron.schedule(cronExpression, task);
      this.tasks.set(scheduleId, cronTask);

      logger.info(`Schedule ${scheduleId} added with cron: ${cronExpression}`);
    } catch (error) {
      logger.error(`Failed to add schedule ${scheduleId}:`, error);
    }
  }

  removeSchedule(scheduleId: string) {
    const task = this.tasks.get(scheduleId);
    if (task) {
      task.stop();
      this.tasks.delete(scheduleId);
      logger.info(`Schedule ${scheduleId} removed`);
    }
  }

  private async executeSchedule(schedule: any) {
    try {
      logger.info(`Executing schedule ${schedule.id} for device ${schedule.device_id}`);

      const { action, parameters } = schedule.schedule_config;

      // Ejecutar comando
      await deviceControlService.sendCommand(
        schedule.device_id,
        'system', // Usuario del sistema
        action.type,
        { value: action.value, ...parameters }
      );

      // Actualizar última ejecución
      await scheduleService.updateExecution(schedule.id);

      logger.info(`Schedule ${schedule.id} executed successfully`);
    } catch (error) {
      logger.error(`Failed to execute schedule ${schedule.id}:`, error);
    }
  }

  stop() {
    logger.info('Stopping scheduler service...');

    // Detener todas las tareas
    this.tasks.forEach((task, id) => {
      task.stop();
      logger.debug(`Stopped schedule ${id}`);
    });
    this.tasks.clear();

    // Detener tarea de refresh
    if (this.statusRefreshTask) {
      this.statusRefreshTask.stop();
    }

    logger.info('Scheduler service stopped');
  }
}

export default new SchedulerService();
