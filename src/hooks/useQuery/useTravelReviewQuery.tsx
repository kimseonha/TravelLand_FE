import { getTripDetail } from '@/api/reviewAxios';
import { useQuery } from '@tanstack/react-query';

export const useTripDetailQuery = (tripId: number) => {
  return useQuery({
    queryKey: ['tripDetail', tripId],
    queryFn: () => getTripDetail(tripId),
    // staleTime: 5 * 60 * 1000, // 데이터를 5분간 신선하게 유지
    // gcTime: 30 * 60 * 1000, // 캐시에서 데이터를 30분간 유지 => gcTime으로 수정 필요 => v5에서 변경 됨
    // refetchInterval: 360000, // 투표 마감 결과 확인을 위해 1분으로 적용
    // refetchOnWindowFocus: false, // 윈도우 포커스 시 데이터 재요청 안 함
    // refetchOnReconnect: false, // 네트워크 재연결 시 데이터 재요청 안 함
  });
};
