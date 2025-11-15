import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs"; // important for server-side fetch behavior

type InitSessionResponse = {
  csrftoken: string;
  sessionid: string;
};

export async function POST(req: NextRequest) {
  const { roomNumber } = await req.json(); // Parse the JSON body
  if (!roomNumber) {
    return new Response(
      JSON.stringify({ error: "Missing room number in request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
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

  const upstreamRes = await fetch(
    `https://marriottarubasurfclub.ipoolside.com/api/reservationno/check-user-fields-before-register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        Cookie: cookieHeader,
        "X-CSRFToken": csrftoken, // note the casing; Django-style
      },
      body: JSON.stringify({
        room_no: roomNumber.toString(),
        club_member: "",
        club_member_email: "",
        company_name: "",
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

/*
export async function POST(req: Request) {
  const { roomNumber } = await req.json(); // Parse the JSON body
  if (!roomNumber) {
    return new Response(
      JSON.stringify({ error: "Missing room number in request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const res = await fetch(
      "https://marriottarubasurfclub.ipoolside.com/api/reservationno/check-user-fields-before-register",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          Cookie: `csrftoken=s44qkUeaHPEE3xanUQRBm6QuXsifdiSmDM5hFXo0VbI9RMSmmvmtghwNU4fsh2nu; AMCVS_664516D751E565010A490D4C%40AdobeOrg=1; s_cc=true; _scid=1224aaed-5424-4f04-a755-1f146fee2a61; GA1.3.474718998.1721211993; _pin_unauth=dWlkPVpqUmtaVFk0WldRdE1HWmtOUzAwTkdVNUxXRmtNMll0TW1ZMk1UQmxaR0k0TWpGbA; s_campaign=Natural%20Search%3A%20Google; _gid=GA1.2.1654549736.1731882226; _gcl_au=1.1.320086314.1731882228; _fbp=fb.1.1731882228184.694824118570942788; _ScCbts=%5B%5D; _sctr=1%7C1731819600000; sessionid=uvuy190pn3g40tbcpy9ohbhc1joefraz; _ga_1LXTBF5X2V=GS1.1.1732051167.5.0.1732051167.60.0.0; _ga=GA1.2.474718998.1721211993; _dpm_ses.df98=*; _dpm_id.df98=7ce0a67b-924e-4766-b53d-768038c27a59.1721212451.10.1732051199.1732035969.82a60f17-942c-49db-822b-749533cbc1d9; _scid_r=GdwSJKrtVCQOBLdVHxRv7iph3q_jVD542gx8Iw; _uetsid=9d464350a53211ef949ac7af4fd4d1ae; _uetvid=6e2f8030442711efb94cdf564a4b270a; AMCV_664516D751E565010A490D4C%40AdobeOrg=-1712354808%7CMCIDTS%7C20047%7CMCMID%7C90610148907494307974290422199015296804%7CMCAAMLH-1732655999%7C7%7CMCAAMB-1732655999%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1732058399s%7CNONE%7CvVersion%7C4.3.0; s_tbm=true; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Nov+19+2024+16%3A19%3A59+GMT-0500+(Eastern+Standard+Time)&version=202401.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=https%3A%2F%2Fmarriottarubasurfclub.ipoolside.com%2F&groups=1%3A1%2C3%3A1%2C4%3A1%2C6%3A1; _ga_F655SMQDS2=GS1.2.1732051197.7.1.1732051820.0.0.0; s_sq=marriottglobal%252C%3D%2526c.%2526a.%2526activitymap.%2526page%253Dmarriottarubasurfclub.ipoolside.com%25252Fcart%25252Fguest-checkout%2526link%253DPlace%252520order%2526region%253DguestInfoPlaceOrderContainer%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c`,
          "X-Csrftoken": `1M2Kp6iQqUO8tiyk2YwYqCKBk87u0qI3cu3BK9sGEgSDhxgjuD1QkNqUhK4H4adb`,
        },
        body: JSON.stringify({
          room_no: roomNumber.toString(),
          club_member: "",
          club_member_email: "",
          company_name: "",
        }),
      }
    );
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
  */
