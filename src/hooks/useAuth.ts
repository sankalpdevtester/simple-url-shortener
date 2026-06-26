import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.get('/api/me', { headers: { Authorization: storedToken } })
        .then(response => setUser(response.data))
        .catch(error => console.error(error));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/login', { email, password });
    const token = response.data.token;
    setToken(token);
    localStorage.setItem('token', token);
    const userResponse = await axios.get('/api/me', { headers: { Authorization: token } });
    setUser(userResponse.data);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await axios.post('/api/register', { email, password, name });
    const token = response.data.token;
    setToken(token);
    localStorage.setItem('token', token);
    const userResponse = await axios.get('/api/me', { headers: { Authorization: token } });
    setUser(userResponse.data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, token, login, register, logout };
};

export default useAuth;