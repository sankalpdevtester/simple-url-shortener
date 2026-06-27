import React from 'react';
import { useShortenUrl } from '../hooks/useShortenUrl';

interface ShortenedUrlDisplayProps {
  originalUrl: string;
}

const ShortenedUrlDisplay: React.FC<ShortenedUrlDisplayProps> = ({ originalUrl }) => {
  const { shortenedUrl, error } = useShortenUrl({ originalUrl });

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!shortenedUrl) {
    return <p>Shortening URL...</p>;
  }

  return (
    <p>
      Shortened URL: <a href={shortenedUrl}>{shortenedUrl}</a>
    </p>
  );
};

export { ShortenedUrlDisplay };