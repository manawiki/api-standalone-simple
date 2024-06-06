import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { expressDevServer } from "remix-express-dev-server";

installGlobals({ nativeFetch: true });

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  plugins: [
    expressDevServer(),
    remix({
      future: { unstable_singleFetch: true },
    }),
    tsconfigPaths(),
  ],
});
