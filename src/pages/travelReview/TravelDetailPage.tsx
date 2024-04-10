// import React from 'react'
import ReviewCard from '@/components/commons/cards/ReviewCard';
import ReviewDetailHeader from '@/components/commons/user/TravelReview/ReviewDetail';
import ReviewContent from '@/components/commons/user/TravelReview/ReviewDetailContent';
import ReviewDetailList from '@/components/commons/user/TravelReview/ReviewDetailList';
import Header from '@/components/layouts/Header';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTripDetail } from '@api/reviewAxios';

const TravelDetailPage = () => {
  // useParam으로 들어오는 값은 string이라서 const tripId를 Number로 강제 치환 진행
  const { tripId } = useParams<{ tripId: string }>();
  const id = Number(tripId);
  console.log(tripId);
  const {
    data: tripDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tripDetail', id],
    queryFn: () => getTripDetail(id),
  });
  // console.log('tripDetail >> ', tripDetail);

  /**
   * AS-IS(선하님꺼) : data => tripDetail 이었어서
   * TO-BE(수정해준거) : data.data => tripDetail.data로 수정한거에요
   *
   */
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;
  if (!tripDetail) return <div>No data</div>;

  return (
    <>
      <Header />
      <ReviewDetailHeader tripDetail={tripDetail.data} />
      <ReviewDetailList tripDetail={tripDetail.data} />
      <ReviewContent tripDetail={tripDetail.data} />
      <ReviewCard />
    </>
  );
};

export default TravelDetailPage;
