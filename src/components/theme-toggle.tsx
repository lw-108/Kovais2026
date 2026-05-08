import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      className={cn(
        "rounded-full p-2 border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center",
        "w-10 h-10"
      )}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="size-5 text-yellow-400" />
      ) : (
        <Moon className="size-5 text-gray-700" />
      )}
    </button>
  );
}
