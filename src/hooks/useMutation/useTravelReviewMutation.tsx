import { TripData } from '@/api/interfaces/reviewInterface';
import {
  cancelLikeTrip,
  cancelScrapTrip,
  createLikeTrip,
  createScrapTrip,
  createTrip,
  updateTrip,
} from '@/api/reviewAxios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

interface ErrorResponse {
  message: string;
}

// 여행 정보 추가
export const useCreateTripMutation = () => {
  const navigate = useNavigate();
  return useMutation<TripData, AxiosError, FormData>({
    mutationFn: createTrip,
    onSuccess: () => {
      // console.log('여행 정보가 성공적으로 등록되었습니다.', data);
      alert('여행 정보 작성 성공!');
      localStorage.removeItem('reviewState');
      navigate('/travelReview');
    },
    onError: (error) => {
      const message = error.response?.data;
      alert(`여행 정보 등록 실패! 오류: ${message}`);
      console.error(message);

      // 에러 발생 시에도 로컬 스토리지에서 데이터를 제거하도록 처리
      localStorage.removeItem('reviewState');
      console.log('Review state removed from localStorage');
    },
  });
};

// 여행 정보 수정
export const useUpdateTripMutation = () => {
  const navigate = useNavigate();

  return useMutation<
    AxiosResponse<any, any>,
    AxiosError,
    { tripId: number; formData: FormData }
  >({
    // 직접 updateTrip 함수에 인자를 분해하여 전달합니다.
    mutationFn: ({ tripId, formData }) => updateTrip(tripId, formData),
    onSuccess: () => {
      alert('여행 정보가 성공적으로 수정 되었습니다.');
      navigate('/travelReview'); // 성공 후 이동할 경로
    },
    onError: (error: AxiosError) => {
      alert(`여행 정보 수정 실패: ${error.message}`);
      console.error('수정하기 실패', error);
    },
  });
};

// 여행 정보 좋아요
export const useCreateLikeTripMutation = () => {
  return useMutation({
    mutationFn: createLikeTrip,
    onSuccess: () => {
      alert('좋아요를 클릭하셨습니다.');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as ErrorResponse).message ||
        '알 수 없는 에러가 발생했습니다.';
      alert(`좋아요 등록 실패! 오류: ${errorMessage}`);
    },
  });
};
// 여행 정보 좋아요 취소
export const useCancelLikeTripMutation = () => {
  return useMutation({
    mutationFn: cancelLikeTrip,
    onSuccess: () => {
      alert('좋아요를 취소하셨습니다.');
    },
    onError: (error: AxiosError) => {
      // error.response?.data를 ErrorResponse 타입으로 단언
      const errorMessage =
        (error.response?.data as ErrorResponse).message ||
        '알 수 없는 에러가 발생했습니다.';
      alert(`좋아요 취소 실패! 오류: ${errorMessage}`);
    },
  });
};
// 여행 정보 스크랩 등록
export const useCreateScrapTripMutation = () => {
  return useMutation({
    mutationFn: createScrapTrip,
    onSuccess: () => {
      alert('여행정보를 스크랩하셨습니다.');
    },
    onError: (error: AxiosError) => {
      // 에러 메시지 추출, 없으면 기본 메시지 사용
      const errorMessage =
        (error.response?.data as ErrorResponse)?.message ||
        '스크랩 등록에 실패했습니다.';
      alert(`스크랩 등록 실패! 오류: ${errorMessage}`);
    },
  });
};

// 여행 정보 스크랩 취소
export const useCancelScrapTripMutation = () => {
  return useMutation({
    mutationFn: cancelScrapTrip,
    onSuccess: () => {
      alert('스크랩을 취소하셨습니다.');
    },
    onError: (error: AxiosError) => {
      // 에러 메시지 추출, 없으면 기본 메시지 사용
      const errorMessage =
        (error.response?.data as ErrorResponse)?.message ||
        '스크랩 취소에 실패했습니다.';
      alert(`스크랩 취소 실패! 오류: ${errorMessage}`);
    },
  });
};
