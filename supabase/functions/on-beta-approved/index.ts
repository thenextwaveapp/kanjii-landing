// supabase/functions/on-beta-approved/index.ts
// Webhook handler: fires when status changes to 'approved'
// Sends the TestFlight link to the user

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;
const TESTFLIGHT_URL = Deno.env.get("TESTFLIGHT_URL")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")!;

Deno.serve(async (req) => {
  try {
    // Verify webhook secret
    const webhookSecret = req.headers.get("x-webhook-secret");
    if (webhookSecret !== WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await req.json();
    const record = payload.record;

    // Only proceed if status is now 'approved'
    if (!record || record.status !== "approved") {
      return new Response("Not an approval event", { status: 200 });
    }

    if (!record.email) {
      return new Response("Missing email", { status: 400 });
    }

    // Send TestFlight email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: record.email,
        subject: "You're approved for the Kanjii beta! 🎉",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #E85D3A; font-size: 28px; margin-bottom: 20px;">You're in! 🎉</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Great news — you've been approved for the Kanjii beta. We're excited to have you test the app and help shape how people learn Japanese.
            </p>
            <div style="margin: 32px 0;">
              <a href="${TESTFLIGHT_URL}" style="display: inline-block; background: #E85D3A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Install via TestFlight
              </a>
            </div>
            <h2 style="font-size: 20px; margin-top: 32px; color: #333;">What to expect</h2>
            <ul style="font-size: 16px; line-height: 1.8; color: #333;">
              <li>The beta is iOS-only for now</li>
              <li>You'll need TestFlight installed (Apple's official beta testing app)</li>
              <li>Some features may have rough edges — that's what beta testing is for!</li>
              <li>Your feedback will directly shape the app's development</li>
            </ul>
            <h2 style="font-size: 20px; margin-top: 32px; color: #333;">Share feedback</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Hit any bugs? Have suggestions? Reply to this email — we read every message.
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 32px;">
              頑張って！<br>
              The Kanjii Team
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errorText = await emailRes.text();
      console.error("Failed to send TestFlight email:", errorText);
      throw new Error(`Resend error: ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in on-beta-approved:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
