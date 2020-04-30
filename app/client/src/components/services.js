import axios from 'axios';
import { get } from 'lodash-es';

const API_URL = 'http://localhost:4000';

const handleAsyncError = handler => async payload => {
  try {
    return await handler(payload);
  } catch (e) {
    console.log('Error Occurred', get(e, 'response.data'));
    return { error: get(e, 'response.data') };
  }
};

export const auth = handleAsyncError(async payload => {
  const res = await axios.post(`${API_URL}/api/auth`, payload);
  return { data: res.data };
});

export const getRecommendations = handleAsyncError(async payload => {
  const res = await axios.get(`${API_URL}/api/recommendations`, { withCredentials: true });
  return { data: res.data };
});

export const submitEstimates = handleAsyncError(async payload => {
  const res = await axios.post(`${API_URL}/api/recommendations`, payload, {
    withCredentials: true,
  });
  return { data: res.data };
});

export const launchBot = handleAsyncError(async payload => {
  const res = await axios.post(`${API_URL}/api/bot/start`, payload, {
    withCredentials: true,
  });
  return { data: res.data };
});

export const stopBot = handleAsyncError(async payload => {
  const res = await axios.post(`${API_URL}/api/bot/stop`, payload, {
    withCredentials: true,
  });
  return { data: res.data };
});
