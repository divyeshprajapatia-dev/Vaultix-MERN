import axios from 'axios';

const API = '/api/files';

export async function uploadFileApi(file, description, token, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', file);
  if (description) formData.append('description', description);
  const res = await axios.post(`${API}/upload`, formData, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress,
  });
  return res.data;
}

export async function listFilesApi(token, params = {}) {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
}

export async function deleteFileApi(id, token) {
  const res = await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getShareLinkApi(id, token) {
  const res = await axios.post(`/api/files/${id}/share`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}