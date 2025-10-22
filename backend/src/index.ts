import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import logger from './utils/logger';
import database from './config/database';
import redis from './config/redis';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import socketService from './services/socket.service';
import schedulerService from './services/scheduler.service';
import { AdapterFactory } from './adapters/AdapterFactory';

// Import routes
import authRoutes from './routes/auth.routes';
import brandRoutes from './routes/brand.routes';
import modelRoutes from './routes/model.routes';
import deviceRoutes from './routes/device.routes';
import locationRoutes from './routes/location.routes';
import commandRoutes from './routes/command.routes';
import alertRoutes from './routes/alert.routes';
import scheduleRoutes from './routes/schedule.routes';
import userRoutes from './routes/user.routes';
import telemetryRoutes from './routes/telemetry.routes';
import deviceControlRoutes from './routes/device-control.routes';

class App {
  public app: Application;
  public server: ReturnType<typeof createServer>;
  public io: Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: config.cors.origin,
        methods: ['GET', 'POST']
      }
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeWebSocket();
    this.initializeErrorHandlers();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true
    }));

    // Body parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    if (config.env === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Health check
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  private initializeRoutes(): void {
    const apiPrefix = '/api';

    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/brands`, brandRoutes);
    this.app.use(`${apiPrefix}/models`, modelRoutes);
    this.app.use(`${apiPrefix}/devices`, deviceRoutes);
    this.app.use(`${apiPrefix}/locations`, locationRoutes);
    this.app.use(`${apiPrefix}/commands`, commandRoutes);
    this.app.use(`${apiPrefix}/alerts`, alertRoutes);
    this.app.use(`${apiPrefix}/schedules`, scheduleRoutes);
    this.app.use(`${apiPrefix}/users`, userRoutes);
    this.app.use(`${apiPrefix}/telemetry`, telemetryRoutes);
    this.app.use(`${apiPrefix}/control`, deviceControlRoutes);
  }

  private initializeWebSocket(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      socket.on('subscribe:device', (deviceId: string) => {
        socket.join(`device:${deviceId}`);
        logger.debug(`Socket ${socket.id} subscribed to device ${deviceId}`);
      });

      socket.on('unsubscribe:device', (deviceId: string) => {
        socket.leave(`device:${deviceId}`);
        logger.debug(`Socket ${socket.id} unsubscribed from device ${deviceId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });

    // Initialize socket service
    socketService.initialize(this.io);

    // Make io available globally
    (global as any).io = this.io;
  }

  private initializeErrorHandlers(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private async connectWithRetry(
    name: string,
    connectFn: () => Promise<void>,
    maxRetries: number = 5,
    delayMs: number = 3000
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await connectFn();
        logger.info(`${name} connected successfully`);
        return;
      } catch (error) {
        logger.warn(`${name} connection attempt ${attempt}/${maxRetries} failed:`, error);
        if (attempt === maxRetries) {
          throw new Error(`Failed to connect to ${name} after ${maxRetries} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  public async start(): Promise<void> {
    try {
      // Test database connection with retries
      await this.connectWithRetry('Database', async () => {
        await database.query('SELECT NOW()');
      });

      // Connect to Redis with retries
      await this.connectWithRetry('Redis', async () => {
        await redis.connect();
      });

      // Start scheduler service
      await schedulerService.start();

      // Start server
      this.server.listen(config.port, () => {
        logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down server...');

    // Stop scheduler
    schedulerService.stop();

    // Disconnect all device adapters
    await AdapterFactory.disconnectAll();

    // Close database connection
    await database.close();

    // Close Redis connection
    await redis.close();

    // Close server
    this.server.close(() => {
      logger.info('Server shut down successfully');
      process.exit(0);
    });
  }
}

// Initialize app
const app = new App();

// Start server
app.start();

// Graceful shutdown
process.on('SIGTERM', () => app.shutdown());
process.on('SIGINT', () => app.shutdown());

export default app;
