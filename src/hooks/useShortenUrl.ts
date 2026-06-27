import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseShortenUrlOptions {
  originalUrl: string;
}

const useShortenUrl = ({ originalUrl }: UseShortenUrlOptions) => {
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const shortenUrl = async () => {
      try {
        const response = await axios.post('/api/shorten', { originalUrl });
        const shortenedUrl = response.data.shortenedUrl;
        setShortenedUrl(shortenedUrl);
      } catch (error) {
        setError(error.message);
      }
    };
    shortenUrl();
  }, [originalUrl]);

  return { shortenedUrl, error };
};

export { useShortenUrl };