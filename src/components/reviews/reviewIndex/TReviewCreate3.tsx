import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ToggleButton from '@/components/commons/buttons/ToggleButton';
import { ModernInput } from '@/components/commons/inputs/Input';
import styled from 'styled-components';
import CategoryButton from '@/components/commons/buttons/CategoryButton';
import { TitleWithCircle } from './TReviewCreate';
// import { instanceWithToken } from '@/api/axios';
import { AxiosError } from 'axios';
import { TripData } from '@/api/interfaces/reviewInterface';
import { useMutation } from '@tanstack/react-query';
import { createTrip } from '@/api/reviewAxios';

const TReviewCreate3 = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // const [title, setTitle] = useState<string>(state?.title || '');
  const [isPublic, setIsPublic] = useState<boolean>(state?.isPublic || false);
  const [content, setContent] = useState<string>(''); // 내용 state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 해시태그
  const handleTagClick = (
    tag: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 4) {
        alert('해시태그는 4개까지 선택 가능합니다.');
      } else {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };
  //뒤로가기
  const handleBackClick = () => {
    navigate(-1);
  };

  // Form 제출 핸들러
  const mutation = useMutation<TripData, AxiosError, FormData>({
    mutationFn: createTrip,
    onSuccess: (data) => {
      console.log('여행 정보가 성공적으로 등록되었습니다.', data);
      alert('여행 정보 작성 성공!');
      navigate('/travelReview');
    },
    onError: (error) => {
      const message = error.response?.data;
      alert(`여행 정보 등록 실패! 오류: ${message}`);
      console.error(message);
    },
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      'requestDto',
      JSON.stringify({
        title: state.title,
        content: content,
        tripStartDate: state.tripStartDate,
        tripEndDate: state.tripEndDate,
        cost: state.cost,
        hashTag: selectedTags,
        address: state.address,
        isPublic: isPublic,
      }),
    );

    // 'thumbnail' 이미지 추가 (배열의 첫 번째 이미지)
    if (state.imageFiles.length > 0) {
      formData.append(
        'thumbnail',
        state.imageFiles[0],
        state.imageFiles[0].name,
      );
      // imageList 항목 추가
      state.imageFiles.slice(1).forEach((file: File, index: number) => {
        formData.append(`imageList[${index}]`, file, file.name);
      });
    }

    mutation.mutate(formData); // FormData 객체를 직접 전달
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '100%' }}>
          <Title>
            <TitleWithCircle>제목</TitleWithCircle>
          </Title>
          <ReviewBoxWithSpaceBetween>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/assets/icons/Rectangle.png"
                style={{ height: '40px' }}
              />
              <ModernInput
                type="text"
                value={state?.title || ''}
                readonly
                placeholder="제목"
                width={560}
                height={35}
                border="transparent"
                fontSize={16}
                fontWeight={'bold'}
              />
            </div>
            <ToggleButton
              isChecked={!isPublic}
              onToggle={() => setIsPublic(!isPublic)}
            />
          </ReviewBoxWithSpaceBetween>
          <ReviewBox>
            <ReviewContent>
              <div>
                <TitleWithCircle>내용</TitleWithCircle>
              </div>
              <ContentTextarea
                placeholder="내용을 입력해주세요"
                value={content}
                onChange={handleContentChange}
              />
            </ReviewContent>
          </ReviewBox>
          <HashTagContainer>
            <div style={{ display: 'flex' }}>
              <HashTagTitle>
                <TitleWithCircle>해시태그</TitleWithCircle>
              </HashTagTitle>
              <HashTagDescription>
                최대 4개를 선택할 수 있어요
              </HashTagDescription>
            </div>
          </HashTagContainer>
          <div>
            <CategoryButtonContainer>
              {[
                '데이트',
                '가족여행',
                '친구',
                '나는 SOLO',
                '분위기',
                '힐링',
                '지역주민추천',
                '2030',
              ].map((tag) => (
                <CategoryButton
                  key={tag}
                  title={tag}
                  onClick={(event) => handleTagClick(tag, event)}
                  selected={selectedTags.includes(tag)}
                />
              ))}
            </CategoryButtonContainer>
          </div>
          <ReviewBtnBox>
            <ReviewBottomSection>
              <ReviewBackButton onClick={handleBackClick}>
                뒤로
              </ReviewBackButton>
            </ReviewBottomSection>
            <ReviewBottomSection>
              <ReviewNextButton>작성하기</ReviewNextButton>
            </ReviewBottomSection>
          </ReviewBtnBox>
        </div>
      </div>
    </form>
  );
};

export default TReviewCreate3;

const ReviewBtnBox = styled.div`
  display: flex;
  justify-content: center;
`;

const ReviewBackButton = styled.button`
  background-color: #5ac8ec;
  color: white;
  justify-content: center;
  border: none;
  width: 160px;
  height: 50px;
  border-radius: 16px;
  cursor: pointer;

  &:hover {
    background-color: #cff4ff;
  }
`;

const HashTagContainer = styled.div`
  display: flex;
  gap: 30px;
  padding: 20px 0 0 0;
`;

const HashTagTitle = styled.div`
  font-weight: bold;
  margin-right: 20px;
`;

const HashTagDescription = styled.div`
  color: #238bad;
  font-weight: 600;
`;
const CategoryButtonContainer = styled.div`
  display: flex;
  width: 400px;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0 80px 90px;
`;

const ContentTextarea = styled.textarea`
  width: 700px;
  height: 150px;
  /* border: 1px solid #ccc; */
  padding: 10px;
  font-size: 15px;
  margin: 10px 0;
  border-radius: 4px;
  border: none;
  resize: none;
`;

const ReviewBoxWithSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    padding-left: 5px;
  }
`;

const ReviewBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px 0px;
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  div {
    padding-left: 5px;
  }
`;

const ReviewBottomSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 15px;
`;

const ReviewNextButton = styled.button`
  background-color: #5ac8ec;
  color: white;
  justify-content: center;
  border: none;
  width: 160px;
  height: 50px;
  border-radius: 16px;
  cursor: pointer;

  &:hover {
    background-color: #cff4ff;
  }
`;

const Title = styled.div`
  margin-left: 10px;
`;