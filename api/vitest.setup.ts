import { config } from 'dotenv';
import path from 'path';

// Charge explicitement le .env à la racine du repo (api/ n'a pas son propre .env)
config({ path: path.resolve(__dirname, '../.env') });

// Bascule DATABASE_URL vers la base de test AVANT que prisma.ts ne soit importé
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;