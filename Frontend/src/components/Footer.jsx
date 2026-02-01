const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-white/5 text-sm">
      {/* App Name */}
      <div className="mb-2 text-white font-semibold text-base">
        Travel Guide AI
      </div>

      {/* App Description */}
      <p className="max-w-xl mx-auto mb-4 text-slate-400 text-xs leading-relaxed">
        Travel Guide AI is an intelligent trip planning platform that helps
        users create personalized itineraries, discover destinations, and plan
        smarter journeys using AI-powered recommendations.
      </p>

      {/* Social Links */}
      <div className="flex justify-center gap-6 mb-4 text-xs">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition"
        >
          Instagram
        </a>

        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition"
        >
          LinkedIn
        </a>

        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition"
        >
          GitHub
        </a>
      </div>

      {/* Copyright */}
      <div className="text-xs text-slate-500">
        © 2026 Travel Guide AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
