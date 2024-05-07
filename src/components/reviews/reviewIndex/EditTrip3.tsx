import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ToggleButton from '@/components/commons/buttons/ToggleButton';
import { ModernInput } from '@/components/commons/inputs/Input';
import CategoryButton from '@/components/commons/buttons/CategoryButton';
import { useUpdateTripMutation } from '@/hooks/useMutation/useTravelReviewMutation';
import * as S from '@/components/reviews/reviewIndex/CreateEditStyle';

const EditTrip3 = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isPublic, setIsPublic] = useState<boolean>(state?.isPublic || false);
  const [content, setContent] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasAttemptedSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (state) {
      setIsPublic(state.isPublic ?? false);
      setContent(state.content || '');
      setSelectedTags(state.hashTag || []);
    }
  }, [state]);
  console.log(state);
  // 해시태그
  useEffect(() => {
    if (state?.hashtagList) {
      setSelectedTags(state.hashtagList);
    }
  }, [state?.hashtagList]);

  // useUpdateTripMutation 훅을 여기서 호출합니다.
  const updateMutation = useUpdateTripMutation();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

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

  const handleBackClick = () => {
    navigate(-1);
  };

  // 여기에 제출 로직을 추가합니다.
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!state || !state.tripId) {
      console.error('Trip ID 없음');
      alert('Trip ID 없음');
      return;
    }

    const formData = new FormData();
    // 모든 데이터를 requestDto로 묶어서 JSON 문자열로 변환하여 전송
    formData.append(
      'requestDto',
      JSON.stringify({
        tripId: state.tripId,
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

    updateMutation.mutate({
      tripId: state.tripId,
      formData: formData,
    });

    localStorage.removeItem('editedReviewState');
    localStorage.removeItem('reviewState');
  };

  useEffect(() => {
    const storedData = localStorage.getItem('reviewState');
    if (storedData) {
      const initialData = JSON.parse(storedData);
      setContent(initialData.content || '');
      setSelectedTags(initialData.hashTag || []);
      setIsPublic(initialData.isPublic ?? false);
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: '700px', margin: '50px auto' }}
    >
      <div
        style={{
          fontSize: '28px',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '50PX',
        }}
      >
        여행 정보 수정하기
      </div>
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
              <S.ReviewNextButton>수정하기</S.ReviewNextButton>
            </S.ReviewBottomSection>
          </S.ReviewBtnBox>
        </div>
      </div>
    </form>
  );
};

export default EditTrip3;
