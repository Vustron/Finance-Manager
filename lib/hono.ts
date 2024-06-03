import { AppType } from "@/app/api/[[...route.]]/route";
import { hc } from "hono/client";

// init rpc client
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
