import { getMainTopTenRankList, getMainRandomList } from '@/api/mainAxios';
import {
  getTopHashtags,
  getSearchTopArea,
  searchTripsByArea,
  searchTripsByHashtag,
  searchTripsByText,
} from '@/api/searchAxios';
import { useQuery } from '@tanstack/react-query';

// 상위 10개
export const useGetMainRankListQuery = () => {
  return useQuery({
    queryKey: ['mainRank'],
    queryFn: getMainTopTenRankList,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

// 메인 랜덤 8개
export const useGetMainRandomListQuery = () => {
  return useQuery({
    queryKey: ['mainRandom'],
    queryFn: getMainRandomList,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

// 인기 해시태그 TOP 5
export const useGetHahtagListQuery = () => {
  return useQuery({
    queryKey: ['topHashTag'],
    queryFn: getTopHashtags,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

// 인기 지역 TOP 5
export const useGetAreaListQuery = () => {
  return useQuery({
    queryKey: ['topArea'],
    queryFn: getSearchTopArea,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

// 지역 검색
export const useGetSearchResultAreaQuery = (
  searchAreaParams: SearchAreaParams,
) => {
  return useQuery({
    queryKey: ['resultArea', searchAreaParams],
    queryFn: () => searchTripsByArea(searchAreaParams),
    staleTime: 0,
    enabled: Boolean(searchAreaParams.area),
  });
};

// 지역 검색
export const useGetSearchResultHashtagQuery = (
  searchHashtagParams: SearchHashtagParams,
) => {
  return useQuery({
    queryKey: ['resultHashtag', searchHashtagParams],
    queryFn: () => searchTripsByHashtag(searchHashtagParams),
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
    enabled: Boolean(searchHashtagParams.hashtag),
  });
};

// 여행 정보 통합 검색
export const useGetMainSearchQuery = (text: string) => {
  return useQuery({
    queryKey: ['tripSearch', text],
    queryFn: () => searchTripsByText(text, 1, 9, '', true),
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};
