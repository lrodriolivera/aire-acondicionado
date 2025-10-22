import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  mqtt: {
    brokerUrl: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  cors: {
    origin: string;
  };
  smtp?: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://acuser:acpassword123@localhost:5432/ac_management'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  mqtt: {
    brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  }
};

// Add SMTP config if variables are present
if (process.env.SMTP_HOST) {
  config.smtp = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || ''
  };
}

export default config;
