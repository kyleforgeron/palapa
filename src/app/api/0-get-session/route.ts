// app/api/init-session/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important: use Node runtime, not Edge

// Helper to pull a specific cookie value out of a Set-Cookie header string
function extractCookieValue(
  setCookieHeader: string | null,
  name: string
): string | undefined {
  if (!setCookieHeader) return;

  // There can be multiple Set-Cookie headers concatenated, so split on commas that start a new cookie
  const cookieStrings = setCookieHeader.split(/,(?=[^;]+?=)/);

  for (const cookieStr of cookieStrings) {
    const [cookiePair] = cookieStr.split(";");
    const [key, value] = cookiePair.trim().split("=");
    if (key === name) {
      return value;
    }
  }

  return;
}

export async function POST() {
  // 1) Get csrftoken
  const firstRes = await fetch(
    "https://marriottarubasurfclub.ipoolside.com/api/auth/sites-session",
    {
      method: "GET",
      // Usually no CSRF header needed here; the whole point is to get one
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    }
  );

  const setCookie1 = firstRes.headers.get("set-cookie");
  const csrftoken = extractCookieValue(setCookie1, "csrftoken");

  if (!csrftoken) {
    return NextResponse.json(
      { error: "Failed to obtain csrftoken from sites-session" },
      { status: 500 }
    );
  }

  // 2) Get sessionid, using the same csrftoken (as cookie and header)
  const secondRes = await fetch(
    "https://marriottarubasurfclub.ipoolside.com/api/auth/login-session",
    {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        // Send the cookie back to mimic the browser
        Cookie: `csrftoken=${csrftoken}`,
        // Many CSRF-protected APIs also expect this header, Django-style
        "X-CSRFToken": csrftoken,
      },
    }
  );

  const setCookie2 = secondRes.headers.get("set-cookie");
  const sessionid = extractCookieValue(setCookie2, "sessionid");

  if (!sessionid) {
    return NextResponse.json(
      { error: "Failed to obtain sessionid from login-session" },
      { status: 500 }
    );
  }

  const token = { csrftoken, sessionid };

  // 3) Build the response and (optionally) store on *your* domain as cookies
  const res = NextResponse.json(token);

  // These are cookies on YOUR domain, not marriottarubasurfclub.ipoolside.com
  // You only need them if you want the client to see them; for server-only use, you can skip this.
  res.cookies.set("poolside_csrftoken", csrftoken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  res.cookies.set("poolside_sessionid", sessionid, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  return res;
}
