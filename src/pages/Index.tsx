import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CameraInput } from "@/components/CameraInput";
import { FileUpload } from "@/components/FileUpload";
import { ResultAnalysis } from "@/components/ResultAnalysis";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { FeatureCards } from "@/components/FeatureCards";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useClassifier } from "@/hooks/useClassifier";

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

  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);

  const handleStartScan = useCallback(() => {
    if (videoRef.current) {
      setIsScanning(true);
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
      // Create an image from canvas for classification
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
      await classifyImage(image);
    },
    [classifyImage]
  );

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>

      <DashboardHeader isModelReady={isReady} isModelLoading={isLoading} />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
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
          <>
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
                <ResultAnalysis predictions={predictions} isProcessing={isProcessing} />
              </div>
            </div>

            {/* Feature Cards */}
            <FeatureCards />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
