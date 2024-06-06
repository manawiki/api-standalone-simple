import { LoaderFunctionArgs, json } from "@remix-run/node";

//create a loader that checks
export const loader = async ({ request }: LoaderFunctionArgs) => {
  let base_payload = {
    playerId: "500016561",
    serverId: "591d6af3a3090d8ea00d8f86cf6d7501",
    cardPoolId: "4df1ed7da8530acc4263774922de7d7",
    cardPoolType: 5,
    languageCode: "en",
    recordId: "cb1d1f2269e5442124eff6540823a570",
  };

  const response = await fetch(
    "https://gmserver-api.aki-game2.net/gacha/record/query",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(base_payload),
    },
  );

  return response;
};
