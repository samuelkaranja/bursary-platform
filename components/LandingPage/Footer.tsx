export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <p className="text-sm text-blue-200">+254 700 000 000</p>
          <p className="text-sm text-blue-200">bursary@constituency.go.ke</p>
          <p className="text-sm text-blue-200 mt-2">
            Constituency Office <br />
            Nairobi, Kenya
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-blue-200">
            <li>Home</li>
            <li>Apply Now</li>
            <li>Track Application</li>
            <li>About Us</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <p className="text-sm text-blue-200">
            Facebook • Twitter • Instagram
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-blue-800 pt-6 text-center text-sm text-blue-300">
        © 2026 Constituency Bursary Program. All rights reserved.
      </div>
    </footer>
  );
}
