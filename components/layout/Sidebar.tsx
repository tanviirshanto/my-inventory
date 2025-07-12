"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "../Navbar/NavLinks";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r p-6 hidden md:block">
      <h1 className="text-xl font-bold mb-8">🧾 Hira Enterprise</h1>
      <nav className="space-y-3">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`block rounded px-3 py-2 text-sm font-medium hover:bg-muted ${
              pathname === href ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-10">
        <ThemeToggle />
      </div>
    </aside>
  );
}
