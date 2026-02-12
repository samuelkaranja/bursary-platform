import { ArrowLeftIcon, Clock } from "lucide-react";
import Link from "next/link";

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              Application Status
            </h1>
            <p className="text-gray-500 text-sm">
              Track your bursary application progress
            </p>
          </div>

          <button className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-100">
            Logout
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-black">Application Status</h2>
              <p className="text-sm text-gray-500">
                Tracking Number: BUR24412646
              </p>
            </div>

            <span className="bg-yellow-600 text-white px-4 py-1 rounded text-sm">
              Pending
            </span>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <TimelineItem
              active
              title="Application Submitted"
              subtitle="February 12, 2026"
            />

            <TimelineItem
              title="Under Review"
              subtitle="Your application is being reviewed by our team"
            />

            <TimelineItem
              title="Decision Pending"
              subtitle="You will be notified once a decision is made"
            />
          </div>

          {/* Info box */}
          <div className="flex bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            <Clock size={19} className="mr-2" />
            Your application is currently under review. This process typically
            takes 2–4 weeks. You will receive an update via SMS once a decision
            has been made.
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4 text-black">Application Details</h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <Detail label="Full Name" value="Samuel Njuguna Karanja" />
            <Detail label="Phone Number" value="0719413656" />
            <Detail label="Education Level" value="University/College" />
            <Detail label="Institution" value="Nairobi Technical" />
          </div>
        </div>

        {/* Help */}
        <div className="bg-white rounded-xl shadow p-6 text-sm space-y-2">
          <h3 className="font-semibold text-black">Need Help?</h3>

          <p className=" text-gray-500">
            Phone: <span className=" text-black">+254 700 000 000</span>
          </p>
          <p className=" text-gray-500">
            Email:{" "}
            <span className=" text-black">bursary@constituency.go.ke</span>{" "}
          </p>
          <p className=" text-gray-500">
            Office Hours:{" "}
            <span className=" text-black">
              Monday – Friday, 8:00 AM – 5:00 PM
            </span>
          </p>
        </div>

        {/* Back */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-black hover:underline"
          >
            <ArrowLeftIcon />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* Components */

function TimelineItem({
  title,
  subtitle,
  active = false,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-1 h-3 w-3 rounded-full ${
          active ? "bg-blue-600" : "bg-gray-300"
        }`}
      />

      <div>
        <p className={`font-medium text-gray-500 ${active && "text-blue-700"}`}>
          {title}
        </p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-black">{value}</p>
    </div>
  );
}
