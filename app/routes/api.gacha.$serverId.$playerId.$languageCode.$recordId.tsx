import { type LoaderFunctionArgs, json } from "@remix-run/node";

//create a loader that checks
export const loader = async ({
  request,
  context: { user, payload },
  params,
}: LoaderFunctionArgs) => {
  const { playerId, serverId, languageCode, recordId } = params;

  if (!playerId || !serverId || !languageCode || !recordId) {
    throw new Error("Missing parameters!");
  }

  const data = await Promise.all(
    fetchData({ playerId, serverId, languageCode, recordId })
  );

  let stored = null;

  // Now we store this data in the database
  if (user) {
    stored = await payload.create({
      collection: "user-data",
      data: {
        // @ts-expect-error this should work
        site: "pogseal-imbhew2r8tg7",
        // @ts-expect-error this should work
        author: user.id,
        slug: "gacha",
        data,
      },
      overrideAccess: false,
    });

    console.log("data stored in db!", stored);
  }

  return json({ stored, data });
};

const server_ids = {};

const banner_type: Record<number, string> = {
  1: "Featured Resonator Convene",
  2: "Featured Weapon Convene",
  3: "Standard Resonator Convene",
  4: "Standard Weapon Convene",
  5: "Beginner Convene",
  6: "Beginner's Choice Convene",
  7: "Beginner's Choice Convene (Giveback Custom Convene)",
};

const banner_data: Record<
  number,
  { name: string; type: number; res_id: string }
> = {
  1: {
    name: "Utternace of Marvels", // 20% OFF starter banner, 50 rolls guaranteed 5-star at end.
    type: 5, // Beginner Convene
    res_id: "4df1ed7da8530acc4263774922de7d7",
  },
  2: {
    name: "Tidal Chorus", // Standard Resonator Banner
    type: 3, // Standard Resonator Convene
    res_id: "6a6544dd7ce748e541a528967e4395c8",
  },
  3: {
    name: "???", // Unnamed in the files, it uses the selected item name.
    type: 4, // Standard Weapon Convene
    res_id: "a859ca595b193b96502fe3af3cb7726f",
  },
  4: {
    name: "???", // Unnamed in the files, 80 rolls guaranteed selected 5-star at end.
    type: 6, // Beginner's Choice Convene
    res_id: "917dfa695d6c6634ee4e972bb9168f6a",
  },
  5: {
    name: "???", // Unnamed in the files, free 5* resonator choice. Uses resonator name.
    type: 7, // Beginner's Choice Convene (Giveback Custom Convene)
    res_id: "48e034de667fdca4b2538397e6fb5d26",
  },
  100001: {
    name: "Prevail the Lasting Night",
    type: 1,
    res_id: "5c13a63f85465e9fcc0f24d6efb15083",
  },
  200001: {
    name: "Absolute Pulsation",
    type: 2,
    res_id: "663ab75b8820a61fc09a91b45dafa1f0",
  },
};

type BasePayload = {
  playerId: string;
  serverId: string;
  //   cardPoolId: string;
  //   cardPoolType: number;
  languageCode: string;
  recordId: string;
};

function fetchData(base_payload: BasePayload) {
  return Object.entries(banner_data).map(async ([id, banner]) => {
    console.log(
      `[*] Fetching id=${id}, ${banner.name} (${
        banner_type[banner.type]
      }) banner!`
    );

    // Base URL: https://aki-gm-resources-oversea.aki-game.net/aki/gacha/index.html#/record? (GET)
    // Actual URL: https://gmserver-api.aki-game2.net/gacha/record/query (POST)
    const response = await fetch(
      "https://gmserver-api.aki-game2.net/gacha/record/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...base_payload,
          cardPoolId: banner.res_id,
          cardPoolType: banner.type,
        }),
      }
    );

    const data = await response.json();

    return data;
  });
}
