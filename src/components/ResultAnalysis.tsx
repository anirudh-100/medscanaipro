import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfidenceBar } from "./ConfidenceBar";
import { Activity, AlertCircle, TrendingUp, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePDFReport } from "@/utils/pdfExport";
import type { Prediction } from "@/hooks/useClassifier";

interface ResultAnalysisProps {
  predictions: Prediction[];
  isProcessing: boolean;
  onSave?: () => void;
  canSave?: boolean;
}

export const ResultAnalysis = forwardRef<HTMLDivElement, ResultAnalysisProps>(
  ({ predictions, isProcessing, onSave, canSave = false }, ref) => {
    const hasPredictions = predictions.length > 0;
    const topPrediction = predictions[0];

    const getConfidenceLevel = (prob: number) => {
      if (prob >= 0.8) return { text: "High Confidence", color: "text-confidence-high" };
      if (prob >= 0.5) return { text: "Moderate Confidence", color: "text-confidence-medium" };
      return { text: "Low Confidence", color: "text-confidence-low" };
    };

    const handleExportPDF = () => {
      if (predictions.length > 0) {
        generatePDFReport({
          predictions,
          timestamp: new Date(),
          scanType: "camera",
        });
      }
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="medical-card p-5 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Result Analysis</h3>
          </div>
          {hasPredictions && (
            <div className="flex items-center gap-2">
              {canSave && onSave && (
                <Button variant="outline" size="sm" onClick={onSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center justify-center gap-4"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-muted border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Processing image...</p>
            </motion.div>
          ) : !hasPredictions ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center justify-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">No analysis yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start scanning or upload an image
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Top Prediction Card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Primary Finding
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {topPrediction.className}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        getConfidenceLevel(topPrediction.probability).color
                      }`}
                    >
                      {Math.round(topPrediction.probability * 100)}%
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        getConfidenceLevel(topPrediction.probability).color
                      }`}
                    >
                      {getConfidenceLevel(topPrediction.probability).text}
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 animate-pulse-ring" />
              </motion.div>

              {/* All Predictions */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  All Classifications
                </p>
                {predictions.map((prediction, index) => (
                  <ConfidenceBar
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
);

ResultAnalysis.displayName = "ResultAnalysis";
