import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMainSearchQuery } from '@/hooks/useQuery/useMainQuery';
import SearchModal from '../Search/SearchPageModal';
import PopupModal from '@/components/commons/modals/PopupModal';
import MainContent from '@/components/commons/mainItem/MainContent';

interface MainProps {
  onClick?: () => void;
}

const Main: React.FC<MainProps> = () => {
  const navigate = useNavigate();
  const [searchQuery] = useState(''); // 검색어 상태
  const [isSearchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    // 메인 페이지 로드 시 localStorage에서 'planData','reviewState','updatePlanData1'를 삭제
    localStorage.removeItem('planData');
    localStorage.removeItem('reviewState');
    localStorage.removeItem('updatePlanData1');
  }, []);

  // 팝업 모달을 닫기
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // '오늘 하루 그만 보기' 기능을 처리하는 함수
  const handleTodayClose = () => {
    // localStorage에 정보 저장
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('hideModalDate', today);
    setModalOpen(false);
  };

  // 로컬 스토리지에서 날짜 값을 확인
  useEffect(() => {
    const hideModalDate = localStorage.getItem('hideModalDate');
    const today = new Date().toISOString().split('T')[0];

    if (hideModalDate === today) {
      // 오늘 날짜에 '오늘 하루 그만 보기' 선택!
      setModalOpen(false);
    }
  }, []);

  // 검색 API
  const {
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    data: searchData,
  } = useGetMainSearchQuery(searchQuery);

  if (!searchQuery == null) {
  }

  const handleSearchResult = () => {
    if (searchData) {
      navigate('/search-results', { state: searchData });
    } else {
      closeSearchModal();
    }
  };

  // 모달을 토글하는 함수
  const toggleSearchModal = () => {
    setSearchModalOpen(!isSearchModalOpen);
  };

  // // // 모달을 닫는 함수
  const closeSearchModal = () => {
    setSearchModalOpen(false);
  };

  if (isLoadingSearch || isErrorSearch) {
    return <div>Error occurred</div>;
  }

  return (
    <>
      <div>
        <MainContent />
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={toggleSearchModal}
          onSearch={handleSearchResult}
        />
        <PopupModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTodayClose={handleTodayClose}
          imageUrl="/assets/popup.png"
        />
      </div>
    </>
  );
};

export default Main;
