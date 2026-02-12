import { Users, GraduationCap, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-[#f8fafc] py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
          About the Bursary Program
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Our bursary program is designed to provide financial assistance to
          students from our constituency who demonstrate academic potential and
          financial need. We believe every student deserves access to quality
          education.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <InfoCard
            icon={<Users className="w-6 h-6 text-blue-900" />}
            title="Who Can Apply"
            description="Students from our constituency in secondary schools, colleges, and universities."
          />

          <InfoCard
            icon={<GraduationCap className="w-6 h-6 text-blue-900" />}
            title="Financial Support"
            description="Comprehensive bursary support to help you achieve your educational goals."
          />

          <InfoCard
            icon={<ShieldCheck className="w-6 h-6 text-blue-900" />}
            title="Transparency & Fairness"
            description="Merit-based selection process ensuring equal opportunity for all eligible students."
          />
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function InfoCard({ icon, title, description }: CardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-left shadow-sm hover:shadow-md transition-all duration-300">
      {/* Icon Container */}
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50">
        {icon}
      </div>

      <h3 className="mt-6 font-semibold text-blue-900 text-lg">{title}</h3>

      <p className="mt-3 text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
