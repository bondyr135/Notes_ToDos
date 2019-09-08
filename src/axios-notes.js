import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://project-name.firebaseio.com'
});

export default instance;