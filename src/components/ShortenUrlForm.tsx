import React, { useState } from 'react';
import axios from 'axios';

interface ShortenUrlFormProps {
  onShortenUrl: (shortenedUrl: string) => void;
}

const ShortenUrlForm: React.FC<ShortenUrlFormProps> = ({ onShortenUrl }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/shorten', { originalUrl });
      const shortenedUrl = response.data.shortenedUrl;
      onShortenUrl(shortenedUrl);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Original URL:
        <input type="text" value={originalUrl} onChange={(event) => setOriginalUrl(event.target.value)} />
      </label>
      <button type="submit">Shorten URL</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export { ShortenUrlForm };