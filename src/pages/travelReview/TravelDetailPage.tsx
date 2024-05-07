import ReviewDetailList from '@/components/reviews/ReviewDetail/ReviewDetailList';
import DetailList from '@/components/reviews/ReviewDetail/DetailListCard';

const TravelDetailPage = () => {
  return (
    <>
      <div style={{ marginBottom: '200px' }}>
        <ReviewDetailList />
        <DetailList />
      </div>
    </>
  );
};

export default TravelDetailPage;
