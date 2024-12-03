import axios from 'axios';
import config from '../config';

const {
  PROTOCOL, AUTH_SUBDOMAIN, DOMAIN, TLD
} = config;

export const authAxios = axios.create({
  baseURL: `${PROTOCOL}://${AUTH_SUBDOMAIN}.${DOMAIN}.${TLD}`,
  withCredentials: true
});
