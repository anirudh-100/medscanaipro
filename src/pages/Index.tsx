import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { CameraPreview } from "@/components/CameraPreview";
import { ClassificationResults } from "@/components/ClassificationResults";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useClassifier } from "@/hooks/useClassifier";
import { AlertCircle, Cpu, Zap, Shield } from "lucide-react";

const Index = () => {
  const {
    isLoading,
    error,
    predictions,
    isReady,
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-6"
          >
            <LoadingSpinner size="lg" text="Loading AI Model..." />
            <div className="glass-subtle rounded-xl p-4 max-w-md text-center">
              <p className="text-sm text-muted-foreground">
                Initializing TensorFlow.js and downloading the classification model.
                This may take a moment on first load.
              </p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-lg font-medium text-foreground">
              Failed to Load Model
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {error}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Real-time Image Classification
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Point your camera at any object to classify it using our AI model.
                The predictions update in real-time with confidence scores.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              <CameraPreview
                onVideoReady={handleVideoReady}
                onStopCamera={handleStopCamera}
                isModelReady={isReady}
                isScanning={isScanning}
                onStartScan={handleStartScan}
                onStopScan={handleStopScan}
              />

              <ClassificationResults
                predictions={predictions}
                isClassifying={isScanning}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid gap-4 md:grid-cols-3"
            >
              <div className="glass-subtle rounded-xl p-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">On-Device AI</h3>
                  <p className="text-sm text-muted-foreground">
                    All processing happens locally in your browser
                  </p>
                </div>
              </div>

              <div className="glass-subtle rounded-xl p-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Real-time</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant predictions as you scan objects
                  </p>
                </div>
              </div>

              <div className="glass-subtle rounded-xl p-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Private</h3>
                  <p className="text-sm text-muted-foreground">
                    No images are sent to external servers
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
