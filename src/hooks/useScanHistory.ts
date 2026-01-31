import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";
import type { Prediction } from "@/hooks/useClassifier";

export type ScanHistoryItem = Tables<"scan_history">;

export function useScanHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("scan_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching scan history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveScan = useCallback(
    async (predictions: Prediction[], scanType: "camera" | "upload", imageUrl?: string) => {
      if (!user || predictions.length === 0) return null;

      const topPrediction = predictions[0];

      try {
      const { data, error } = await supabase
        .from("scan_history")
        .insert({
          user_id: user.id,
          predictions: JSON.parse(JSON.stringify(predictions)),
          top_prediction: topPrediction.className,
          top_confidence: topPrediction.probability,
          scan_type: scanType,
          image_url: imageUrl || null,
        })
        .select()
        .single();

      if (error) throw error;

      setHistory((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        console.error("Error saving scan:", err);
        return null;
      }
    },
    [user]
  );

  const deleteScan = useCallback(
    async (scanId: string) => {
      if (!user) return false;

      try {
        const { error } = await supabase
          .from("scan_history")
          .delete()
          .eq("id", scanId);

        if (error) throw error;

        setHistory((prev) => prev.filter((item) => item.id !== scanId));
        return true;
      } catch (err) {
        console.error("Error deleting scan:", err);
        return false;
      }
    },
    [user]
  );

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    saveScan,
    deleteScan,
    refetch: fetchHistory,
  };
}
