// app/beta/[token]/BetaForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EDGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-beta-application`;

export function BetaForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      beta_token: token,
      full_name: formData.get("full_name"),
      ios_device: formData.get("ios_device"),
      ios_version: formData.get("ios_version") || null,
      experience_level: formData.get("experience_level") || null,
      learning_goal: formData.get("learning_goal") || null,
      study_commitment: formData.get("study_commitment") || null,
      previous_study: formData.get("previous_study") || null,
      why_beta: formData.get("why_beta"),
      feedback_agreement: formData.get("feedback_agreement") === "on",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    try {
      const res = await fetch(EDGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong");
      }

      router.push("/beta/applied");
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Your name" name="full_name" required />

      <Select
        label="iOS device"
        name="ios_device"
        required
        options={[
          "iPhone 15 Pro / Pro Max",
          "iPhone 15 / 15 Plus",
          "iPhone 14 series",
          "iPhone 13 series",
          "iPhone 12 series",
          "iPhone 11 / SE / older",
          "iPad",
        ]}
      />

      <Field label="iOS version (optional)" name="ios_version" placeholder="e.g. 17.5" />

      <Select
        label="Your Japanese level"
        name="experience_level"
        options={[
          ["complete_beginner", "Complete beginner"],
          ["know_kana", "I know hiragana / katakana"],
          ["know_some_kanji", "I know some kanji"],
          ["intermediate", "Intermediate"],
          ["advanced", "Advanced"],
        ]}
      />

      <Select
        label="Why are you learning?"
        name="learning_goal"
        options={[
          ["travel", "Travel"],
          ["work", "Work"],
          ["entertainment", "Anime / manga / games"],
          ["heritage", "Family / heritage"],
          ["academic", "School / academic"],
          ["general", "General interest"],
        ]}
      />

      <Select
        label="How much time can you put in per day?"
        name="study_commitment"
        options={[
          ["less_than_15", "Less than 15 min"],
          ["15_plus", "15+ min"],
          ["30_plus", "30+ min"],
          ["1_hour_plus", "1+ hour"],
          ["2_hours_plus", "2+ hours"],
        ]}
      />

      <Select
        label="Previous study"
        name="previous_study"
        options={[
          ["never", "Never studied before"],
          ["self_taught", "Self-taught"],
          ["classes", "Took classes"],
          ["lived_in_japan", "Lived in Japan"],
          ["native", "Native speaker"],
        ]}
      />

      <Textarea
        label="Why do you want to test the beta?"
        name="why_beta"
        required
        placeholder="A few sentences about what you're hoping to get out of it."
      />

      <label className="flex items-start gap-3 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="feedback_agreement"
          required
          className="mt-1"
        />
        <span>
          I agree to share feedback as I use the app and understand the beta may
          have rough edges.
        </span>
      </label>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[#E85D3A] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Apply for the beta"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-900">
        {label}
        {required && <span className="text-[#E85D3A]"> *</span>}
      </label>
      <input
        type="text"
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-[#E85D3A] focus:outline-none focus:ring-2 focus:ring-[#E85D3A]/20"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-900">
        {label}
        {required && <span className="text-[#E85D3A]"> *</span>}
      </label>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-[#E85D3A] focus:outline-none focus:ring-2 focus:ring-[#E85D3A]/20"
      />
    </div>
  );
}

function Select({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: (string | [string, string])[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-900">
        {label}
        {required && <span className="text-[#E85D3A]"> *</span>}
      </label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base focus:border-[#E85D3A] focus:outline-none focus:ring-2 focus:ring-[#E85D3A]/20"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => {
          const [value, label] = Array.isArray(opt) ? opt : [opt, opt];
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
