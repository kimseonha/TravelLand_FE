import React, { useEffect, useState } from 'react';
import * as S from '../Plan.style';
import Map from '@/components/maps/Map';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/commons/buttons/Button';
import { FaLocationDot } from 'react-icons/fa6';
import { Invitation } from '@/components/commons/invitation/Invitation';
import { VoteCheck } from '@/components/vote/VoteCheck';
import { useAuthStore } from '@/store/useAuthStore';
import {
  useCancelLikePlanMutation,
  useCancelScrapPlanMutation,
  useCreateLikePlanMutation,
  useCreateScrapPlanMutation,
  useDeleteMutation,
} from '@/hooks/useMutation/useTravelPlanMutation';
import { usePlanDetailQuery } from '@/hooks/useQuery/useTravelPlanQuery';
import { LoadingComponent } from '@/components/layouts/LoadingComponent';
import { CiCirclePlus } from 'react-icons/ci';
import InvitationCard from '@/components/commons/cards/InvitationCard';

interface ButtonProps {
  active: boolean;
  text: string;
  onClick: () => void;
}

interface DayPlan {
  dayPlanId: number;
  title: string;
  content: string;
  budget: number;
  date: string;
  startAddress: string;
  endAddress: string;
  unitPlans: UnitPlan[];
}

