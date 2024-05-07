import { useEffect, useState } from 'react';
import Button from '../commons/buttons/Button';
import * as S from './Vote.style';
import { useNavigate } from 'react-router-dom';
import { useCheckVoteMutation } from '@/hooks/useMutation/useTravelPlanMutation';

interface PlanVotes {
  planATitle: string;
  planBTitle: string;
  planVoteId: number;
  planAId: number;
  planBId: number;
  planACount: number;
  planBCount: number;
  isClosed: boolean;
  title: string;
  planVoteDuration: string;
  createdAt: string;
  modifiedAt: string;
  nickname: string;
  profileImage: string;
}

interface CheckVoteProps {
  voteData: PlanVotes[]; // PlanVotes 타입을 사용하여 voteData 프롭스를 정의합니다
}

export const VoteCheck: React.FC<CheckVoteProps> = ({ voteData }) => {
  const navigate = useNavigate();

  const [selectedVote, setSelectedVote] = useState<PlanVotes | undefined>();
  const [isVotedA, setIsVotedA] = useState<boolean | null>(null);
  const [content, _] = useState<string>('');
  const [voteCompleted, setVoteCompleted] = useState<boolean>(false); // 투표 완료 상태 관리

  // 총 투표 수와 각 투표 옵션의 비율을 계산하기 위한 상태
  const [totalCount, setTotalCount] = useState<number>(0);
  const [percentageA, setPercentageA] = useState<number>(0);
  const [percentageB, setPercentageB] = useState<number>(0);

  const handleGotoDetail = (id: number) => {
    alert('해당 게시글로 이동합니다!');
    navigate(`/planDetail/${id}`);
  };

  const handleVoteSelect = (vote: PlanVotes) => {
    setSelectedVote(vote);
  };

  const handleCheckPlan = (votedA: boolean) => {
    if (selectedVote?.isClosed) {
      alert('이미 마감된 투표입니다!');
      return;
    }

    setIsVotedA(votedA);
  };

  const votSubmit = useCheckVoteMutation();
  const handleVoteSubmit = () => {
    if (!selectedVote || isVotedA === null) {
      alert('투표를 선택하지 않았습니다. 선택해주세요!');
      return;
    }

    if (selectedVote.isClosed) {
      alert('이미 마감된 투표입니다!');
      return;
    }

    const voteData = {
      planVoteId: selectedVote.planVoteId,
      isVotedA: isVotedA,
      content,
    };

    votSubmit.mutate(voteData, {
      onSuccess: () => {
        setVoteCompleted(true); // 투표 완료 후 상태 업데이트
      },
    });
  };

  useEffect(() => {
    if (voteData.length > 0) {
      setSelectedVote(voteData[0]); // 첫 번째 투표 데이터를 초기에 선택
    }
  }, [voteData]); // voteData가 변경될 때마다 체크

  useEffect(() => {
    if (selectedVote) {
      // 총 투표 수를 계산
      const total = selectedVote.planACount + selectedVote.planBCount;
      setTotalCount(total);
      // 옵션 A의 비율 계산 (백분율)
      const percentA = total > 0 ? (selectedVote.planACount / total) * 100 : 0;
      setPercentageA(percentA);
      // 옵션 B의 비율 계산 (백분율)
      const percentB = total > 0 ? (selectedVote.planBCount / total) * 100 : 0;
      setPercentageB(percentB);
    }
  }, [selectedVote, selectedVote?.planACount, selectedVote?.planBCount]);

  if (!voteData.length) {
    return <div></div>; // 데이터가 없을 때의 표시
  }

  return (
    <>
      {!voteCompleted ? (
        <>
          <S.CheckVoteContainer>
            {voteData.map((vote, index) => (
              <Button
                key={vote.planVoteId}
                text={`투표 ${index + 1}`}
                onClick={() => handleVoteSelect(vote)}
                width="100px"
                height="35px"
                color="#F6F6F6"
                borderColor="#F6F6F6"
                textColor="#6F7878"
              />
            ))}

            {selectedVote && (
              <div>
                <S.VoteIsClosedBox>
                  {!selectedVote.isClosed ? '플랜 투표 중' : '플랜 투표 마감'}
                </S.VoteIsClosedBox>

                <S.VoteTitleContent>
                  <img
                    src={selectedVote.profileImage || '/assets/paris.jpg'}
                    alt="Profile"
                  />
                  <S.VoteTitle>
                    <div>{selectedVote.nickname || '익명'}</div>
                    <div>{selectedVote.title}</div>
                  </S.VoteTitle>
                </S.VoteTitleContent>
                <S.VoteButtonBox>
                  <S.VoteChoiceBox>
                    <Button
                      text="A안"
                      color={isVotedA ? '#5AC8EC' : '#F6F6F6'}
                      textColor="black"
                      borderRadius="60px"
                      borderColor={isVotedA ? '#5AC8EC' : '#F6F6F6'}
                      width="260px"
                      height="80px"
                      onClick={() => handleCheckPlan(true)}
                      //   disabled={selectedVote.isClosed}
                    />
                    <S.VoteContentBox
                      onClick={() => handleGotoDetail(selectedVote.planAId)}
                    >
                      {selectedVote.planATitle}
                      <img src="/assets/icons/GrayRightArrow.svg" />
                    </S.VoteContentBox>
                  </S.VoteChoiceBox>
                  <S.VoteChoiceBox>
                    <Button
                      text="B안"
                      color={isVotedA === false ? '#5AC8EC' : '#F6F6F6'}
                      textColor="black"
                      borderColor={isVotedA === false ? '#F6F6F6' : '#F6F6F6'}
                      borderRadius="60px"
                      width="260px"
                      height="80px"
                      onClick={() => handleCheckPlan(false)}
                      //   disabled={selectedVote.isClosed}
                    />
                    <S.VoteContentBox
                      onClick={() => handleGotoDetail(selectedVote.planBId)}
                    >
                      {selectedVote.planBTitle}
                      <img src="/assets/icons/GrayRightArrow.svg" />
                    </S.VoteContentBox>
                  </S.VoteChoiceBox>
                </S.VoteButtonBox>
                <S.VoteSubmitButtonBox>
                  <Button
                    text="투표하기"
                    borderRadius="15px"
                    width="100px"
                    onClick={handleVoteSubmit}
                  />
                </S.VoteSubmitButtonBox>
              </div>
            )}
          </S.CheckVoteContainer>
        </>
      ) : (
        // 투표 결과
        <S.CheckVoteContainer>
          {voteData.map((vote, index) => (
            <Button
              key={vote.planVoteId}
              text={`투표 ${index + 1}`}
              onClick={() => handleVoteSelect(vote)}
              width="100px"
              height="35px"
              color="#F6F6F6"
              borderColor="#F6F6F6"
              textColor="#6F7878"
            />
          ))}
          {selectedVote && (
            <div>
              <S.VoteIsClosedBox>
                {!selectedVote.isClosed ? '플랜 투표 중' : '플랜 투표 마감'}
              </S.VoteIsClosedBox>
              <S.VoteTitleContent>
                <img
                  src={selectedVote.profileImage || '/assets/paris.jpg'}
                  alt="Profile"
                />
                <S.VoteTitle>
                  <div>{selectedVote.nickname || '익명'}</div>
                  <div>{selectedVote.title}</div>
                </S.VoteTitle>
              </S.VoteTitleContent>
              <S.VoteResultContainer>
                {/* 결과 A */}
                <S.VoteRusultWrapper>
                  {/* 결과 바 */}
                  <S.VoteResultTotalBar>
                    <S.VoteResultBar percentage={percentageA}>
                      A안
                    </S.VoteResultBar>
                    <S.VoteResultPercentage>
                      {percentageA.toFixed(2)}%
                    </S.VoteResultPercentage>
                  </S.VoteResultTotalBar>
                  <Button
                    onClick={() => handleGotoDetail(selectedVote.planAId)}
                    text=" A 플랜 보기"
                    width=" 150px"
                    color="#EEEEEE"
                    textColor="#6F7878"
                    height="45px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderColor="#EEEEEE"
                  >
                    <img src="/assets/icons/GrayRightArrow.svg" width={30} />
                  </Button>
                </S.VoteRusultWrapper>
                {/* 결과 B */}
                <S.VoteRusultWrapper>
                  {/* 결과 바 */}
                  <S.VoteResultTotalBar>
                    <S.VoteResultBar percentage={percentageB}>
                      B안
                    </S.VoteResultBar>
                    <S.VoteResultPercentage>
                      {percentageB.toFixed(2)}%
                    </S.VoteResultPercentage>
                  </S.VoteResultTotalBar>
                  <Button
                    onClick={() => handleGotoDetail(selectedVote.planBId)}
                    text=" B 플랜 보기"
                    width=" 150px"
                    color="#EEEEEE"
                    textColor="#6F7878"
                    height="45px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderColor="#EEEEEE"
                  >
                    <img src="/assets/icons/GrayRightArrow.svg" width={30} />
                  </Button>
                </S.VoteRusultWrapper>
              </S.VoteResultContainer>
              <S.VoteResultTotalCount>
                {totalCount}명 투표
              </S.VoteResultTotalCount>
            </div>
          )}
        </S.CheckVoteContainer>
      )}
    </>
  );
};
