import { useState, useEffect, useCallback, useRef } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/a1bD7wpur/";

export interface Prediction {
  className: string;
  probability: number;
}

export function useClassifier() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isClassifyingRef = useRef(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
      } catch (err) {
        console.error("Failed to load model:", err);
        setError("Failed to load the AI model. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  const classify = useCallback(
    async (element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => {
      if (!model || isClassifyingRef.current) return;
      
      try {
        isClassifyingRef.current = true;
        const result = await model.predict(element);
        setPredictions(
          result
            .map((p) => ({
              className: p.className,
              probability: p.probability,
            }))
            .sort((a, b) => b.probability - a.probability)
        );
      } catch (err) {
        console.error("Classification error:", err);
      } finally {
        isClassifyingRef.current = false;
      }
    },
    [model]
  );

  const startContinuousClassification = useCallback(
    (videoElement: HTMLVideoElement) => {
      const loop = async () => {
        if (videoElement.readyState === 4) {
          await classify(videoElement);
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    },
    [classify]
  );

  const stopContinuousClassification = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopContinuousClassification();
    };
  }, [stopContinuousClassification]);

  return {
    model,
    isLoading,
    error,
    predictions,
    classify,
    startContinuousClassification,
    stopContinuousClassification,
    isReady: !!model && !isLoading,
  };
}
