import { motion, AnimatePresence } from "framer-motion";
import { PredictionBar } from "./PredictionBar";
import { Sparkles } from "lucide-react";
import type { Prediction } from "@/hooks/useClassifier";

interface ClassificationResultsProps {
  predictions: Prediction[];
  isClassifying: boolean;
}

export function ClassificationResults({
  predictions,
  isClassifying,
}: ClassificationResultsProps) {
  const hasPredictions = predictions.length > 0;
  const topPrediction = predictions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Classification Results
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {!isClassifying && !hasPredictions ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8 text-center"
          >
            <p className="text-muted-foreground">
              Start the camera and begin scanning to see results
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {hasPredictions && (
              <motion.div
                key={topPrediction.className}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4 glass-subtle rounded-xl"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Best Match
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {topPrediction.className}
                </p>
                <p className="text-primary font-semibold">
                  {Math.round(topPrediction.probability * 100)}% confidence
                </p>
              </motion.div>
            )}

            <div className="space-y-3">
              {predictions.map((prediction, index) => (
                <PredictionBar
                  key={prediction.className}
                  label={prediction.className}
                  probability={prediction.probability}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
