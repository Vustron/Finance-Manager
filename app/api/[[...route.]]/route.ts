import { prettyJSON } from 'hono/pretty-json';
import categories from './categories';
import { handle } from 'hono/vercel';
import accounts from './accounts';
import { Hono } from 'hono';

// init runtime
export const runtime = 'edge';

// init hono
const app = new Hono().basePath('/api');
// use pretty json
app.use(prettyJSON());

// init routes
const routes = app
	.route('/accounts', accounts)
	.route('/categories', categories);

// init route handlers
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// export types
export type AppType = typeof routes;
