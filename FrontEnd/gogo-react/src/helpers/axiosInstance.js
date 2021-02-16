import axios from 'axios';

const Instance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}`,
  credentials: 'include',
  withCredentials: true,
});

export default Instance;
