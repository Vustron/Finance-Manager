import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// init account table
export const accounts = pgTable('accounts', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
});

// insert account
export const insertAccountSchema = createInsertSchema(accounts);

// init categories table
export const categories = pgTable('categories', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
});

// insert categories
export const insertCategoriesSchema = createInsertSchema(categories);
