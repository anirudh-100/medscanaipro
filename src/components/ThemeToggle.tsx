import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="glass relative h-10 w-10 rounded-full flex items-center justify-center transition-colors hover:bg-secondary"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 180 : 0,
          scale: theme === "dark" ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-foreground" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? -180 : 0,
          scale: theme === "light" ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-foreground" />
      </motion.div>
    </motion.button>
  );
}
