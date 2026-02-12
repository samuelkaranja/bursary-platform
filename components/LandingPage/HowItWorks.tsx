export default function HowItWorks() {
  const steps = [
    {
      title: "Select Education Level",
      desc: "Choose between Secondary or University/College",
    },
    {
      title: "Fill Application Form",
      desc: "Complete personal and parent/guardian details",
    },
    {
      title: "Upload Documents",
      desc: "Submit required certificates and identification",
    },
    {
      title: "Review & Submit",
      desc: "Verify your information and submit application",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-900">How It Works</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Simple 4-step process to apply for your bursary
        </p>

        <div className="relative mt-14">
          {/* Horizontal line */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-[2px] bg-gray-200"></div>

          <div className="grid md:grid-cols-4 gap-10 relative">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold relative z-10">
                  {i + 1}
                </div>
                <h4 className="mt-4 font-medium text-blue-900 text-lg">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
