import { motion } from "framer-motion";

interface PredictionBarProps {
  label: string;
  probability: number;
  index: number;
}

export function PredictionBar({ label, probability, index }: PredictionBarProps) {
  const percentage = Math.round(probability * 100);
  const isTopPrediction = index === 0;

  return (
    <motion.div
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
          className={`text-sm font-semibold tabular-nums ${
            isTopPrediction ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {percentage}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
          }}
          className={`h-full rounded-full ${
            isTopPrediction
              ? "bg-gradient-to-r from-primary to-accent"
              : "bg-muted-foreground/30"
          }`}
        />
      </div>
    </motion.div>
  );
}
