import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
	schema: './db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
});
