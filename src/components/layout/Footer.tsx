export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-sub text-sm">
          &copy; {new Date().getFullYear()} HY - 山本浩裕
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-sub hover:text-neon-blue transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