interface UnitPlan {
  unitPlanId: number;
  title: string;
  content: string;
  budget: number;
  address: string;
  time: string;
  placeName: string;
}
export interface InvitedPerson {
  email: string;
  nickname: string;
  profileImage: string;
}
const PlanDetail: React.FC<ButtonProps> = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [address, setAddress] = useState<string>(''); // 예시 주소를 빈 문자열로 초기화// ...기존의 useState와 useEffect 로직...
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false); // 초대 모달 상태를 관리하는 useState
  const [invitedPeople, setInvitedPeople] = useState<InvitedPerson[]>([]);
  const [likeActive, setLikeActive] = useState(false);
  const [scrapActive, setScrapActive] = useState(false);
  // `id`를 숫자로 변환하기 전에 유효성 검사 수행
  const planId = Number(id);

  const { data, isLoading, isError } = usePlanDetailQuery(planId);

  const planDetails = data?.data;
  const planVotes = data?.data.planVotes;

  useEffect(() => {
    if (planDetails) {
      setDayPlans(planDetails.dayPlans || []);
      setLikeActive(planDetails.isLike);
      setScrapActive(planDetails.isScrap);
    }
  }, [planDetails]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleOpenMapClick = (selectedAddress: string) => {
    setAddress(selectedAddress); // 주소 상태 업데이트
    setIsModalOpen(true);
  };

  const likePlan = useCreateLikePlanMutation();
  const disLikePlan = useCancelLikePlanMutation();

  // 좋아요 기능
  const handleLikeClick = (planId: number) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    } else {
      !likeActive ? likePlan.mutate(planId) : disLikePlan.mutate(planId);
      setLikeActive(!likeActive);
    }
  };

  const scrapPlan = useCreateScrapPlanMutation();
  const scrapCancel = useCancelScrapPlanMutation();

  // 스크랩 기능
  const handleScrapClick = (planId: number) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    } else {
      !scrapActive ? scrapPlan.mutate(planId) : scrapCancel.mutate(planId);
      setScrapActive(!scrapActive);
    }
  };

  // 수정 기능
  const handlePlanUpdate = (planId: number) => {
    navigate(`/planUpdate/1/${planId}`, { state: { planDetails } });
  };

  // 삭제 기능
  const deleteMutaion = useDeleteMutation();
  const handlePlanDelete = () => {
    if (confirm('플랜을 삭제하시겠습니까?')) {
      deleteMutaion.mutate(planId);
      alert('플랜을 삭제하셨습니다!');
    } else {
      alert('취소를 누르셨습니다');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 초대하기 목록 불러오기 쿼리

  // 초대하기 모달을 여는 함수
  const handleOpenInvitation = () => {
    setIsInvitationModalOpen(true); // 초대 모달 상태를 true로 설정
  };

  // 초대하기 모달을 닫는 함수
  const closeInvitationModal = () => {
    setIsInvitationModalOpen(false); // 초대 모달 상태를 false로 설정
  };

  // 초대하기 로직
  // 초대하기 로직을 변경: 이메일 대신 사용자 객체 전체를 초대 목록에 추가
  const handleInvite = (user: InvitedPerson) => {
    setInvitedPeople((prev) => [...prev, user]);
    closeInvitationModal();
    alert(`${user.nickname}님을 초대했습니다.`);
  };

  // 초대한 사람 삭제
  const handleDeleteClick = (index: number) => {
    setInvitedPeople((prev) => prev.filter((_, idx) => idx !== index));
  };

  if (isLoading) {
    // 데이터 로딩 중 UI
    return <div>{LoadingComponent()}</div>;
  }

  if (isError) {
    // 에러 발생 시 UI
    return <div>Error</div>;
  }

  return (
    <>
      <S.PlanDetailContainer>
        <S.PlanDetailContentHeader>
          <S.DetailHeaderContent>
            <div>
              {planDetails.area} | {planDetails.tripStartDate} -{' '}
              {planDetails.tripEndDate} | 예산{' '}
              {planDetails.budget.toLocaleString()} 원
            </div>
            <S.DetailPlanContentCity>
              {planDetails.title}
            </S.DetailPlanContentCity>
          </S.DetailHeaderContent>
          <S.DetailButtonsBox>
            <div
              onClick={() => handleLikeClick(planDetails.planId)}
              style={{
                backgroundImage: `url(${likeActive ? '/assets/icons/blueHeart.svg' : '/assets/icons/grayHeart.svg'})`,
                width: '32px',
                height: '32px',
                backgroundSize: 'cover', // 배경 이미지가 div 크기에 맞게 조절
                cursor: 'pointer', // 클릭 가능한 요소임을 시각적으로 표현
              }}
            />
            <div
              onClick={() => handleScrapClick(planDetails.planId)}
              style={{
                backgroundImage: `url(${scrapActive ? '/assets/icons/blueBookmark.svg' : '/assets/icons/grayBookmark.svg'})`,
                width: '32px',
                height: '32px',
                backgroundSize: 'cover', // 배경 이미지가 div 크기에 맞게 조절
                cursor: 'pointer', // 클릭 가능한 요소임을 시각적으로 표현
              }}
            />
          </S.DetailButtonsBox>
        </S.PlanDetailContentHeader>
        <S.DetailHeaderThirdContent>
          <div>
            <img src={`${planDetails.profileUrl}`} />
            {planDetails.memberNickname}
          </div>
          {planDetails.isWriter ? (
            <>
              <div>
                <Button
                  onClick={() => handlePlanUpdate(planDetails.planId)}
                  text={'수정하기'}
                  borderColor="lightGray"
                  marginRight="5px"
                />
                <Button
                  onClick={handlePlanDelete}
                  text={'삭제하기'}
                  borderColor="lightGray"
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </S.DetailHeaderThirdContent>
        <S.DetailContentSection>
          {/* 투표 영역 */}
          <VoteCheck voteData={planVotes} />
          {/* 스태퍼 박스 영역 */}
          <S.PlanDetailDateBox>
            {dayPlans.map((dayPlan, index) => (
              <S.PlanDetailDateButton
                key={index}
                onClick={() => handleStepClick(index)}
                isActive={currentStep === index}
              >
                {`${index + 1}일차`}
                {currentStep === index && (
                  <>
                    <hr />
                    <div>{formatDate(dayPlan.date)}</div>
                  </>
                )}
              </S.PlanDetailDateButton>
            ))}
          </S.PlanDetailDateBox>
          {/* 스태퍼 박스 영역 */}
          <div>
            {dayPlans[currentStep]?.unitPlans.map((unitPlan, index) => (
              <S.DetailContentBox key={index}>
                {/* 순서 */}{' '}
                <S.DetailPlanNumber>{index + 1}</S.DetailPlanNumber>
                <S.PlanDetailContentBox>
                  <S.DetailPlanContentCity>
                    {unitPlan.title}
                  </S.DetailPlanContentCity>
                  <S.DetailContentItem>
                    <S.DetailContent>
                      <div>
                        {unitPlan.time} {unitPlan.content}
                      </div>
                      <div>{unitPlan.budget.toLocaleString()}원</div>
                    </S.DetailContent>
                    <S.DetailLocationBox>
                      {/* 이 부분에 지도 버튼 추가 및 클릭 이벤트 핸들러 연결 */}
                      <S.DetailButtonDiv
                        onClick={() => handleOpenMapClick(unitPlan.address)}
                      >
                        <FaLocationDot size="25px" color="white" />{' '}
                      </S.DetailButtonDiv>{' '}
                      <div>
                        {unitPlan.placeName},{unitPlan.address}
                      </div>
                    </S.DetailLocationBox>
                  </S.DetailContentItem>
                </S.PlanDetailContentBox>
              </S.DetailContentBox>
            ))}

            {/*초대 */}
            <S.InvitationBox>
              <S.InvitationDiv>
                {invitedPeople.length > 0 ? (
                  invitedPeople.map((person, index) => (
                    <InvitationCard
                      key={index}
                      src={person.profileImage} // 예제 코드에서는 각 초대된 사람의 이미지 URL을 사용한다고 가정
                      onClick={() => handleDeleteClick(index)}
                    />
                  ))
                ) : (
                  <div>함께할 동행자를 초대해주세요</div>
                )}
                <CiCirclePlus
                  size="55px"
                  onClick={handleOpenInvitation}
                  style={{ cursor: 'pointer' }}
                />
              </S.InvitationDiv>
            </S.InvitationBox>
          </div>
        </S.DetailContentSection>
      </S.PlanDetailContainer>
      {/*  지도 모달 */}
      <Map isOpen={isModalOpen} onClose={closeModal} address={address} />
      {/* 초대하기 모달 처리 */}
      <Invitation
        isOpen={isInvitationModalOpen}
        onClose={closeInvitationModal}
        onInvite={handleInvite} // 초대하기 버튼 클릭 시 호출될 함수 전달
      />
    </>
  );
};

export default PlanDetail;
