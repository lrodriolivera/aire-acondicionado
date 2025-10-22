-- Inicialización de la Base de Datos
-- Plataforma de Gestión de Aires Acondicionados

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de Marcas
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Modelos
CREATE TABLE IF NOT EXISTS models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    protocol_type VARCHAR(50) NOT NULL, -- MQTT, HTTP, Modbus, BACnet
    connection_config JSONB, -- Configuración específica del protocolo
    capabilities JSONB, -- {hasHumidity, hasTimer, hasFanSpeed, etc}
    min_temperature DECIMAL(4,1) DEFAULT 16.0,
    max_temperature DECIMAL(4,1) DEFAULT 30.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_brand_model UNIQUE (brand_id, name)
);

-- Tabla de Ubicaciones (jerárquica)
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    type VARCHAR(50), -- building, floor, room, zone
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Dispositivos
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES models(id) ON DELETE RESTRICT,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    ip_address INET,
    mqtt_topic VARCHAR(200),
    status VARCHAR(50) DEFAULT 'offline', -- online, offline, error
    last_seen TIMESTAMP,
    config JSONB, -- Configuración específica del dispositivo
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para devices
CREATE INDEX idx_devices_model ON devices(model_id);
CREATE INDEX idx_devices_location ON devices(location_id);
CREATE INDEX idx_devices_status ON devices(status);

-- Tabla de Estado en Tiempo Real
CREATE TABLE IF NOT EXISTS device_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    temperature DECIMAL(4,1),
    target_temperature DECIMAL(4,1),
    humidity DECIMAL(4,1),
    mode VARCHAR(50), -- cool, heat, fan, dry, auto
    fan_speed VARCHAR(50), -- low, medium, high, auto
    power_state BOOLEAN,
    is_online BOOLEAN DEFAULT FALSE,
    error_code VARCHAR(50),
    timestamp TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_device_status UNIQUE (device_id)
);

CREATE INDEX idx_device_status_device ON device_status(device_id);

-- Tabla de Telemetría Histórica (particionada por tiempo)
CREATE TABLE IF NOT EXISTS device_telemetry (
    id UUID DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL,
    temperature DECIMAL(4,1),
    humidity DECIMAL(4,1),
    power_consumption DECIMAL(10,2), -- kWh
    mode VARCHAR(50),
    fan_speed VARCHAR(50),
    power_state BOOLEAN,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Crear particiones para los próximos 12 meses
CREATE TABLE device_telemetry_2025_01 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE device_telemetry_2025_02 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE device_telemetry_2025_03 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE device_telemetry_2025_04 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE device_telemetry_2025_05 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
CREATE TABLE device_telemetry_2025_06 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
CREATE TABLE device_telemetry_2025_07 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');
CREATE TABLE device_telemetry_2025_08 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
CREATE TABLE device_telemetry_2025_09 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
CREATE TABLE device_telemetry_2025_10 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
CREATE TABLE device_telemetry_2025_11 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
CREATE TABLE device_telemetry_2025_12 PARTITION OF device_telemetry
    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

CREATE INDEX idx_telemetry_device_time ON device_telemetry(device_id, timestamp DESC);

-- Tabla de Comandos
CREATE TABLE IF NOT EXISTS device_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    command_type VARCHAR(50) NOT NULL, -- setPower, setTemperature, setMode, setFanSpeed
    parameters JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, executing, completed, failed
    error_message TEXT,
    executed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commands_device ON device_commands(device_id);
CREATE INDEX idx_commands_status ON device_commands(status);

-- Tabla de Alertas
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL, -- temperature_high, temperature_low, offline, error, maintenance
    severity VARCHAR(50) DEFAULT 'info', -- info, warning, critical
    message TEXT NOT NULL,
    metadata JSONB,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_device ON alerts(device_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_acknowledged ON alerts(acknowledged);

-- Tabla de Horarios/Schedules
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    schedule_type VARCHAR(50) DEFAULT 'recurring', -- once, recurring
    schedule_config JSONB NOT NULL, -- { cron, days, actions, temperature, mode, etc }
    last_executed TIMESTAMP,
    next_execution TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_schedules_device ON schedules(device_id);
CREATE INDEX idx_schedules_enabled ON schedules(enabled);
CREATE INDEX idx_schedules_next ON schedules(next_execution);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer', -- super_admin, admin, operator, viewer
    permissions JSONB, -- Permisos específicos por zona/dispositivo
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Tabla de Refresh Tokens para JWT
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Tabla de Logs de Auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- login, create_device, update_device, send_command, etc
    entity_type VARCHAR(50), -- device, user, schedule, etc
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_time ON audit_logs(created_at DESC);

-- Insertar datos de ejemplo

-- Usuario administrador por defecto (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@acplatform.com', '$2b$10$rWZxQ7zKZ3OJxGYE3VDYz.nOYXzqKZN9xKvZGYvKxZ3OJxGYE3VDY2', 'Administrador del Sistema', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Marcas genéricas
INSERT INTO brands (name, website) VALUES
('Generic MQTT', 'https://generic-mqtt.com'),
('Generic HTTP', 'https://generic-http.com'),
('Daikin', 'https://www.daikin.com'),
('LG', 'https://www.lg.com'),
('Carrier', 'https://www.carrier.com'),
('Mitsubishi Electric', 'https://www.mitsubishielectric.com'),
('Trane', 'https://www.trane.com'),
('York', 'https://www.york.com'),
('Fujitsu', 'https://www.fujitsu-general.com'),
('Panasonic', 'https://www.panasonic.com')
ON CONFLICT (name) DO NOTHING;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Mensajes de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos inicializada correctamente';
    RAISE NOTICE 'Usuario admin creado: admin@acplatform.com / admin123';
END $$;
