'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>© {year} Agrobaz Market. All rights reserved.</p>
        <div className="flex gap-6 justify-center mt-4 text-sm">
          <a href="#" className="hover:text-amber-400">Privacy</a>
          <a href="#" className="hover:text-amber-400">Terms</a>
          <a href="#" className="hover:text-amber-400">Contact</a>
        </div>
      </div>
    </footer>
  );
}
