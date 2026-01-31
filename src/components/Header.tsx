import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass sticky top-0 z-50 border-b border-border/50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                AI Image Classifier
              </h1>
              <p className="text-xs text-muted-foreground">
                Powered by TensorFlow.js
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
