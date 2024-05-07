import { PlanListParams } from '@/api/interfaces/planInterface';
import { getPlanList, getPlanDetail, searchNickname } from '@/api/planAxios';
import { useQuery } from '@tanstack/react-query';

export const usePlanListQuery = (planListParams: PlanListParams) => {
  return useQuery({
    queryKey: ['planList', planListParams],
    queryFn: () => getPlanList(planListParams),
    staleTime: 0, // 새로고침 주기를 빠르게 하려면 0으로 설정
  });
};

export const usePlanDetailQuery = (planId: number) => {
  return useQuery({
    queryKey: ['planDetail', planId],
    queryFn: () => getPlanDetail(planId),
    // staleTime: 5 * 60 * 1000, // 데이터를 5분간 신선하게 유지
    // gcTime: 30 * 60 * 1000, // 캐시에서 데이터를 30분간 유지 => gcTime으로 수정 필요 => v5에서 변경 됨
    // refetchInterval: 360000, // 투표 마감 결과 확인을 위해 1분으로 적용
    // refetchOnWindowFocus: false, // 윈도우 포커스 시 데이터 재요청 안 함
    // refetchOnReconnect: false, // 네트워크 재연결 시 데이터 재요청 안 함
  });
};

// 닉네임 검색 결과
export const useNicknameSearchQuery = (nickname: string) => {
  return useQuery({
    queryKey: ['nicknameSearch', nickname],
    queryFn: () => searchNickname(nickname),
    staleTime: 0,
    enabled: Boolean(nickname), // 닉네임이 있을 때만 검색을 실행
  });
};
