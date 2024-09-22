import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon("postgresql://final_year_owner:3JiCmVb1Ecdu@ep-still-sound-a5eheppz.us-east-2.aws.neon.tech/final_year?sslmode=require");
export const db = drizzle(sql, {schema});