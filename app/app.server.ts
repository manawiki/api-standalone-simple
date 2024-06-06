import type { AppLoadContext } from "@remix-run/node";
import compression from "compression";
import dotenv from "dotenv";
import morgan from "morgan";
import { createExpressApp } from "remix-create-express-app";
import { sayHello } from "./hello.server";

import path from "path";
import { type Payload, getPayload } from "payload";
import type { User } from "payload/generated-types";
import { importWithoutClientFiles } from "payload/node";
import type { SanitizedConfig } from "payload/types";

dotenv.config();

// initiate payload local API
const configPath = path.join(
  process.cwd(),
  process.env.PAYLOAD_CONFIG_PATH || "./app/db/payload.config.ts",
);
const fullConfig = await importWithoutClientFiles<{
  default: Promise<SanitizedConfig>;
}>(configPath);

const payload = await getPayload({ config: await fullConfig.default });

// This creates an express server that runs inside vite
export const app = createExpressApp({
  configure: (app) => {
    // customize your express app with additional middleware
    app.use(compression());
    app.disable("x-powered-by");
    app.use(morgan("tiny"));
  },
  async getLoadContext(req) {
    // @ts-expect-error this should work
    const headers = new Headers(req.headers);

    const { user } = await payload.auth({ headers });

    return { payload, user, sayHello } as AppLoadContext;
  },
  unstable_middleware: true,
});

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    sayHello: () => string;
    payload: Payload;
    user?: User;
  }
}
