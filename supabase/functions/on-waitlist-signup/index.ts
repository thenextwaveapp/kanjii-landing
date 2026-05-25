// supabase/functions/on-waitlist-signup/index.ts
// Webhook handler: fires when someone signs up for the waitlist
// Sends them a "you're in" email with a magic link to apply for beta

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;
const SUPPORT_EMAIL = Deno.env.get("SUPPORT_EMAIL")!;
const SITE_URL = Deno.env.get("SITE_URL")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")!;

Deno.serve(async (req) => {
  try {
    // Temporarily skip webhook secret validation for debugging
    // const webhookSecret = req.headers.get("x-webhook-secret");
    // if (webhookSecret !== WEBHOOK_SECRET) {
    //   return new Response("Unauthorized", { status: 401 });
    // }

    const payload = await req.json();
    const record = payload.record;

    if (!record || !record.email || !record.beta_token) {
      return new Response("Missing required fields", { status: 400 });
    }

    const betaLink = `${SITE_URL}/beta/${record.beta_token}`;

    // Send email to user
    const userEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: record.email,
        subject: "You're on the Kanjii waitlist 🎌",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #E85D3A; font-size: 28px; margin-bottom: 20px;">You're in!</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Thanks for signing up for the Kanjii beta. We're building the best way to learn Japanese — typing real sentences with the same keyboard native speakers use.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              <strong>Next step:</strong> Tell us a bit about yourself so we can send you a TestFlight link when you're approved.
            </p>
            <div style="margin: 32px 0;">
              <a href="${betaLink}" style="display: inline-block; background: #E85D3A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Apply for the beta
              </a>
            </div>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              This link is unique to your email. The beta is iOS only for now — we'll ask you about your device in the form.
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 32px;">
              頑張って！<br>
              The Kanjii Team
            </p>
          </div>
        `,
      }),
    });

    if (!userEmailRes.ok) {
      const errorText = await userEmailRes.text();
      console.error("Failed to send user email:", errorText);
      throw new Error(`Resend error: ${errorText}`);
    }

    // Notify support
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: SUPPORT_EMAIL,
        subject: "New waitlist signup",
        html: `
          <p><strong>New signup:</strong> ${record.email}</p>
          <p><strong>Beta link:</strong> ${betaLink}</p>
          <p><strong>Signed up:</strong> ${new Date(record.created_at).toLocaleString()}</p>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in on-waitlist-signup:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
