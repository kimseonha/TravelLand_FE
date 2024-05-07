import ReviewCreate from '@/components/reviews/reviewIndex/TReviewCreate';
import { useState } from 'react';
import * as S from '@/components/reviews/reviewIndex/TReviewPageStyle';

const ReviewCreate1 = () => {
  const [step, _] = useState<number>(1);

  return (
    <>
      <S.CenteredContainer>
        <h2>여행 정보 작성하기</h2>
        <S.StepperContainer>
          <S.ProgressBar width={(step * 33).toString() + '%'} />
        </S.StepperContainer>
        <ReviewCreate />
      </S.CenteredContainer>
    </>
  );
};

export default ReviewCreate1;
