import { NextResponse } from "next/server";

const APPLE_TEAM_ID = "8RGNFMX698";

export function GET() {
  const association = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${APPLE_TEAM_ID}.com.kanjii.app`,
          paths: ["*"],
        },
      ],
    },
  };

  return NextResponse.json(association, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
