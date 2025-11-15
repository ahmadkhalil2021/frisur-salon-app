import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-10 text-center mt-auto">
      <p className="text-sm md:text-base">
        &copy; {new Date().getFullYear()} Salon Eleganz – Alle Rechte
        vorbehalten.
      </p>
      <div className="flex justify-center space-x-6 mt-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200 hover:text-white transition"
        >
          <FaFacebook size={20} />
        </a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200 hover:text-white transition"
        >
          <FaTwitter size={20} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200 hover:text-white transition"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200 hover:text-white transition"
        >
          <FaLinkedin size={20} />
        </a>
      </div>
    </footer>
  );
}
