import Axios, { AxiosError } from 'axios';

const axios = Axios.create();

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (e: AxiosError<any>) => {
    // add logger
    return Promise.reject(e);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (e: AxiosError<any>) => {
    // add logger
    let errorMapped: Array<{ message: string }> = [];
    let errors: Array<string> = [];
    try {
      errorMapped = JSON.parse(e.response?.data?.error || '') as Array<{
        message: string;
      }>;
      errors = errorMapped.map((er) => er.message);
    } catch (_) {
      errors.push(e.response?.data.error || `Couldn't sign you in!`);
    }
    // errors.forEach((e) => showErrorAlert(e));
    return Promise.reject(errors);
  }
);

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

export default axios;
