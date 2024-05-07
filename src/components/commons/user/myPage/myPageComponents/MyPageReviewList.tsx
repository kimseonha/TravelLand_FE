import { useState } from 'react';
import Button from '@/components/commons/buttons/Button';
import ListCard from '@/components/commons/mainItem/ListCard';
import * as S from '@/components/commons/user/myPage/MyPage.style';
import { TravelReviewCardSection } from '@/components/reviews/reviewIndex/TravelReviewPage.styles';
import { useNavigate } from 'react-router-dom';
import {
  useMypageTrip,
  useMypageScrapTrip,
  useGetUerInfoQuery,
} from '@/hooks/useQuery/useUserQuery';
import { LoadingComponent } from '@/components/layouts/LoadingComponent';

export interface Trip {
  tripId: number;
  area?: string;
  title?: string;
  tripStartDate?: string;
  tripEndDate?: string;
  thumbnailUrl?: string;
  hashtagList?: string[];
  isScrap?: boolean;
  viewCount?: number;
}

const MyPageReviewList = () => {
  const navigate = useNavigate();
  const [showScrapList, setShowScrapList] = useState(false);

  const { data, isError, isLoading, error } = useMypageTrip({
    page: 1,
    size: 10,
  });

  const { data: scrapData } = useMypageScrapTrip({
    page: 1,
    size: 10,
  });

  const { data: count } = useGetUerInfoQuery();

  const userData = count?.data;

  const renderTripTotalElements = () => {
    if (userData?.tripTotalElements === 0) {
      return 0;
    } else {
      return userData?.tripTotalElements || 0;
    }
  };

  const renderScrapTotalElements = () => {
    if (userData?.scrapTotalElements === 0) {
      return 0;
    } else {
      return userData?.scrapTotalElements || 0;
    }
  };
  const handleCardClick = (tripId?: number) => {
    navigate(`/travelDetail/${tripId}`);
  };

  const handleReviewCreate = () => {
    navigate('/travelCreate');
  };

  const handleMyReviewListClick = () => {
    setShowScrapList(false);
  };

  const handleMyScrapListClick = () => {
    setShowScrapList(true);
  };

  if (isLoading)
    return (
      <div>
        <div>{LoadingComponent()}</div>
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div style={{ marginBottom: '300px' }}>
      <S.MyPageButton>
        <div>
          <Button
            color="white"
            textColor="gray"
            width="160px"
            borderColor="gray"
            marginRight="5px"
            onClick={handleMyReviewListClick}
          >
            내가 작성한 {renderTripTotalElements()}
          </Button>
          <Button
            color="white"
            textColor="gray"
            width="160px"
            borderColor="gray"
            onClick={handleMyScrapListClick}
          >
            내가 스크랩한 {renderScrapTotalElements()}
          </Button>
        </div>
        <div>
          <Button
            text="작성하기"
            width="150px"
            borderRadius="15px"
            color="#5AC8EC"
            textColor="white"
            onClick={handleReviewCreate}
          />
        </div>
      </S.MyPageButton>
      <TravelReviewCardSection>
        {showScrapList ? (
          scrapData?.data && scrapData.data.length > 0 ? (
            scrapData.data.map((trip: Trip) => (
              <ListCard
                key={trip.tripId}
                tripId={trip.tripId}
                area={trip.area}
                title={trip.title}
                tripStartDate={trip.tripStartDate}
                tripEndDate={trip.tripEndDate}
                thumbnailUrl={trip.thumbnailUrl}
                hashtagList={trip.hashtagList}
                isScrap={trip.isScrap}
                viewCount={trip.viewCount}
                onClick={() => handleCardClick(trip.tripId)}
              />
            ))
          ) : (
            <div>스크랩한 여행 정보가 없습니다! 추가해주세요!</div>
          )
        ) : data?.data && data.data.length > 0 ? (
          data.data.map((trip: Trip) => (
            <ListCard
              key={trip.tripId}
              tripId={trip.tripId}
              area={trip.area}
              title={trip.title}
              tripStartDate={trip.tripStartDate}
              tripEndDate={trip.tripEndDate}
              thumbnailUrl={trip.thumbnailUrl}
              hashtagList={trip.hashtagList}
              isScrap={trip.isScrap}
              viewCount={trip.viewCount}
              onClick={() => handleCardClick(trip.tripId)}
            />
          ))
        ) : (
          <div>나의 여행 정보가 없습니다! 추가해주세요!</div>
        )}
      </TravelReviewCardSection>
    </div>
  );
};

export default MyPageReviewList;
