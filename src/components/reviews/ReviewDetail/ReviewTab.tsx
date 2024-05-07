import * as S from './ReviewDetail.style';

const ReviewPageTab = () => {
  return (
    <>
      <S.ReviewListTabStyle>
        <S.ReviewListTabButton>전체</S.ReviewListTabButton>
        <S.ReviewListTabButton>후기 Best</S.ReviewListTabButton>
      </S.ReviewListTabStyle>
    </>
  );
};

export default ReviewPageTab;
