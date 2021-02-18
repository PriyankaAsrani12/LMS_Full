import axios from 'axios';

const Instance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:5000`,
  credentials: 'include',
  withCredentials: true,
});

export default Instance;
