import { prettyJSON } from "hono/pretty-json";
import transactions from "./transactions";
import categories from "./categories";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import summary from "./summary";
import { Hono } from "hono";

// init runtime
export const runtime = "edge";

// init hono
const app = new Hono().basePath("/api");
// use pretty json
app.use(prettyJSON());

// init routes
const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary);

// init route handlers
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// export types
export type AppType = typeof routes;
