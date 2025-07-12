"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const navLinks = [ 
  { label: "Home", href: "/" },
  { label: "Stock Entry", href: "/stock-entry" },
  { label: "Due Transaction", href: "/due-transaction" },
  { label: "Stock", href: "/stock" },
  { label: "Products", href: "/product" },
  { label: "Monthly Sales", href: "/monthly-sales" },
  { label: "Parties", href: "/party" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl font-bold tracking-tight">📊 Hira Enterprise</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          A lightweight ERP dashboard to manage your inventory, sales, parties, dues, and transactions — all in one place.
        </p>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {navLinks
          .filter((link) => link.href !== "/")
          .map((link) => (
            <Card
              key={link.href}
              className="transition hover:shadow-lg hover:border-primary"
            >
              <CardHeader>
                <CardTitle className="text-xl">{link.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={link.href}>Go to {link.label}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-16">
        Built with ❤️ by tanvir hossen shanto
      </div>
    </main>
  );
}
