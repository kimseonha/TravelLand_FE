import { updateNickname } from '@/api/userAxios';
import { createVote } from '@/api/voteAxios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// 투표 생성하기
export const useCreateVoteMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createVote,
    onSuccess: () => {
      alert('투표 생성이 완료되었습니다.');
      navigate('/user/myPage');
    },
    onError: () => {
      alert('투표 생성하기에 에러가 발생했습니다.');
    },
  });
};

// 닉네임 변경
export const useUpdateNickname = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (newNickname: string) => updateNickname(newNickname),
    onSuccess: () => {
      alert('닉네임이 성공적으로 변경되었습니다.');
      navigate('/user/myPage');
    },
    onError: () => {
      alert('닉네임 변경에 실패했습니다!');
    },
  });
};
