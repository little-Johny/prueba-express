import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3060/api/',
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json'
  }
});

