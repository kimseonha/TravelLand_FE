import {
  cancelLikePlan,
  cancelScrapPlan,
  createLikePlan,
  createPlanList,
  createScrapPlan,
  deletePlan,
  updatePlan,
} from '@/api/planAxios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { UpdateWholePlan } from '@/api/interfaces/planInterface';
import { checkVote } from '@/api/voteAxios';

export interface PlanResponse {
  data: any;
  planId: number;
}

interface ErrorResponse {
  message: string;
}

// 작성하기 mutation
export const useCreatePlanMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createPlanList,
    onSuccess: () => {
      alert('작성이 완료되었습니다.');
      navigate('/planList');
    },
    onError: (error) => {
      alert('등록하기 에러가 발생했습니다.');
      console.log(error.message);
    },
  });
};

// 수정하기
export const useUpdatePlanMutation = () => {
  const navigate = useNavigate();
  return useMutation<PlanResponse, AxiosError<ErrorResponse>, UpdateWholePlan>({
    mutationFn: updatePlan,
    onSuccess: (data) => {
      alert('수정이 완료됬습니다.');
      const planId = data.data.planId;
      navigate(`/planDetail/${planId}`);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as ErrorResponse).message ||
        '알 수 없는 에러가 발생했습니다.';
      alert('수정하기 에러가 발생했습니다:' + errorMessage);
    },
  });
};
// 삭제하기 mutation
export const useDeleteMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      alert('삭제가 완료 되었습니다.');
      navigate('/planList');
    },
    onError: () => {
      alert('삭제하기에 에러가 발생했습니다.');
    },
  });
};

// 투표하기
export const useCheckVoteMutation = () => {
  // const queryClient = useQueryClient();
  // const navigate = useNavigate();
  return useMutation({
    // mutationKey: ['VOTE_KEY'],
    mutationFn: checkVote,
    onSuccess: () => {
      alert('투표가 완료되었습니다.');
      // navigate('/planList');
      // queryClient.invalidateQueries({ queryKey: ['VOTE_KEY'] });
    },
    onError: () => {
      alert('투표하기에 에러가 발생했습니다.');
    },
  });
};

//플랜 좋아요 등록
export const useCreateLikePlanMutation = () => {
  return useMutation({
    mutationFn: createLikePlan,
    onSuccess: () => {
      alert('좋아요를 클릭하셨습니다.');
    },
    // onError: () => {
    //   alert('좋아요 기능에 에러가 발생했습니다.');
    // },
  });
};
// 좋아요 취소
export const useCancelLikePlanMutation = () => {
  return useMutation({
    mutationFn: cancelLikePlan,
    onSuccess: () => {
      alert('좋아요를 취소하셨습니다.');
    },
    // onError: () => {
    //   alert('좋아요 취소 기능에 에러가 발생했습니다.');
    // },
  });
};

// 플랜 스크랩 등록
export const useCreateScrapPlanMutation = () => {
  return useMutation({
    mutationFn: createScrapPlan,
    onSuccess: () => {
      alert('플랜을 스크랩하셨습니다.');
    },
    // onError: () => {
    //   alert('스크랩 기능에 에러가 발생했습니다.');
    // },
  });
};

// 스크랩 취소
export const useCancelScrapPlanMutation = () => {
  return useMutation({
    mutationFn: cancelScrapPlan,
    onSuccess: () => {
      alert('스크랩을 취소하셨습니다.');
    },
    // onError: () => {
    //   alert('스크랩 취소 기능에 에러가 발생했습니다.');
    // },
  });
};
