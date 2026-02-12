"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Who is eligible to apply for the bursary?",
      answer:
        "Students residing in the constituency who demonstrate financial need and are enrolled in secondary school, college, or university are eligible to apply.",
    },
    {
      question: "What documents do I need to apply?",
      answer:
        "You will need identification documents, admission letter or student ID, and other required supporting documents depending on your education level.",
    },
    {
      question: "When will I know if my application is approved?",
      answer:
        "Applicants will be notified through SMS or email after the review process is completed.",
    },
    {
      question: "How do I track my application?",
      answer:
        "You can track your application status using the tracking number provided after submission.",
    },
    {
      question: "Can I apply if I'm already receiving another bursary?",
      answer:
        "Yes, but you must declare any other financial assistance during the application process.",
    },
    {
      question: "What if I make a mistake in my application?",
      answer:
        "You can contact the constituency office immediately to request corrections before the application deadline.",
    },
  ];

  return (
    <section className="py-24 bg-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-gray-600 text-sm md:text-base">
            Find answers to common questions about the bursary program
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <span className="text-sm md:text-base font-medium text-gray-800">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
