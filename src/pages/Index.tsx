import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CameraInput } from "@/components/CameraInput";
import { FileUpload } from "@/components/FileUpload";
import { ResultAnalysis } from "@/components/ResultAnalysis";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { FeatureCards } from "@/components/FeatureCards";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { AppSidebar } from "@/components/AppSidebar";
import { useClassifier } from "@/hooks/useClassifier";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Index = () => {
  const {
    isLoading,
    error,
    predictions,
    isProcessing,
    isReady,
    classifyImage,
    startContinuousClassification,
    stopContinuousClassification,
  } = useClassifier();

  const { saveScan } = useScanHistory();
  const { user } = useAuth();

  const [isScanning, setIsScanning] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastScanType, setLastScanType] = useState<"camera" | "upload">("camera");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);

  const handleStartScan = useCallback(() => {
    if (videoRef.current) {
      setIsScanning(true);
      setLastScanType("camera");
      startContinuousClassification(videoRef.current);
    }
  }, [startContinuousClassification]);

  const handleStopScan = useCallback(() => {
    setIsScanning(false);
    stopContinuousClassification();
  }, [stopContinuousClassification]);

  const handleStopCamera = useCallback(() => {
    videoRef.current = null;
    setIsScanning(false);
  }, []);

  const handleCapture = useCallback(
    async (canvas: HTMLCanvasElement) => {
      setLastScanType("camera");
      const img = new Image();
      img.src = canvas.toDataURL();
      img.onload = () => {
        classifyImage(img);
      };
    },
    [classifyImage]
  );

  const handleImageUpload = useCallback(
    async (image: HTMLImageElement) => {
      setLastScanType("upload");
      await classifyImage(image);
    },
    [classifyImage]
  );

  const handleSaveScan = useCallback(async () => {
    if (predictions.length > 0 && user) {
      const result = await saveScan(predictions, lastScanType);
      if (result) {
        toast.success("Scan saved to history");
      } else {
        toast.error("Failed to save scan");
      }
    }
  }, [predictions, user, saveScan, lastScanType]);

  return (
    <div className="min-h-screen bg-background flex">
      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>

      {/* Sidebar */}
      <AppSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader isModelReady={isReady} isModelLoading={isLoading} />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  className="h-8 w-8 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-foreground">Failed to Load AI Model</p>
              <p className="text-sm text-muted-foreground text-center max-w-md">{error}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto space-y-6"
            >
              {/* Medical Disclaimer */}
              <MedicalDisclaimer />

              {/* Main Dashboard Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Input Methods */}
                <div className="space-y-6">
                  <CameraInput
                    onVideoReady={handleVideoReady}
                    onCapture={handleCapture}
                    onStopCamera={handleStopCamera}
                    isModelReady={isReady}
                    isScanning={isScanning}
                    onStartScan={handleStartScan}
                    onStopScan={handleStopScan}
                  />

                  <FileUpload onImageLoad={handleImageUpload} isModelReady={isReady} />
                </div>

                {/* Right Column - Results */}
                <div className="space-y-6">
                  <ResultAnalysis
                    predictions={predictions}
                    isProcessing={isProcessing}
                    onSave={handleSaveScan}
                    canSave={!!user && predictions.length > 0}
                  />
                </div>
              </div>

              {/* Feature Cards */}
              <FeatureCards />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
