import path from "path";
import { fileURLToPath } from "url";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload/config";

import { UserData } from "./collections/user-data/user-data.config";
import { Sites } from "./custom/CustomSites";
import { Users } from "./custom/CustomUsers";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
  },
  editor: {
    // @ts-expect-error we don't need the editor here
    validate: () => true,
  },
  db: mongooseAdapter({
    url: `${process.env.MONGODB_URI}/${process.env.CUSTOM_DB_NAME}`,
  }),
  cors: "*",
  secret: process.env.PAYLOADCMS_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "./payload-types.ts"),
  },
  collections: [Users, Sites, UserData],
});
