import config from '@/config';
import axios from 'axios';

const { PROTOCOL, AUTH_SUBDOMAIN, DOMAIN, TLD } = config;

export const authAxios = axios.create({
  baseURL: `${PROTOCOL}://${AUTH_SUBDOMAIN}.${DOMAIN}.${TLD}`,
  withCredentials: true
});
