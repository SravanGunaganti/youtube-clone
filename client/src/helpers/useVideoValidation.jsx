import { useCallback, useEffect, useRef, useState } from "react";

const useVideoValidation = (initialUrl = "") => {
  const [url, setUrl] = useState(initialUrl);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  const validateVideo = useCallback((videoUrl) => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = null;
      videoRef.current.onerror = null;
    }

    if (!videoUrl || videoUrl.trim() === "") {
      setIsValid(false);
      setIsLoading(false);
      setError("");
      return;
    }

    setIsLoading(true);
    setError("");
    
    const video = document.createElement('video');
    videoRef.current = video;
    
    video.onloadeddata = () => {
      if (videoRef.current === video) {
        setIsValid(true);
        setIsLoading(false);
        setError("");
      }
    };
    
    video.onerror = () => {
      if (videoRef.current === video) {
        setIsValid(false);
        setIsLoading(false);
        setError("Invalid video URL");
      }
    };
    
    video.src = videoUrl.trim();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateVideo(url);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [url, validateVideo]);

  const updateUrl = (newUrl) => {
    setUrl(newUrl);
  };

  return { url, updateUrl, isValid, isLoading, error };
};

export default useVideoValidation;