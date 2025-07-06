import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={60}
            height={40}
            className="object-contain"
          />
        </Link>
        <nav className="space-x-6 text-sm md:text-base font-medium">
          <Link href="/" className="hover:text-blue-200 transition">
            Home
          </Link>
          <Link href="/blog" className="hover:text-blue-200 transition">
            Blogs
          </Link>
          <Link href="/tag-list" className="hover:text-blue-200 transition">
            Tags
          </Link>
        </nav>
      </div>
    </header>
  );
}
