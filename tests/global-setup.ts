// tests/global-setup.ts
import { Client } from 'pg';
import "dotenv/config"
const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
const POSTGRES_PORT = process.env.POSTGRES_PORT

export default async function setup() {
    const client = new Client({
        connectionString: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:${POSTGRES_PORT}/postgres`,
    });
    await client.connect();
    const exists = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB}'`);
    if (exists.rowCount === 0) {
        await client.query(`CREATE DATABASE ${POSTGRES_DB}`);
        console.log("CREATING TEST DB")
    } else {
        console.log("TEST DB EXISTS")
    }
    await client.end();
}
