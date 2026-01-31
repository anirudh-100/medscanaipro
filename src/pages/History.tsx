import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ScanHistoryList } from "@/components/ScanHistoryList";
import { useScanHistory } from "@/hooks/useScanHistory";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export default function HistoryPage() {
  const { history, isLoading, deleteScan } = useScanHistory();
  const navigate = useNavigate();
  useTheme();

  const handleSelect = (item: any) => {
    // Could open a detail modal or navigate to detail page
    console.log("Selected scan:", item);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your previous classifications
          </p>
        </div>
      </motion.div>

      <ScanHistoryList
        history={history}
        isLoading={isLoading}
        onDelete={deleteScan}
        onSelect={handleSelect}
      />
    </div>
  );
}
