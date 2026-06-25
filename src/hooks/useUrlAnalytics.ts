import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseUrlAnalytics {
  shortUrl: string;
}

const useUrlAnalytics = ({ shortUrl }: UseUrlAnalytics) => {
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

  const incrementClicks = async () => {
    await axios.post(`/analytics/${shortUrl}/click`);
    setAnalytics({ clicks: analytics.clicks + 1, lastClicked: new Date() });
  };

  return { analytics, incrementClicks };
};

export default useUrlAnalytics;