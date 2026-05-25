// app/beta/[token]/page.tsx
// Server component that validates the token and renders the form.

import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { BetaForm } from "./BetaForm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function BetaApplicationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data, error } = await supabase.rpc("get_signup_by_token", {
    p_token: token,
  });

  if (error || !data || data.length === 0) {
    notFound();
  }

  const signup = data[0];

  // Already applied? Send them to the "thanks, we'll be in touch" page.
  if (signup.has_application) {
    redirect("/beta/applied");
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 text-sm font-medium uppercase tracking-wider text-neutral-500">
          Beta Application
        </div>
        <h1 className="mb-4 text-4xl font-bold text-neutral-900">
          Tell us a bit about you
        </h1>
        <p className="mb-8 text-lg text-neutral-600">
          You're signed up as <strong>{signup.email}</strong>. The beta is iOS
          only for now. Fill this out and we'll send you a TestFlight link once
          you're approved.
        </p>

        <BetaForm token={token} />
      </div>
    </main>
  );
}
