import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception';
import { accounts } from '@/db/schema';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

// init hono
const app = new Hono().get('/', clerkMiddleware(), async (c) => {
	// get auth
	const auth = getAuth(c);

	// throw error if there's no user
	if (!auth?.userId) {
		throw new HTTPException(401, {
			res: c.json({ error: 'Unauthorized' }),
		});
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
});

export default app;
