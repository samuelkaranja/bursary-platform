import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <span className="inline-block bg-orange-500 text-xs font-medium px-4 py-1.5 rounded-full">
            Applications Open for 2026
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
            Kandara Constituency Bursary Program 2026
          </h1>

          <p className="mt-6 text-blue-100 max-w-xl text-sm md:text-base">
            Empowering students through education. Our bursary program is
            committed to supporting deserving students in achieving their
            academic dreams.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/application"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-md font-medium transition"
            >
              Apply Now
            </Link>

            <Link
              href="/login"
              className="border border-white/40 hover:bg-white hover:text-blue-900 px-6 py-3 rounded-md transition"
            >
              Track Application
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex justify-center">
          <div className="relative w-[280px] md:w-[350px] h-[380px] rounded-xl overflow-hidden border border-white/20 shadow-2xl">
            <Image
              src="/Hon-Chege-Njuguna.png"
              alt="Member of Parliament"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-4 bg-white text-blue-900 text-xs px-4 py-2 rounded-full shadow-md">
            Hon. Member of Parliament Kandara Constituency - Chege Njuguna
          </div>
        </div>
      </div>
    </section>
  );
}
