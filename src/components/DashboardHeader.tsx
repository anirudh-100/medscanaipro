import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface DashboardHeaderProps {
  isModelReady: boolean;
  isModelLoading: boolean;
}

export const DashboardHeader = forwardRef<HTMLDivElement, DashboardHeaderProps>(
  ({ isModelReady, isModelLoading }, ref) => {
    const { theme, toggleTheme } = useTheme();

    return (
      <motion.header
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl medical-gradient shadow-lg">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  MedScan AI Pro
                </h1>
                <p className="text-xs text-muted-foreground">
                  Radiology Decision Support Tool
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Model Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                <span
                  className={`relative flex h-2 w-2 ${
                    isModelLoading ? "animate-pulse" : ""
                  }`}
                >
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full ${
                      isModelReady
                        ? "bg-medical-green"
                        : isModelLoading
                        ? "bg-medical-warning animate-ping"
                        : "bg-destructive"
                    } opacity-75`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isModelReady
                        ? "bg-medical-green"
                        : isModelLoading
                        ? "bg-medical-warning"
                        : "bg-destructive"
                    }`}
                  />
                </span>
                <span className="text-xs font-medium text-secondary-foreground">
                  {isModelReady ? "AI Ready" : isModelLoading ? "Loading..." : "Error"}
                </span>
              </div>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="relative h-10 w-10 rounded-xl bg-secondary flex items-center justify-center transition-colors hover:bg-muted border border-border"
                whileTap={{ scale: 0.95 }}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <Sun className="h-5 w-5 text-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
    );
  }
);

DashboardHeader.displayName = "DashboardHeader";
