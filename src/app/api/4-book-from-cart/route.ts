import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { anonymousId, roomNumber, firstName, lastName, email, phone } =
    await req.json(); // Parse the JSON body
  if (!(anonymousId && roomNumber && firstName && lastName && email && phone)) {
    return new Response(
      JSON.stringify({ error: "Missing fields in request body" }),
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
      "https://marriottarubasurfclub.ipoolside.com/api/cart/book-from-cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          Cookie: `csrftoken=s44qkUeaHPEE3xanUQRBm6QuXsifdiSmDM5hFXo0VbI9RMSmmvmtghwNU4fsh2nu; AMCVS_664516D751E565010A490D4C%40AdobeOrg=1; s_cc=true; _scid=1224aaed-5424-4f04-a755-1f146fee2a61; GA1.3.474718998.1721211993; _pin_unauth=dWlkPVpqUmtaVFk0WldRdE1HWmtOUzAwTkdVNUxXRmtNMll0TW1ZMk1UQmxaR0k0TWpGbA; s_campaign=Natural%20Search%3A%20Google; _gid=GA1.2.1654549736.1731882226; _gcl_au=1.1.320086314.1731882228; _fbp=fb.1.1731882228184.694824118570942788; _ScCbts=%5B%5D; _sctr=1%7C1731819600000; sessionid=uvuy190pn3g40tbcpy9ohbhc1joefraz; _ga_1LXTBF5X2V=GS1.1.1732051167.5.0.1732051167.60.0.0; _ga=GA1.2.474718998.1721211993; _dpm_ses.df98=*; _dpm_id.df98=7ce0a67b-924e-4766-b53d-768038c27a59.1721212451.10.1732051199.1732035969.82a60f17-942c-49db-822b-749533cbc1d9; _scid_r=GdwSJKrtVCQOBLdVHxRv7iph3q_jVD542gx8Iw; _uetsid=9d464350a53211ef949ac7af4fd4d1ae; _uetvid=6e2f8030442711efb94cdf564a4b270a; AMCV_664516D751E565010A490D4C%40AdobeOrg=-1712354808%7CMCIDTS%7C20047%7CMCMID%7C90610148907494307974290422199015296804%7CMCAAMLH-1732655999%7C7%7CMCAAMB-1732655999%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1732058399s%7CNONE%7CvVersion%7C4.3.0; s_tbm=true; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Nov+19+2024+16%3A19%3A59+GMT-0500+(Eastern+Standard+Time)&version=202401.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=https%3A%2F%2Fmarriottarubasurfclub.ipoolside.com%2F&groups=1%3A1%2C3%3A1%2C4%3A1%2C6%3A1; _ga_F655SMQDS2=GS1.2.1732051197.7.1.1732051820.0.0.0; s_sq=marriottglobal%252C%3D%2526c.%2526a.%2526activitymap.%2526page%253Dmarriottarubasurfclub.ipoolside.com%25252Fcart%25252Fguest-checkout%2526link%253DPlace%252520order%2526region%253DguestInfoPlaceOrderContainer%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c`,
          "X-Csrftoken": `1M2Kp6iQqUO8tiyk2YwYqCKBk87u0qI3cu3BK9sGEgSDhxgjuD1QkNqUhK4H4adb`,
        },
        body: JSON.stringify({
          anonymous_id: anonymousId,
          email_address: email,
          full_name: `${firstName} ${lastName}`,
          last_name: lastName,
          first_name: firstName,
          reservation_no: "",
          room: roomNumber,
          club_member: "",
          club_member_email: "",
          orig_reservation_no: "",
          phone_no: phone,
          country_code: "1",
          opt_in_email: false,
          opt_in_sms: false,
          agree_promo: false,
          terms_accepted: true,
          company_name: "",
          iata_number: "",
          preference_note: "\t\t\t\t\t\t",
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
