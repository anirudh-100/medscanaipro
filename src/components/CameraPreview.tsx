import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Scan, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraPreviewProps {
  onVideoReady: (video: HTMLVideoElement) => void;
  onStopCamera: () => void;
  isModelReady: boolean;
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
}

export function CameraPreview({
  onVideoReady,
  onStopCamera,
  isModelReady,
  isScanning,
  onStartScan,
  onStopScan,
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please grant camera permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    onStopScan();
    onStopCamera();
  }, [onStopCamera, onStopScan]);

  const handleVideoPlay = useCallback(() => {
    if (videoRef.current) {
      onVideoReady(videoRef.current);
    }
  }, [onVideoReady]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Camera Feed</h2>
        </div>
        {isCameraActive && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        )}
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
        <AnimatePresence mode="wait">
          {!isCameraActive ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <CameraOff className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Camera is not active
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onPlay={handleVideoPlay}
                className="h-full w-full object-cover"
              />
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-primary/50 rounded-lg" />
                  <motion.div
                    className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ top: ["1rem", "calc(100% - 1rem)", "1rem"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {cameraError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm"
          >
            <p className="text-sm text-destructive text-center px-4">
              {cameraError}
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex gap-3">
        {!isCameraActive ? (
          <Button
            onClick={startCamera}
            disabled={!isModelReady}
            className="flex-1"
            size="lg"
          >
            <Camera className="h-4 w-4 mr-2" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button
              onClick={stopCamera}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
            <Button
              onClick={isScanning ? onStopScan : onStartScan}
              variant={isScanning ? "destructive" : "default"}
              size="lg"
              className="flex-1"
            >
              {isScanning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Scan
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Start Scan
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
