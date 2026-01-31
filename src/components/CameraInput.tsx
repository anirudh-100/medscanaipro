import { forwardRef, useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, Scan, Square, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraInputProps {
  onVideoReady: (video: HTMLVideoElement) => void;
  onCapture: (canvas: HTMLCanvasElement) => void;
  onStopCamera: () => void;
  isModelReady: boolean;
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
}

export const CameraInput = forwardRef<HTMLDivElement, CameraInputProps>(
  ({ onVideoReady, onCapture, onStopCamera, isModelReady, isScanning, onStartScan, onStopScan }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);

    const startCamera = useCallback(async () => {
      try {
        setCameraError(null);
        setIsInitializing(true);
        
        // Check if mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera not supported in this browser");
        }
        
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
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              setIsCameraActive(true);
              setIsInitializing(false);
            }).catch((err) => {
              console.error("Error playing video:", err);
              setIsInitializing(false);
            });
          };
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setIsInitializing(false);
        
        if (err.name === "NotAllowedError") {
          setCameraError("Camera access denied. Please grant camera permissions in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setCameraError("No camera found. Please connect a camera and try again.");
        } else if (err.name === "NotSupportedError" || err.message?.includes("not supported")) {
          setCameraError("Camera is not supported in this browser. Try using Chrome or Firefox.");
        } else {
          setCameraError(`Unable to access camera: ${err.message || "Unknown error"}`);
        }
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

    const captureFrame = useCallback(() => {
      if (videoRef.current && canvasRef.current && isCameraActive) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Ensure video has valid dimensions
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            onCapture(canvas);
          }
        }
      }
    }, [onCapture, isCameraActive]);

    const handleVideoPlay = useCallback(() => {
      if (videoRef.current) {
        onVideoReady(videoRef.current);
      }
    }, [onVideoReady]);

    useEffect(() => {
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };
    }, []);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="medical-card p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Camera className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Live Camera</h3>
          </div>
          {isCameraActive && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-green" />
              </span>
              <span className="text-xs text-muted-foreground font-medium">Live</span>
            </div>
          )}
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          {!isCameraActive && !isInitializing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <CameraOff className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Camera not active</p>
            </div>
          ) : isInitializing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 border-2 border-muted border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Starting camera...</p>
            </div>
          ) : (
            <>
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
                  <div className="absolute inset-3 border-2 border-primary/40 rounded-lg" />
                  <div className="absolute inset-3 scan-line h-1 animate-scan-line" />
                  <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary rounded-tl" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary rounded-tr" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary rounded-bl" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary rounded-br" />
                </div>
              )}
            </>
          )}

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm p-4">
              <p className="text-sm text-destructive text-center">{cameraError}</p>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-2">
          {!isCameraActive ? (
            <Button 
              onClick={startCamera} 
              disabled={!isModelReady || isInitializing} 
              className="flex-1" 
              size="lg"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isInitializing ? "Starting..." : "Start Camera"}
            </Button>
          ) : (
            <>
              <Button onClick={stopCamera} variant="secondary" size="lg" className="flex-1">
                <CameraOff className="h-4 w-4 mr-2" />
                Stop
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
                    Live Scan
                  </>
                )}
              </Button>
              <Button onClick={captureFrame} variant="outline" size="lg" title="Capture Frame">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </motion.div>
    );
  }
);

CameraInput.displayName = "CameraInput";
