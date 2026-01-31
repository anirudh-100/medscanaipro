import { forwardRef } from "react";
import { motion } from "framer-motion";
import { History, Trash2, Clock, Camera, Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import type { ScanHistoryItem } from "@/hooks/useScanHistory";

interface ScanHistoryListProps {
  history: ScanHistoryItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onSelect: (item: ScanHistoryItem) => void;
}

export const ScanHistoryList = forwardRef<HTMLDivElement, ScanHistoryListProps>(
  ({ history, isLoading, onDelete, onSelect }, ref) => {
    if (isLoading) {
      return (
        <div ref={ref} className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-2 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      );
    }

    if (history.length === 0) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
            <History className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No scan history</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your classification results will appear here
          </p>
        </motion.div>
      );
    }

    return (
      <div ref={ref} className="space-y-3">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="medical-card p-4 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onSelect(item)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    item.scan_type === "camera"
                      ? "bg-primary/10"
                      : "bg-medical-green/10"
                  }`}
                >
                  {item.scan_type === "camera" ? (
                    <Camera className="h-5 w-5 text-primary" />
                  ) : (
                    <Upload className="h-5 w-5 text-medical-green" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">
                    {item.top_prediction}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-sm font-medium ${
                        item.top_confidence >= 0.7
                          ? "text-confidence-high"
                          : item.top_confidence >= 0.4
                          ? "text-confidence-medium"
                          : "text-confidence-low"
                      }`}
                    >
                      {Math.round(item.top_confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item);
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
);

ScanHistoryList.displayName = "ScanHistoryList";
