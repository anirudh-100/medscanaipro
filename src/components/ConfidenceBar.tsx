import { forwardRef } from "react";
import { motion } from "framer-motion";

interface ConfidenceBarProps {
  label: string;
  probability: number;
  index: number;
}

export const ConfidenceBar = forwardRef<HTMLDivElement, ConfidenceBarProps>(
  ({ label, probability, index }, ref) => {
    const percentage = Math.round(probability * 100);
    const isTopPrediction = index === 0;

    const getConfidenceColor = (prob: number) => {
      if (prob >= 0.7) return "bg-confidence-high";
      if (prob >= 0.4) return "bg-confidence-medium";
      return "bg-confidence-low";
    };

    const getConfidenceGradient = (prob: number) => {
      if (prob >= 0.7) return "from-confidence-high to-medical-green";
      if (prob >= 0.4) return "from-confidence-medium to-yellow-400";
      return "from-confidence-low to-red-400";
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              isTopPrediction ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
          <span
            className={`text-sm font-bold tabular-nums ${
              isTopPrediction ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {percentage}%
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: 0.6,
              ease: [0.32, 0.72, 0, 1],
            }}
            className={`h-full rounded-full ${
              isTopPrediction
                ? `bg-gradient-to-r ${getConfidenceGradient(probability)}`
                : "bg-muted-foreground/30"
            }`}
          />
        </div>
      </motion.div>
    );
  }
);

ConfidenceBar.displayName = "ConfidenceBar";
