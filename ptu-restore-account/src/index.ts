export { Components, JSX } from './components';
import axios from 'axios';

let nextClientId: string;
if (localStorage.getItem('X-CLIENT-ID') != null) {
  nextClientId = localStorage.getItem('X-CLIENT-ID');
}

const request = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

// Handle getting and setting the client ID
request.interceptors.request.use(config => {
  config.headers['x-client-id'] = nextClientId;
  return config;
});

request.interceptors.response.use(response => {
  nextClientId = response.headers['x-client-id'];
  localStorage.setItem('X-CLIENT-ID', nextClientId);
  return response
});

export { request };
