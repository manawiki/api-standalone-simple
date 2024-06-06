//This endpoint checks the userData collection and return it, this is dependent on the user being logged in.

import { LoaderFunctionArgs, json } from "@remix-run/node";

export const loader = async ({
  request,
  context: { payload, user },
}: LoaderFunctionArgs) => {
  if (!user) {
    return json(
      { message: "You must be logged in to access this data" },
      { status: 401 }
    );
  }

  const userData = await payload.find({
    collection: "user-data",
    where: {
      author: {
        equals: user.id,
      },
      "site.id": {
        equals: "pogseal-imbhew2r8tg7",
      },
    },
    overrideAccess: false,
  });

  return json({ text: "This is data stored in mana db", userData });
};
