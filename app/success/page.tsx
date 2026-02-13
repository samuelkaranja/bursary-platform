"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

export default function SuccessPage() {
  // Get tracking number from Redux
  const trackingFromRedux = useSelector(
    (state: RootState) => state.application.trackingNumber,
  );

  const tracking = trackingFromRedux || "BUR48583259"; // fallback if not in Redux

  return (
    <main className="min-h-screen bg-white px-4">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center py-5">
        <section className="w-full text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1E3A8A] shadow-sm">
            <CheckIcon className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Application Submitted Successfully!
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Your bursary application has been received. Please save your
            tracking number below to check your application status.
          </p>

          {/* Tracking Card */}
          <div className="mx-auto mt-8 w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-sm">
            <p className="text-xs font-medium text-gray-500">
              Your Tracking Number
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-wide text-[#1E3A8A] sm:text-3xl">
              {tracking}
            </p>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Please save this number. You&apos;ll need it to track your
              application.
            </p>
          </div>

          {/* Buttons */}
          <div className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1B357A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 sm:w-auto"
            >
              Back to Home
            </Link>

            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300/40 sm:w-auto"
            >
              Track Application
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.2 12.8l1.7 1.7 4.9-5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />
    </svg>
  );
}
