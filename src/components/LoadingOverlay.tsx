import { forwardRef } from "react";
import { motion } from "framer-motion";

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ message = "Loading AI Model..." }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-6 p-8">
          {/* Animated Medical Cross Loader */}
          <div className="relative">
            <motion.div
              className="h-20 w-20 rounded-2xl medical-gradient shadow-2xl flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 10px 40px rgba(0, 100, 200, 0.3)",
                  "0 15px 60px rgba(0, 100, 200, 0.5)",
                  "0 10px 40px rgba(0, 100, 200, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-10 w-10 text-primary-foreground"
              >
                <motion.path
                  d="M12 4v16M4 12h16"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </motion.div>
            
            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary/30"
              animate={{
                scale: [1, 1.3, 1.3],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary/20"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.4, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </div>

          <div className="text-center space-y-2">
            <motion.p
              className="text-lg font-semibold text-foreground"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {message}
            </motion.p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Initializing TensorFlow.js and downloading the diagnostic model
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
);

LoadingOverlay.displayName = "LoadingOverlay";
