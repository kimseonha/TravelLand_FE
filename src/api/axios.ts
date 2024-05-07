import axios from 'axios';

import { Cookies } from 'react-cookie';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

const cookies = new Cookies();

// 헤더가 필요한 인스턴스
export const instanceWithToken = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
});

// interceptor로 해야함
instanceWithToken.interceptors.request.use(
  (config) => {
    const token = cookies.get('Authorization');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// // 응답 인터셉터
instanceWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (400 <= error.response.status) {
      // 에러 코드 메세지 반환
      if (
        error.response.data.message === undefined ||
        error.response.data.message === null
      ) {
        alert(
          '불러오기에 에러 발생했습니다 : ' +
            error.response.data.error +
            ' : ' +
            error.response.data.status,
        );
      } else {
        alert(error.response.data.message);
      }
    }
    return Promise.reject(error);
  },
);

// 여행 정보 인스턴스
export const instanceWithReview = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  },
});
