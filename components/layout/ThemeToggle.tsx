"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-full"
    >
      {theme === "light" ? <Moon className="mr-2" /> : <Sun className="mr-2" />}
      Toggle {theme === "light" ? "Dark" : "Light"} Mode
    </Button>
  );
}
