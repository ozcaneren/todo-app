import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-borderColor border-dashed">
      <div className="px-4 py-5 container mx-auto bg-background border-r border-l border-borderColor border-dashed">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-text">Todo App</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm text-textSecondary hover:underline">
              Gizlilik Politikası
            </Link>
            <Link href="/terms-of-service" className="text-sm text-textSecondary hover:underline">
              Kullanım Şartları
            </Link>
            <Link href="/contact" className="text-sm text-textSecondary hover:underline">
              İletişim
            </Link>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <p className="text-sm text-textSecondary">© 2025 Todo App</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
