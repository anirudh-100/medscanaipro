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
  const [isProcessing, setIsProcessing] = useState(false);
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
      if (!model || isClassifyingRef.current) return null;
      
      try {
        isClassifyingRef.current = true;
        setIsProcessing(true);
        const result = await model.predict(element);
        const sortedPredictions = result
          .map((p) => ({
            className: p.className,
            probability: p.probability,
          }))
          .sort((a, b) => b.probability - a.probability);
        
        setPredictions(sortedPredictions);
        return sortedPredictions;
      } catch (err) {
        console.error("Classification error:", err);
        return null;
      } finally {
        isClassifyingRef.current = false;
        setIsProcessing(false);
      }
    },
    [model]
  );

  const classifyImage = useCallback(
    async (imageElement: HTMLImageElement) => {
      if (!model) return null;
      
      setIsProcessing(true);
      try {
        const result = await model.predict(imageElement);
        const sortedPredictions = result
          .map((p) => ({
            className: p.className,
            probability: p.probability,
          }))
          .sort((a, b) => b.probability - a.probability);
        
        setPredictions(sortedPredictions);
        return sortedPredictions;
      } catch (err) {
        console.error("Classification error:", err);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [model]
  );

  const startContinuousClassification = useCallback(
    (videoElement: HTMLVideoElement) => {
      const loop = async () => {
        if (videoElement.readyState === 4 && !isClassifyingRef.current) {
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

  const clearPredictions = useCallback(() => {
    setPredictions([]);
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
    isProcessing,
    classify,
    classifyImage,
    startContinuousClassification,
    stopContinuousClassification,
    clearPredictions,
    isReady: !!model && !isLoading,
  };
}
