import axios, { AxiosError, AxiosResponse } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

interface AxiosErrorResponse {
  code?: number;
  message?: string;
}

let isRefreshing = false;
let failedRequestQueue = [];

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL:
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_URL_DEVELOPMENT
        : process.env.NEXT_PUBLIC_URL_PRODUCTION,
    headers: {
      Authorization: `Bearer ${cookies.token}`,
    },
  });

  api.defaults.headers.Authorization = `Bearer ${cookies['sortui.token']}`;

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<AxiosErrorResponse>) => {
      if (error.response?.status === 401) {
        if (error.response.data.message === 'Token expired') {
          cookies = parseCookies(ctx);

          const { 'sortui.refreshToken': refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post('sessions/refresh-token', { token: refreshToken })
              .then((response: AxiosResponse) => {
                // eslint-disable-next-line camelcase
                const { token, refresh_token } = response.data;

                setCookie(ctx, 'sortui.token', token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                });

                setCookie(ctx, 'sortui.refreshToken', refresh_token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                });

                api.defaults.headers.Authorization = `Bearer ${token}`;

                failedRequestQueue.forEach((request) =>
                  request.onSuccess(token),
                );
                failedRequestQueue = [];
              })
              .catch((error) => {
                failedRequestQueue.forEach((request) =>
                  request.onFailure(error),
                );
                failedRequestQueue = [];

                if (typeof window !== 'undefined') {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                // eslint-disable-next-line dot-notation
                originalConfig.headers['Authorization'] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          if (typeof window !== 'undefined') {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}
