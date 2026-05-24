"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      setMessage("You're on the list. We'll be in touch soon.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="waitlist-wrap reveal">
      <form className="waitlist-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          className="waitlist-input"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={state === "loading" || state === "success"}
          aria-label="Email address"
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={state === "loading" || state === "success"}
        >
          {state === "loading" ? "Joining..." : "Join the Waitlist"}
        </button>
      </form>
      {message ? (
        <p
          className={`waitlist-message ${state === "error" ? "waitlist-message-error" : "waitlist-message-success"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
