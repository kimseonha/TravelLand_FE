import { AxiosResponse } from 'axios';
import { instance, instanceWithToken } from './axios';
import { TripData, TripListParams } from './interfaces/reviewInterface';
import { Cookies } from 'react-cookie';

// 여행 정보 등록
export const createTrip = async (formData: FormData): Promise<TripData> => {
  try {
    const response = await instanceWithToken.post('/v1/trips', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as TripData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 여행 정보 목록 조회
export const getTripList = async (tripListparam: TripListParams) => {
  const { page, size, sortBy, isAsc } = tripListparam;
  try {
    const response = await instance.get('/v1/trips', {
      params: { page, size, sortBy, isAsc },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 여행 정보 수정
export const updateTrip = async (
  tripId: number,
  formData: FormData,
): Promise<AxiosResponse<any>> => {
  try {
    const response = await instanceWithToken.put(
      `/v1/trips/${tripId}`,
      formData,
      {
        headers: {
          // 'Content-Type': 'multipart/form-data'은 설정하지 않습니다.
          // FormData와 함께 사용하는 경우 브라우저가 자동으로 필요한 헤더를 설정합니다.
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 여행 정보 상세 보기
export const getTripDetail = async (
  tripId: number,
): Promise<AxiosResponse<any>> => {
  const cookie = new Cookies();
  try {
    if (cookie.get('Authorization')) {
      return await instanceWithToken.get(`/v1/trips/${tripId}`);
    } else {
      return await instance.get(`/v1/trips/${tripId}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 여행 정보 삭제
export const deleteTrip = async (
  tripId: number,
): Promise<AxiosResponse<any>> => {
  try {
    const response = await instanceWithToken.delete(`/v1/trips/${tripId}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 여행정보 좋아요 등록
export const createLikeTrip = async (tripId: number) => {
  try {
    return await instanceWithToken.post(`/v1/trips/${tripId}/like`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//여행정보 좋아요 취소
export const cancelLikeTrip = async (tripId: number) => {
  try {
    return await instanceWithToken.delete(`/v1/trips/${tripId}/like`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 여행정보 스크랩 등록
export const createScrapTrip = async (tripId: number) => {
  try {
    return await instanceWithToken.post(`/v1/trips/${tripId}/scrap`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 여행정보 스크랩 취소
export const cancelScrapTrip = async (tripId: number) => {
  try {
    return await instanceWithToken.delete(`/v1/trips/${tripId}/scrap`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 여행 상세보기 -> 좋아요 기반 여행글 추천 조회!

export const getRecommendedTrips = async (
  tripId: number,
): Promise<AxiosResponse<any>> => {
  try {
    const response = await instance.get(`/v1/trips/${tripId}/recommend`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
