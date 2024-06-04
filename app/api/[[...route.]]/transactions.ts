import {
  accounts,
  categories,
  transactions,
  insertTransactionsSchema,
} from "@/db/schema";
import { eq, and, inArray, gte, lte, desc, sql } from "drizzle-orm";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { parse, subDays } from "date-fns";
import { db } from "@/db/drizzle";
import { Hono } from "hono";
import { z } from "zod";

// init hono
const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      }),
    ),
    clerkMiddleware(),
    async (c) => {
      // get auth
      const auth = getAuth(c);
      // get query
      const { from, to, accountId } = c.req.valid("query");

      // throw error if there's no user
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // default filter
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      // start date filter
      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      // end date filter
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      // fetch accounts from neon db
      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          ),
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    },
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      // get auth
      const auth = getAuth(c);
      // get values
      const { id } = c.req.valid("param");

      // throw error if there's no user
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // throw error if there's no id
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionsSchema.omit({
        id: true,
      }),
    ),
    async (c) => {
      // get auth
      const auth = getAuth(c);
      // get values
      const values = c.req.valid("json");

      // throw error if there's no user
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // insert new account
      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

      return c.json({ data });
    },
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      // get auth
      const auth = getAuth(c);
      // get values
      const values = c.req.valid("json");

      // throw error if there's no user
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // transaction to delete query filter
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId),
            ),
          ),
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`,
          ),
        )
        .returning({
          id: transactions.id,
        });

      return c.json({ data });
    },
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionsSchema.omit({
          id: true,
        }),
      ),
    ),
    async (c) => {
      // get auth
      const auth = getAuth(c);
      // get values
      const values = c.req.valid("json");

      // throw error if there's no user
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          })),
        )
        .returning();

      return c.json({ data });
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertTransactionsSchema.omit({
        id: true,
      }),
    ),
    async (c) => {
      // get auth
      const auth = getAuth(c);

      // get id
      const { id } = c.req.valid("param");

      // get values
      const values = c.req.valid("json");

      // throw error if there's no user
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // throw error if there's no id
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // transaction to update query filter
      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(eq(transactions.id, id), eq(accounts.userId, auth.userId)),
          ),
      );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToUpdate})`,
          ),
        )
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      // get auth
      const auth = getAuth(c);

      // get id
      const { id } = c.req.valid("param");

      // throw error if there's no user
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // throw error if there's no id
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // transaction to delete query filter
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(eq(transactions.id, id), eq(accounts.userId, auth.userId)),
          ),
      );

      const [data] = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`,
          ),
        )
        .returning({
          id: transactions.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  );

export default app;
