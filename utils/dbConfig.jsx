import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL;

const sql = neon(databaseUrl);
export const db = drizzle(sql, {schema});

