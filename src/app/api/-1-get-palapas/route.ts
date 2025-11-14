// app/api/get-palapas-special-days/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important for server-side fetch behavior

type InitSessionResponse = {
  csrftoken: string;
  sessionid: string;
};

export async function POST() {
  const cookieStore = cookies();

  let csrftoken = cookieStore.get("poolside_csrftoken")?.value;
  let sessionid = cookieStore.get("poolside_sessionid")?.value;

  // Optional: auto-bootstrap if missing
  if (!csrftoken || !sessionid) {
    // Replace with your actual origin, or use an env var.
    // For local dev: "http://localhost:3000/api/init-session"
    const initUrl =
      process.env.NEXT_PUBLIC_APP_ORIGIN?.concat("/api/init-session") ??
      "http://localhost:3000/api/init-session";

    const initRes = await fetch(initUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      // Important: include 'credentials' if you need Set-Cookie on client,
      // but for server-to-server here it's not strictly necessary.
    });

    if (!initRes.ok) {
      const errorBody = await initRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Failed to initialize poolside session",
          status: initRes.status,
          body: errorBody,
        },
        { status: 500 }
      );
    }

    const initData = (await initRes.json()) as InitSessionResponse;
    csrftoken = initData.csrftoken;
    sessionid = initData.sessionid;

    if (!csrftoken || !sessionid) {
      return NextResponse.json(
        { error: "Init-session did not return csrftoken/sessionid" },
        { status: 500 }
      );
    }
  }

  // If we still somehow don't have them, bail
  if (!csrftoken || !sessionid) {
    return NextResponse.json(
      { error: "Missing poolside_csrftoken or poolside_sessionid" },
      { status: 401 }
    );
  }

  // Build minimal cookie header: you usually only need csrftoken + sessionid
  const cookieHeader = `csrftoken=${csrftoken}; sessionid=${sessionid}`;

  const today = new Date().toISOString().slice(0, 10);

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");

  const formattedTomorrow = `${yyyy}-${mm}-${dd}`; // "YYYY-MM-DD"

  const upstreamRes = await fetch(
    "https://marriottarubasurfclub.ipoolside.com/api/palapa/booking/get-bookings/1",
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        Cookie: cookieHeader,
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        book_date: formattedTomorrow,
      }),
    }
  );

  if (!upstreamRes.ok) {
    const errorBody = await upstreamRes.text().catch(() => "");
    return NextResponse.json(
      {
        error: "Poolside API call failed",
        status: upstreamRes.status,
        body: errorBody,
      },
      { status: upstreamRes.status }
    );
  }

  const data = await upstreamRes.json();
  return NextResponse.json(data);
}
