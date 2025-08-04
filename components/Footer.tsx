export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} onepass.cz. Všechna práva vyhrazena.
        </p>
        <div className="flex space-x-4">
          <a href="/privacy" className="hover:text-white transition">
            Ochrana osobních údajů
          </a>
          <a href="/terms" className="hover:text-white transition">
            Podmínky použití
          </a>
          <a
            href="mailto:info@onepass.cz"
            className="hover:text-white transition"
          >
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}
