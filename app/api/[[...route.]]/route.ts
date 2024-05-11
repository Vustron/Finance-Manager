import { zValidator } from '@hono/zod-validator';
import { prettyJSON } from 'hono/pretty-json';
import accounts from './accounts';
import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

// init runtime
export const runtime = 'edge';

// init hono
const app = new Hono().basePath('/api');
// use pretty json
app.use(prettyJSON());
// init error
app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return err.getResponse();
	}

	return c.json({ error: 'Internal error' }, 500);
});

// init routes
const routes = app.route('/accounts', accounts);

// init route handlers
export const GET = handle(app);
export const POST = handle(app);

// export types
export type AppType = typeof routes;
