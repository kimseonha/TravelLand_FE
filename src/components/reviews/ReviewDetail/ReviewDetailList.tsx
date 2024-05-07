import { useState, useEffect } from 'react';
import * as S from '@/components/reviews/ReviewDetail/ReviewDetail.style';
import Button from '../../commons/buttons/Button';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { deleteTrip } from '@/api/reviewAxios';
import { AxiosError } from 'axios';
import CategoryButton from '../../commons/buttons/CategoryButton';
import { HashTagContainer } from '../../commons/mainItem/MainCard.style';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import Modal from '../../commons/modals/Modal';
import {
  useCreateLikeTripMutation,
  useCancelLikeTripMutation,
  useCreateScrapTripMutation,
  useCancelScrapTripMutation,
} from '@/hooks/useMutation/useTravelReviewMutation';
import { useTripDetailQuery } from '@/hooks/useQuery/useTravelReviewQuery';
import { LoadingComponent } from '@/components/layouts/LoadingComponent';

const ReviewDetailList = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likeActive, setLikeActive] = useState(false);
  const [scrapActive, setScrapActive] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { tripId } = useParams<{ tripId: string }>();
  const id = Number(tripId);

  const { data, isLoading, isError } = useTripDetailQuery(id);

  const tripDetail = data?.data;

  useEffect(() => {
    if (tripDetail) {
      setLikeActive(tripDetail.isLike);
      setScrapActive(tripDetail.isScrap);
    }
  }, [tripDetail]);

  const likeTrip = useCreateLikeTripMutation();
  const disLikeTrip = useCancelLikeTripMutation();
  const scrapTrip = useCreateScrapTripMutation();
  const scrapCancel = useCancelScrapTripMutation();

  const toggleLike = (tripId: number) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    const action = likeActive ? disLikeTrip.mutate : likeTrip.mutate;
    action(tripId);
    setLikeActive(!likeActive);
  };

  const toggleScrap = (tripId: number) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    const action = scrapActive ? scrapCancel.mutate : scrapTrip.mutate;
    action(tripId);
    setScrapActive(!scrapActive);
  };

  // 예산 cost
  const formatNumberWithRegex = (input: string): string => {
    // 숫자가 아닌 모든 문자를 제거
    const numericOnly = input.replace(/\D/g, '');
    // 숫자를 콤마로 포맷
    const numberWithCommas = numericOnly.replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      '$1,',
    );
    // 원화 표시를 추가하여 반환
    return numberWithCommas + '원';
  };

  const deleteReviewMutation = useMutation({
    mutationFn: (tripId: number) => deleteTrip(tripId),
    onSuccess: () => {
      alert('여행 정보가 성공적으로 삭제되었습니다.');
      navigate('/travelReview');
    },
    onError: (error: AxiosError) => {
      const message = error.response?.data;
      alert(`여행 정보 삭제 실패! 오류: ${message}`);
      console.error(error.response?.data);
    },
  });

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleEditClick = () => {
    // tripDetail은 현재 페이지에서 사용 중인 여행 리뷰의 상세 정보입니다.
    navigate('/editTrip', {
      state: { formData: tripDetail, tripId: tripDetail.tripId },
    });
  };

  const handleConfirmDelete = (tripId: number) => {
    deleteReviewMutation.mutate(tripId);
    handleCloseDeleteModal();
  };

  if (isLoading) return <div>{LoadingComponent()}</div>;
  if (isError) return <div>Error occurred</div>;
  if (!tripDetail) return <div>No data</div>;

  return (
    <>
      <S.Container>
        <S.ImageBox>
          {tripDetail.imageUrlList &&
            tripDetail.imageUrlList.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`리뷰 이미지 ${index + 1}`}
                style={{
                  display: activeIndex === index ? 'block' : 'none',
                  width: '100%',
                  height: '450px',
                }}
              />
            ))}
          <S.SliderDots key={tripDetail.imageUrlList.length}>
            {tripDetail.imageUrlList &&
              tripDetail.imageUrlList.map((_: any, index: number) => (
                <S.Dot
                  key={index}
                  active={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
          </S.SliderDots>
        </S.ImageBox>
      </S.Container>
      <S.Container>
        <S.DateRange>{`${tripDetail.area} |${tripDetail.placeName} ${tripDetail.tripStartDate} - ${tripDetail.tripEndDate} | ${formatNumberWithRegex(tripDetail.cost.toString())}`}</S.DateRange>{' '}
        <S.ReviewHeader>
          <S.LocationTag>{`${tripDetail.title}`}</S.LocationTag>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => toggleLike(tripDetail.tripId)}
              style={{
                cursor: 'pointer',
                backgroundImage: `url(${likeActive ? '/assets/icons/blueHeart.svg' : '/assets/icons/grayHeart.svg'})`,
                width: '32px',
                height: '32px',
                backgroundSize: 'cover', // 배경 이미지가 div 크기에 맞게 조절
              }}
            />
            <div
              onClick={() => toggleScrap(tripDetail.tripId)}
              style={{
                cursor: 'pointer',
                backgroundImage: `url(${scrapActive ? '/assets/icons/blueBookmark.svg' : '/assets/icons/grayBookmark.svg'})`,
                width: '32px',
                height: '32px',
                backgroundSize: 'cover',
              }}
            />
          </div>
        </S.ReviewHeader>
        <S.UserBox>
          <div>
            <S.UserSection>
              <S.UserImage src={tripDetail.profileImage} alt="사진" />
              <S.UserName>{tripDetail.nickname}님</S.UserName>
            </S.UserSection>
          </div>
          <div>
            <S.HeaderBox>
              {tripDetail.isWriter ? (
                <>
                  <S.ButtonBox>
                    <Button text="수정하기" onClick={handleEditClick} />
                    <Button text="삭제하기" onClick={handleOpenDeleteModal} />
                  </S.ButtonBox>
                  {/* 삭제 확인 모달 */}
                  <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                  >
                    <div>
                      <div style={{ textAlign: 'center', fontSize: '20px' }}>
                        <p>
                          삭제된 글은 복구할 수 없습니다
                          <br /> 삭제하시겠습니까?
                        </p>
                      </div>
                      <S.ModalBtnWrapper>
                        <Button
                          text="취소"
                          onClick={handleCloseDeleteModal}
                          borderRadius="10px"
                          hoverColor="#2ca3cb"
                        />
                        <Button
                          borderRadius="10px"
                          hoverColor="#2ca3cb"
                          text="삭제하기"
                          onClick={() => handleConfirmDelete(tripDetail.tripId)}
                        />
                      </S.ModalBtnWrapper>
                    </div>
                  </Modal>
                </>
              ) : (
                <></>
              )}
            </S.HeaderBox>
          </div>
        </S.UserBox>
      </S.Container>
      <S.Container2>
        <S.ContentBox>
          {/* 여기에  리뷰 내용을 렌더링 */}
          <S.ContentDiv>{tripDetail.content}</S.ContentDiv>
          <HashTagContainer>
            {tripDetail.hashtagList && tripDetail.hashtagList.length > 0 ? (
              tripDetail.hashtagList.map((category: string, idx: number) => (
                <CategoryButton key={idx} title={category} hoverColor="none" />
              ))
            ) : (
              <p>해시태그가 없습니다.</p>
            )}
          </HashTagContainer>
        </S.ContentBox>
      </S.Container2>
    </>
  );
};

export default ReviewDetailList;
