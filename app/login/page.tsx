import Link from "next/link";

export default function TrackApplicationLoginPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-15">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        {/* Header */}
        <h1 className="text-center text-2xl font-semibold tracking-tight text-[#1f3a8a] sm:text-3xl">
          Track Your Application
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500 sm:text-base">
          Log in to view your application status
        </p>

        {/* Card */}
        <div className="mt-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Login</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your credentials to access your application
          </p>

          <form className="mt-6 space-y-4">
            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700"
              >
                Phone Number
              </label>

              <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#eef4ff] px-3 py-3">
                <PhoneIcon />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0712345678"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#eef4ff] px-3 py-3">
                <LockIcon />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#1f3a8a] py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:opacity-90"
            >
              Login
            </button>

            {/* Back */}
            <div className="pt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#1f3a8a] hover:underline"
              >
                <ArrowLeftIcon />
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

/** Simple inline icons (no extra deps) */
function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none text-slate-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.57-1a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none text-slate-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
