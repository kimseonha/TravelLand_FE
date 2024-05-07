import { useState } from 'react';
import TReviewCreate2 from '@/components/reviews/reviewIndex/TReviewCreate2';
import * as S from '@/components/reviews/reviewIndex/TReviewPageStyle';

const ReviewCreate2 = () => {
  const [step, _] = useState<number>(2); // 현재 단계를 2로 설정

  return (
    <>
      <div style={{ marginBottom: '150px' }}>
        <S.CenteredContainer2>
          <h2>여행 정보 작성하기</h2>
          <S.StepperContainer>
            <S.ProgressBar width={(step * 33).toString() + '%'} />{' '}
            {/* 현재 단계에 따라 프로그레스 바의 너비 설정 */}
          </S.StepperContainer>
        </S.CenteredContainer2>
        <TReviewCreate2 />
      </div>
    </>
  );
};

export default ReviewCreate2;
