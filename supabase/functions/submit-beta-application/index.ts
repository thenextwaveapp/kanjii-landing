// supabase/functions/submit-beta-application/index.ts
// Receives the beta application form POST from the Next.js app
// Inserts the application and notifies support

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;
const SUPPORT_EMAIL = Deno.env.get("SUPPORT_EMAIL")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const {
      beta_token,
      full_name,
      ios_device,
      ios_version,
      experience_level,
      learning_goal,
      study_commitment,
      previous_study,
      why_beta,
      feedback_agreement,
      timezone,
    } = body;

    // Validate required fields
    if (!beta_token || !full_name || !ios_device || !why_beta || !feedback_agreement) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the signup record
    const { data: signupData, error: signupError } = await supabase
      .from("waitlist_signups")
      .select("id, email")
      .eq("beta_token", beta_token)
      .single();

    if (signupError || !signupData) {
      return new Response(
        JSON.stringify({ error: "Invalid beta token" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if they've already applied
    const { data: existingApp } = await supabase
      .from("beta_applications")
      .select("id")
      .eq("waitlist_signup_id", signupData.id)
      .single();

    if (existingApp) {
      return new Response(
        JSON.stringify({ error: "You've already applied" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert the application
    const { error: insertError } = await supabase
      .from("beta_applications")
      .insert({
        waitlist_signup_id: signupData.id,
        email: signupData.email,
        full_name,
        ios_device,
        ios_version,
        experience_level,
        learning_goal,
        study_commitment,
        previous_study,
        why_beta,
        feedback_agreement,
        timezone,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    // Update signup status
    await supabase
      .from("waitlist_signups")
      .update({ status: "invited", invited_at: new Date().toISOString() })
      .eq("id", signupData.id);

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
        subject: `New beta application: ${signupData.email}`,
        html: `
          <h2>New Beta Application</h2>
          <p><strong>Email:</strong> ${signupData.email}</p>
          <p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Device:</strong> ${ios_device} ${ios_version ? `(iOS ${ios_version})` : ""}</p>
          <p><strong>Experience:</strong> ${experience_level || "Not provided"}</p>
          <p><strong>Goal:</strong> ${learning_goal || "Not provided"}</p>
          <p><strong>Daily commitment:</strong> ${study_commitment || "Not provided"}</p>
          <p><strong>Previous study:</strong> ${previous_study || "Not provided"}</p>
          <p><strong>Timezone:</strong> ${timezone || "Not provided"}</p>
          <h3>Why beta?</h3>
          <p>${why_beta}</p>
          <hr>
          <p><strong>Approve via SQL:</strong></p>
          <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px;">
UPDATE waitlist_signups
SET status = 'approved', approved_at = now()
WHERE id = '${signupData.id}';
          </pre>
        `,
      }),
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in submit-beta-application:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
