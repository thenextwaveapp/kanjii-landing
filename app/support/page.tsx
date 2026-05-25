import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-block text-sm text-neutral-600 hover:text-[#E85D3A] mb-8"
        >
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold text-neutral-900 mb-6">Support</h1>

        <div className="space-y-8 text-neutral-700">
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              About Kanjii
            </h2>
            <p>
              Kanjii is a Japanese learning app that helps you master kanji
              through IME typing practice, spaced repetition, and sentence-level
              learning. Progress through JLPT levels with our comprehensive
              kanji library and interactive study tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Need Help?
            </h2>
            <p className="mb-4">
              If you have questions, feedback, or need assistance with the app,
              please reach out to us:
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@kanjii.app"
                className="text-[#E85D3A] hover:underline"
              >
                support@kanjii.app
              </a>
            </p>
            <p className="mt-4 text-sm">
              We typically respond within 24-48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Common Issues
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Login problems:</strong> Make sure you're using the same
                sign-in method you originally registered with.
              </li>
              <li>
                <strong>Sync issues:</strong> Try logging out and back in to
                refresh your data.
              </li>
              <li>
                <strong>Beta access:</strong> If you applied for the beta, check
                your email for the TestFlight invitation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Feedback
            </h2>
            <p>
              We're constantly improving Kanjii. Your feedback helps us make the
              app better. Please email us with any suggestions or feature
              requests.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
