// import React from 'react';
// import { TripDetail } from '@/api/interfaces/reviewInterface';
import * as S from '@/components/reviews/ReviewDetail/ReviewDetail.style';

// interface ReviewContentProps {
//   tripDetail: TripDetail;
// }

const ReviewContent = () => {
  return (
    <>
      <S.Container>
        <S.CommentsList>
          {/* <Comment>
            <UserAvatar />
            <div>
              <CommentName>신*은님</CommentName>
              <CommentText>어떤 여행이었나요?? 😊</CommentText>
            </div>
          </Comment>
          <Comment>
            <UserAvatar />
            <div>
              <CommentName>김*용님</CommentName>
              <CommentText>날씨가 너무 좋네요~😊</CommentText>
            </div>
          </Comment>
          <Comment>
            <UserAvatar />
            <div>
              <CommentName>유*찬님</CommentName>
              <CommentText>저도 가고 싶어요!!😊</CommentText>
            </div>
          </Comment>
          <Comment>
            <UserAvatar />
            <div>
              <CommentName>김*원님</CommentName>
              <CommentText>좋은 정보 감사합니다~😊</CommentText>
            </div>
          </Comment> */}
        </S.CommentsList>
      </S.Container>
      {/* <ViewMore>댓글 더보기</ViewMore> */}
    </>
  );
};

export default ReviewContent;
