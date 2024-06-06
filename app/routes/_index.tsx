import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({
  context: { payload, user },
}: LoaderFunctionArgs) {
  const users = await payload.find({
    collection: "users",
    overrideAccess: false,
  });

  return { users, user };
}

export default function Index() {
  const { users, user } = useLoaderData<typeof loader>();
  console.log(user);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <p style={{ color: "red" }}>Username: {user && user?.username}</p>
      <ul>
        <li>
          <Link to="/api/test" reloadDocument>
            Test proxy
          </Link>
        </li>
        <li>
          <Link
            to="/api/gacha/591d6af3a3090d8ea00d8f86cf6d7501/500016561/en/cb1d1f2269e5442124eff6540823a570"
            reloadDocument
          >
            Test gacha proxy store
          </Link>
        </li>
        <li>
          <Link to="/api/user-data" reloadDocument>
            Test user data stored in db
          </Link>
        </li>
      </ul>
      User count: {users.totalDocs}
    </div>
  );
}
