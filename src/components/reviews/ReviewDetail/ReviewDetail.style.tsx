import styled, { css } from 'styled-components';

//  여행 정보 카드 레이아웃 스타일

export const CardTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin: 100px 0 50px 0;
`;

export const CardBox = styled.div`
  width: 1500px;
  margin: 0 auto;
`;

export const CardContainer = styled.div`
  display: flex;
`;

// 여행 정보페이지

export const ReviewListTabStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 3px;
  margin-bottom: 30px;
`;

export const ReviewListTabButton = styled.button`
  justify-content: center;

  background-color: white;
  border: none;
  border-radius: 5px;

  font-size: 16px;
  font-weight: bold;

  width: 600px;
  height: 45px;

  cursor: pointer;

  &:active {
    background-color: black;
    color: white;
  }
`;

export const ReviewListContaier = styled.div`
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px;
`;

export const ReviewListSection = styled.div``;
export const ReviewListLeft = styled.div`
  display: flex;
  padding: 5px;
`;

export const ReviewListRight = styled.div`
  display: flex;
  align-items: center;

  div {
    padding: 5px 20px;
    width: 60px;
  }
`;

export const ReviewListCity = styled.div`
  display: flex;
  justify-content: center;

  width: 50px;
  padding: 5px 20px;

  border-radius: 5px;
  background-color: lightgray;

  font-weight: bold;
`;

export const ReviewListTitle = styled.div`
  padding: 5px 20px;
  width: 350px;
`;

export const Container = styled.div`
  width: 800px;
  margin: 0 auto;
  padding: 16px 0;
  margin-top: 60px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

export const UserSection = styled.div`
  display: flex;
  margin: 15px 0 10px 0;
`;

export const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
  border: 1px solid #ddd;
`;

export const UserName = styled.span`
  font-size: 16px;
`;

export const ImageBox = styled.div`
  width: 100%;
  height: 450px;
  background-color: #f0f0f0;
  position: relative;
  margin-bottom: 20px;
`;

export const SliderDots = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
`;

export const Dot = styled.div<{ active: boolean }>`
  height: 15px;
  width: 15px;
  background-color: #bbb;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    width 0.3s ease,
    border-radius 0.3s ease;

  // active prop에 따라 스타일 적용
  ${(props) =>
    props.active &&
    css`
      background-color: #000; // active 상태일 때의 색상
      width: 30px;
      border-radius: 10px;
    `}
`;

// 수정 / 삭제 버튼
export const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  Button:nth-child(2) {
    margin-left: 15px;
  }
`;

export const HeaderBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
`;

// DetailList 스타일
export const ModalBtnWrapper = styled.div`
  width: 270px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`;

export const Container2 = styled.div`
  width: 800px;
  margin: 0 auto;
  padding: 16px;
  margin-bottom: 40px;
`;

export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3px 0 30px 0;
  height: 40px;
  line-height: 40px;
`;

export const LocationTag = styled.div`
  padding: 4px 0;
  font-size: 20px;
  font-weight: 600;
`;

export const DateRange = styled.div`
  font-size: 15px;
  color: #666;
  margin-left: 2px;
`;

export const ContentBox = styled.div`
  min-height: 250px;
  overflow: auto;
`;

export const ContentDiv = styled.p`
  width: 85%;
  font-size: 18px;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 1em;
  white-space: pre-line;
  word-wrap: break-word;
  max-height: 100vh;
  overflow: auto;
`;

export const UserBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 50px;
`;

// 댓글 부분 나중에 살려서 쓰기

// export const ContentBox = styled.div`
//   min-height: 350px;
//   overflow: auto;
// `;

// const ContentDiv = styled.p`
//   width: 85%;
//   font-size: 16px;
//   font-size: 16px;
//   line-height: 1.6;
//   margin-bottom: 1em;
//   white-space: pre-line;
//   word-wrap: break-word;
// `;

export const CommentsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

// export const Comment = styled.li`
//   display: flex;
//   align-items: center;
//   padding: 15px 0;
//   border-top: 1px solid #bbb;
// `;

// export const UserAvatar = styled.div`
//   width: 40px;
//   height: 40px;
//   border-radius: 20px;
//   background: #ddd;
//   margin-right: 8px;
// `;

// export const CommentName = styled.div`
//   font-size: 16px;
//   font-weight: 600;
// `;

// export const CommentText = styled.div`
//   padding-top: 5px;
//   color: #4a4a4a;
// `;

// export  const ViewMore = styled.div`
//   text-align: center;
//   margin-top: 10px;
//   width: 100%;
//   padding: 8px 0;
//   cursor: pointer;
//   padding-bottom: 40px;
//   border-bottom: 4px solid #ddd;
// `;
