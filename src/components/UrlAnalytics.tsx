import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UrlAnalyticsProps {
  shortUrl: string;
}

const UrlAnalytics: React.FC<UrlAnalyticsProps> = ({ shortUrl }) => {
  const [analytics, setAnalytics] = useState({ clicks: 0, lastClicked: null });

  useEffect(() => {
    axios.get(`/analytics/${shortUrl}`)
      .then(response => {
        setAnalytics(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [shortUrl]);

  const handleIncrementClicks = () => {
    axios.post(`/analytics/${shortUrl}/click`)
      .then(() => {
        setAnalytics({ clicks: analytics.clicks + 1, lastClicked: new Date() });
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>URL Analytics</h2>
      <p>Short URL: {shortUrl}</p>
      <p>Clicks: {analytics.clicks}</p>
      <p>Last Clicked: {analytics.lastClicked ? analytics.lastClicked.toLocaleString() : 'Never'}</p>
      <button onClick={handleIncrementClicks}>Increment Clicks</button>
    </div>
  );
};

export default UrlAnalytics;