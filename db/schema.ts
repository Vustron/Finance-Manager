import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// init account table
export const accounts = pgTable('accounts', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
});

// insert account
export const insertAccountSchema = createInsertSchema(accounts);
// account relations
export const accountRelations = relations(accounts, ({ many }) => ({
	transactions: many(transactions),
}));

// init categories table
export const categories = pgTable('categories', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
});

// insert categories
export const insertCategoriesSchema = createInsertSchema(categories);
// categories relations
export const categoriesRelations = relations(categories, ({ many }) => ({
	transactions: many(transactions),
}));

// init transactions
export const transactions = pgTable('transactions', {
	id: text('id').primaryKey(),
	amount: integer('amount').notNull(),
	payee: text('payee').notNull(),
	notes: text('notes'),
	date: timestamp('date', { mode: 'date' }).notNull(),
	accountId: text('account_id')
		.references(() => accounts.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	categoryId: text('category_id').references(() => categories.id, {
		onDelete: 'set null',
	}),
});

// insert transactions
export const insertTransactionsSchema = createInsertSchema(transactions, {
	date: z.coerce.date(),
});
// transactions relations
export const transactionsRelations = relations(transactions, ({ one }) => ({
	account: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id],
	}),
	categories: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id],
	}),
}));
