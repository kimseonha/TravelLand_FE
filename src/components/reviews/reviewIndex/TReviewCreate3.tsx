import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ToggleButton from '@/components/commons/buttons/ToggleButton';
import { ModernInput } from '@/components/commons/inputs/Input';
import * as S from '@/components/reviews/reviewIndex/CreateEditStyle';
import CategoryButton from '@/components/commons/buttons/CategoryButton';
import { useCreateTripMutation } from '@/hooks/useMutation/useTravelReviewMutation';

const TReviewCreate3 = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isPublic, setIsPublic] = useState<boolean>(state?.isPublic || false);
  const [content, setContent] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem('reviewState');
    if (savedData) {
      const { content, selectedTags, isPublic } = JSON.parse(savedData);
      setContent(content || '');
      setSelectedTags(selectedTags || []);
      setIsPublic(isPublic || false);
    }
  }, []);

  // 데이터 저장
  useEffect(() => {
    const data = {
      content,
      selectedTags,
      isPublic,
    };
    localStorage.setItem('reviewState', JSON.stringify(data));
  }, [content, selectedTags, isPublic]);

  useEffect(() => {
    const data = {
      content: content,
      selectedTags: selectedTags,
      isPublic: isPublic,
    };
    localStorage.setItem('reviewState', JSON.stringify(data));
  }, [content, selectedTags, isPublic]);

  console.log('Content:', content); // content 확인
  console.log('Selected Tags:', selectedTags);

  const handleTagClick = (
    tag: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // selectedTags가 배열이 아닌 경우 안전하게 처리
    if (!Array.isArray(selectedTags)) {
      console.error('selectedTags is not an array:', selectedTags);
      setSelectedTags([]); // 안전하게 빈 배열로 초기화
      return;
    }

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

  const handleBackClick = () => {
    navigate(-1);
  };
  const handleSaveToLocalStorage = () => {
    const data = {
      title: state.title,
      content: content,
      // 다른 필요한 데이터도 추가할 수 있습니다.
    };
    localStorage.setItem('reviewState', JSON.stringify(data));
  };

  const createMutation = useCreateTripMutation();
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    if (content.trim() === '' || selectedTags.length === 0) {
      alert('필수 입력 사항을 입력해주세요!');
      return;
    }

    // 작성 내용을 로컬 스토리지에 저장
    handleSaveToLocalStorage();

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
        placeName: state.placeName,
        isPublic: isPublic,
      }),
    );

    if (state.imageFiles.length > 0) {
      formData.append('thumbnail', state.imageFiles[0]);
    }
    state.imageFiles.slice(1).forEach((file: File) => {
      formData.append('imageList', file);
    });

    createMutation.mutate(formData);

    localStorage.removeItem('reviewState');
    console.log('Review state removed from localStorage');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '100%' }}>
          <S.Title>
            <S.TitleWithCircle>제목</S.TitleWithCircle>
          </S.Title>
          <S.ReviewBoxWithSpaceBetween>
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
              isChecked={isPublic}
              onToggle={() => setIsPublic(!isPublic)}
            />
          </S.ReviewBoxWithSpaceBetween>
          <S.ReviewBox>
            <S.ReviewContent>
              <div>
                <S.TitleWithCircle>내용</S.TitleWithCircle>
              </div>
              {hasAttemptedSubmit && content.trim() === '' && (
                <S.ErrorMessage>내용을 입력해주세요</S.ErrorMessage>
              )}
              <S.ContentTextarea
                placeholder="내용을 입력해주세요"
                value={content}
                onChange={handleContentChange}
              />
            </S.ReviewContent>
          </S.ReviewBox>
          <S.HashTagContainer>
            <div style={{ display: 'flex' }}>
              <S.HashTagTitle>
                <S.TitleWithCircle>해시태그</S.TitleWithCircle>
              </S.HashTagTitle>
              <S.HashTagDescription>
                최대 4개를 선택할 수 있어요
              </S.HashTagDescription>
            </div>
          </S.HashTagContainer>
          {hasAttemptedSubmit && selectedTags.length === 0 && (
            <S.ErrorMessage>1개이상 선택해주세요</S.ErrorMessage>
          )}
          <div>
            <S.CategoryButtonContainer>
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
                  cursor="pointer"
                  key={tag}
                  title={tag}
                  onClick={(event) => handleTagClick(tag, event)}
                  selected={selectedTags.includes(tag)}
                />
              ))}
            </S.CategoryButtonContainer>
          </div>
          <S.ReviewBtnBox>
            <S.ReviewBottomSection>
              <S.ReviewBackButton type="button" onClick={handleBackClick}>
                뒤로
              </S.ReviewBackButton>
            </S.ReviewBottomSection>
            <S.ReviewBottomSection>
              <S.ReviewNextButton>작성하기</S.ReviewNextButton>
            </S.ReviewBottomSection>
          </S.ReviewBtnBox>
        </div>
      </div>
    </form>
  );
};

export default TReviewCreate3;
