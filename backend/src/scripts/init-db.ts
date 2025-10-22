import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import config from '../config';

async function initDatabase() {
  const pool = new Pool({
    connectionString: config.database.url,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Connected successfully!');

    // Read SQL file
    const sqlPath = path.join(__dirname, '../../..', 'docker/postgres/init.sql');
    console.log(`Reading SQL file from: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing SQL script...');
    await client.query(sql);

    console.log('✅ Database initialized successfully!');
    console.log('✅ Default admin user created: admin@acplatform.com / admin123');

    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
