import React, { useState } from 'react';
import axios from 'axios';

const ShortenUrl = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/api/shorten?url=${url}`);
      setShortenedUrl(response.data.shortenedUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} />
      <button type="submit">Shorten URL</button>
      {shortenedUrl && <p>Shortened URL: {shortenedUrl}</p>}
    </form>
  );
};

export default ShortenUrl;