import React, { useEffect, useState } from 'react';
// import { IoLocationSharp } from 'react-icons/io5';
import * as S from './Search.style';
import styled from 'styled-components';
import CategoryButton from '../commons/buttons/CategoryButton';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetSearchResultAreaQuery,
  useGetSearchResultHashtagQuery,
} from '@/hooks/useQuery/useMainQuery';
import { LoadingComponent } from '../layouts/LoadingComponent';
// import { IoLocationSharp } from 'react-icons/io5';

// interface IPlaceNameProps {
//   name: string;
// }

interface SearchResult {
  tripId: number;
  thumbnailUrl: string;
  area: string;
  tripStartDate: string;
  tripEndDate: string;
  title: string;
  content: string;
  placeName: string;
  hashtagList: string[]; // 카테고리는 문자열 배열로 가정합니다.
}

// 타입 안전성을 위한 추가적인 검사를 할 수 있습니다.
const validateData = (data: any): data is SearchResult[] => {
  return (
    Array.isArray(data) && data.every((item) => item.hasOwnProperty('tripId'))
  );
};

// const PlaceName: React.FC<IPlaceNameProps> = ({ name }) => (
//   <div style={{ color: '#3AB9F0' }}>{name}</div>
// );

const ResultsContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { area, hashtag } = location.state || {}; // Assume location.state could be undefined

  const [activeTab, setActiveTab] = useState(0); // 선택된 탭의 인덱스를 추적
  const [page, _] = useState<number>(1);
  const [size] = useState<number>(9);
  const [sortBy] = useState<string>('createdAt');
  const [isAsc] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]); // 검색 결과를 저장할 상태
  // const places = searchResults.map((result) => result.placeName); // placeName을 추출하여 배열로 저장

  const searchAreaParams = { area, page, size, sortBy, isAsc };
  const searchHashtagParams = { hashtag, page, size, sortBy, isAsc };

  // Custom hooks for fetching data
  const {
    data: areaResults,
    isLoading: areaLoading,
    isError: areaError,
  } = useGetSearchResultAreaQuery(searchAreaParams);

  const {
    data: hashtagResults,
    isLoading: hashtagLoading,
    isError: hashtagError,
  } = useGetSearchResultHashtagQuery(searchHashtagParams);

  const handleGoToDetail = (tripId: number) => {
    navigate(`/travelDetail/${tripId}`);
  };

  useEffect(() => {
    let results: any[] | ((prevState: SearchResult[]) => SearchResult[]) = [];
    if (areaResults && validateData(areaResults)) {
      results = results.concat(areaResults);
    }
    if (hashtagResults && validateData(hashtagResults)) {
      results = results.concat(hashtagResults);
    }
    if (location.state?.searchData) {
      results = results.concat(location.state.searchData);
    }
    setSearchResults(results);
  }, [areaResults, hashtagResults, location.state]);

  if (areaLoading || hashtagLoading)
    return (
      <div>
        <div>{LoadingComponent()}</div>
      </div>
    );
  if (areaError || hashtagError) return <div>Error loading data</div>;

  return (
    <S.ResultContainer>
      <S.ResultBox>
        <S.ResultTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 첫 번째 검색 결과의 placeName을 사용 */}
            {/* <span style={{ marginLeft: '0.3rem' }}>주변에 가볼만한 곳</span>
            {searchResults.length > 0 && (
              <PlaceName name={searchResults[0].placeName} />
            )} */}
          </div>
          {/* 모든 placeName 탭으로 처리하기 */}
          {/* {searchResults.map((result, index) => (
            <S.TabButton key={index} onClick={() => setActiveTab(index)}>
              <IoLocationSharp /> {result.placeName}
            </S.TabButton>
          ))} */}
        </S.ResultTitle>
      </S.ResultBox>
      <S.TabContainer>
        {/* {places.map((tab) => (
          <S.TabButton key={tab}>
            <IoLocationSharp /> {tab}
          </S.TabButton>
        ))} */}
      </S.TabContainer>
      <DivWrapper>
        <div>
          <SearchTitle
            className={activeTab === 0 ? 'active' : ''}
            onClick={() => setActiveTab(0)}
          >
            여행 정보
          </SearchTitle>
        </div>
        <Sort>
          {/* <SearchTitle
            className={activeTab === 1 ? 'active' : ''}
            onClick={() => setActiveTab(1)}
          >
            여행 플랜
          </SearchTitle> */}
        </Sort>
      </DivWrapper>

      {/* 검색 결과를 화면에 표시 */}
      <S.ResultsContainer>
        {searchResults.length === 0 ? (
          <Notfound>해당하는 게시물을 찾을 수 없습니다.</Notfound>
        ) : (
          searchResults.map((data, index) => (
            <S.ResultItem
              key={index}
              onClick={() => handleGoToDetail(data.tripId)}
            >
              <ThumbnailImage src={data.thumbnailUrl} alt="썸네일" />
              <S.ContentWrapper>
                <Location>
                  {data.area} | {`${data.tripStartDate} - ${data.tripEndDate}`}
                </Location>
                <S.ItemTitle>{data.title}</S.ItemTitle>
                <S.ItemContent>{data.content} ... 더보기</S.ItemContent>
                {/* 여기서 map 함수를 호출하기 전에 data.categories가 존재하고 배열인지 확인합니다. */}
                <CategoriesContainer>
                  {Array.isArray(data.hashtagList) &&
                    data.hashtagList.map(
                      (category: string, categoryIndex: number) => (
                        <CategoryButton key={categoryIndex} title={category} />
                      ),
                    )}
                </CategoriesContainer>
              </S.ContentWrapper>
            </S.ResultItem>
          ))
        )}
      </S.ResultsContainer>
    </S.ResultContainer>
  );
};

export default ResultsContent;

const Notfound = styled.div`
  font-size: 24px;
  margin-top: 20px;
`;

const ThumbnailImage = styled.img`
  width: 280px;
  height: 220px;
  box-sizing: border-box;
`;

const DivWrapper = styled.div`
  display: flex;
  position: relative;
  border-bottom: 2px solid #eee;
  width: 1200px;
`;
const SearchTitle = styled.div`
  width: 110px;
  cursor: pointer;
  font-size: 24px;
  font-weight: 600;
  padding: 60px 0 30px 0;
  position: relative;
  text-align: center;

  &.active::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -2px;
    transform: translateX(-50%);
    width: 100%;
    border-bottom: 3px solid #000;
  }
`;

// const DateRange = styled.div`
// `;

const Location = styled.div`
  font-size: 20px;
  /* font-weight: 600; */
`;

const CategoriesContainer = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0;
`;

const Sort = styled.div`
  margin-left: 20px;
`;
