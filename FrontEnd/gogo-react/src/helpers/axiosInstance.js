import axios from 'axios';

const Instance = axios.create({
  credentials: 'include',
});

export default Instance;
