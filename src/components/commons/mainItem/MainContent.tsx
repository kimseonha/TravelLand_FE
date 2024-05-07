import React from 'react';
import MainCard from '@/components/commons/mainItem/MainCard';
import ListTitle from '@/components/commons/mainItem/ListTitle';
import MainList from '@/components/commons/mainItem/MainList';
import { ButtonContainer, ButtonsWrapper } from '../buttons/Button.style';
import Maintitle from './MainTitle';
import { SmallButton } from '../buttons/Button';
import {
  useGetMainRankListQuery,
  useGetMainRandomListQuery,
} from '@/hooks/useQuery/useMainQuery';
import { LoadingComponent } from '@/components/layouts/LoadingComponent';

const MainContent: React.FC = () => {
  // TopTen 데이터 페칭
  const {
    data: TopTenData,
    isLoading: isLoadingTopTen,
    isError: isErrorTopTen,
  } = useGetMainRankListQuery();

  // 랜덤 데이터 페칭
  const {
    data: randomData,
    isLoading: isLoadingRandom,
    isError: isErrorRandom,
  } = useGetMainRandomListQuery();

  // 로딩 상태 확인
  if (isLoadingTopTen || isLoadingRandom) {
    return (
      <div>
        <div>{LoadingComponent()}</div>
      </div>
    );
  }

  // 에러 상태 확인
  if (isErrorTopTen || isErrorRandom) {
    return <div>Error occurred</div>;
  }

  return (
    <div>
      <ButtonContainer>
        {/* 버튼 이벤트 핸들러 로직 */}
        {/* ... */}
      </ButtonContainer>
      <Maintitle />
      <ButtonsWrapper>
        <SmallButton text="전체" />
      </ButtonsWrapper>
      <MainCard cards={randomData?.data} />
      <ListTitle />
      <MainList items={TopTenData?.data} />
    </div>
  );
};

export default MainContent;
