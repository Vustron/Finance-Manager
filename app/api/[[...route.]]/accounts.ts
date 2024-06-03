import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { accounts, insertAccountSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, and, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { db } from "@/db/drizzle";
import { Hono } from "hono";
import { z } from "zod";

// init hono
const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    // get auth
    const auth = getAuth(c);

    // throw error if there's no user
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // fetch accounts from neon db
    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  })
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
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

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
      insertAccountSchema.pick({
        name: true,
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
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
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

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids),
          ),
        )
        .returning({
          id: accounts.id,
        });

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
      insertAccountSchema.pick({
        name: true,
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

      // throw error if there's no id
      // if (!values) {
      // 	return c.json({ error: 'Missing values' }, 400);
      // }

      const [data] = await db
        .update(accounts)
        .set(values)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
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

      const [data] = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning({
          id: accounts.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  );

export default app;
