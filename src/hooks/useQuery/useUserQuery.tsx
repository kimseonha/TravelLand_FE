import { PlanListParams } from '@/api/interfaces/planInterface';
import {
  MypageReviewParams,
  TripListParams,
} from '@/api/interfaces/reviewInterface';
import {
  getUserInfo,
  getMypageTrip,
  getScrapTripList,
  getMyPlanList,
  getMyTripList,
} from '@/api/userAxios';
import { useQuery } from '@tanstack/react-query';

export const useGetUerInfoQuery = () => {
  return useQuery({
    queryKey: ['myPage'],
    queryFn: getUserInfo,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

// 마이페이지 여행 정보 불러오기
export const useMypageTrip = (params: MypageReviewParams) => {
  return useQuery({
    queryKey: ['mypageTrip', params],
    queryFn: () => getMypageTrip(params),
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

// 마이페이지 여행 정보 스크랩 불러오기
export const useMypageScrapTrip = (params: MypageReviewParams) => {
  return useQuery({
    queryKey: ['mypageTrip', params],
    queryFn: () => getScrapTripList(params),
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

export const useMyPlanListQuery = (planListParams: PlanListParams) => {
  return useQuery({
    queryKey: ['myPlanList', planListParams],
    queryFn: () => getMyPlanList(planListParams),
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

export const useMyTripListQuery = (tripListParams: TripListParams) => {
  return useQuery({
    queryKey: ['mypageTrip', tripListParams],
    queryFn: () => getMyTripList(tripListParams),
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};
