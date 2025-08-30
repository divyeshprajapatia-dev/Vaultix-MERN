import axios from 'axios';

const API = '/api/auth';

export async function loginApi(email, password) {
  const res = await axios.post(`${API}/login`, { email, password });
  return res.data;
}

export async function registerApi(name, email, password) {
  const res = await axios.post(`${API}/register`, { name, email, password });
  return res.data;
}

export async function getMe(token) {
  const res = await axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}