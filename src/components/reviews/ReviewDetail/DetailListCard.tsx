import * as S from '@/components/reviews/ReviewDetail/ReviewDetail.style';
import ListCard from '../../commons/mainItem/ListCard';
import { getRecommendedTrips } from '@/api/reviewAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LoadingComponent } from '@/components/layouts/LoadingComponent';

const DetailList = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const id = Number(tripId);
  // API 호출을 통한 데이터 가져오기
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendedTrips', tripId],
    queryFn: () => getRecommendedTrips(id),
  });

  const handleCardClick = (clickedTripId: number) => {
    // 상세 페이지로 이동
    navigate(`/travelDetail/${clickedTripId}`);
  };

  if (isLoading)
    return (
      <S.CardBox>
        <div>
          <div>{LoadingComponent()}</div>
        </div>
      </S.CardBox>
    );
  if (error)
    return (
      <S.CardBox>
        <div>An error occurred: {error.message}</div>
      </S.CardBox>
    );
  if (!data || data.data.length === 0)
    return (
      <S.CardBox>
        <div>No recommendations found</div>
      </S.CardBox>
    );

  return (
    <S.CardBox>
      <S.CardTitle>당신을 위한 여행 정보추천</S.CardTitle>
      <S.CardContainer>
        {data.data.map((trip: any) => (
          <ListCard
            key={trip.tripId}
            tripId={trip.tripId}
            area={trip.area}
            title={trip.title}
            tripStartDate={trip.tripStartDate}
            tripEndDate={trip.tripEndDate}
            thumbnailUrl={trip.thumbnailUrl}
            hashtagList={trip.hashtagList}
            onClick={() => handleCardClick(trip.tripId)}
          />
        ))}
      </S.CardContainer>
    </S.CardBox>
  );
};

export default DetailList;
