import { useCallback, useEffect, useRef, useState } from "react";

const useImageValidation = (initialUrl = "") => {
  const [url, setUrl] = useState(initialUrl);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef(null);

  const validateImage = useCallback((imageUrl) => {
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
    }

    if (!imageUrl || imageUrl.trim() === "") {
      setIsValid(false);
      setIsLoading(false);
      setError("");
      return;
    }

    setIsLoading(true);
    setError("");
    
    const img = new Image();
    imageRef.current = img;
    
    img.onload = () => {
      if (imageRef.current === img) {
        setIsValid(true);
        setIsLoading(false);
        setError("");
      }
    };
    
    img.onerror = () => {
      if (imageRef.current === img) {
        setIsValid(false);
        setIsLoading(false);
        setError("Invalid image URL");
      }
    };
    
    img.src = imageUrl.trim();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateImage(url);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [url, validateImage]);

  const updateUrl = (newUrl) => {
    setUrl(newUrl);
  };

  return { url, updateUrl, isValid, isLoading, error };
};

export default useImageValidation;