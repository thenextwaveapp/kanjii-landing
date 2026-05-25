// app/beta/applied/page.tsx
export default function BetaAppliedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">🎌</div>
        <h1 className="mb-4 text-3xl font-bold text-neutral-900">
          Application received
        </h1>
        <p className="text-lg text-neutral-600">
          We'll review your application and send a TestFlight link to your email
          within a few days. 頑張って！
        </p>
      </div>
    </main>
  );
}
