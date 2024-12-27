export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-12 py-6 transition-colors duration-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} APS NAV.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          创意来源:{" "}
          <a
            href="https://github.com/TaylorAndTony/CatgirlGenerator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            TaylorAndTony
          </a>
        </p>
      </div>
    </footer>
  );
}
