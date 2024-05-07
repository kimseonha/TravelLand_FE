import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '@/components/layouts/HeaderStyle';
import SearchInput from '../search/SearchInput';
import logoImage from '@/icons/logo.svg';
import littleLogo from '/assets/icons/littleLogo.svg';
import burgerIcon from '@/icons/burger.svg';
import SearchModal from '@/pages/Search/SearchPageModal';
import { useAuthStore } from '@/store/useAuthStore';
import { Cookies } from 'react-cookie';
import Button from '../commons/buttons/Button';
import Vote from '../vote/Vote';
import Login from '@/pages/user/Login';
import { getLogout } from '@/api/userAxios';

export interface SearchInputContainerProps {
  isScrolled: boolean;
}

export interface UsersProps {
  isLoggedIn: boolean;
}

export interface HeaderProps {
  needSearchInput?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const ReDesignHeader: React.FC<HeaderProps> = ({
  // needSearchInput,
  onClick,
}) => {
  const navigate = useNavigate();
  const { logout, isLoggedIn, login } = useAuthStore(); // 로그인 함수를 가져옵니다.
  const cookie = new Cookies();
  // 메뉴 모달
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  // 로그인 모달
  const [isModalOpen, setIsModalOpen] = useState(false); // 로그인 모달 상태 추가
  // const [isLoggedIn, _] = useState(true); // 로그인 상태를 관리하는 상태 추가
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false); // 알림 모달 상태 관리
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false); // 투표 모달
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태

  useEffect(() => {
    // 헤더 클릭 후 localStorage에서 'planData','reviewState','updatePlanData1'를 삭제
    localStorage.removeItem('planData');
    localStorage.removeItem('reviewState');
    localStorage.removeItem('updatePlanData1');

    // 쿠키에서 로그인 토큰 확인
    const token = cookie.get('Authorization');
    if (token) {
      // 토큰이 존재하면 로그인 상태를 true로 설정
      login(); // 로그인 처리 함수, 실제 함수명은 useAuthStore에서 제공하는 함수명으로 대체 필요
    } else {
      // 토큰이 존재하지 않으면 로그인 상태를 false로 설정
      logout();
    }
  }, []);

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 모달이 열려있을 때만 처리
    if (isModalOpen || isSearchModalOpen) {
      const target = event.target as HTMLElement;
      // 모달 영역이 아닌 곳을 클릭했을 때 모달을 닫는다.
      if (
        !target.closest('.modal-container') &&
        !target.closest('.modal-button')
      ) {
        setIsModalOpen(false);
        setSearchModalOpen(false);
      }
    }
    if (onClick) {
      onClick(event);
    }
  };
  // 검색어 입력 시 호출될 함수
  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
  };
  // 검색 아이콘 클릭 시 호출될 함수
  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      // 검색어가 있으면 검색 결과 페이지로 이동
      navigate('/results', { state: searchQuery });
    } else {
      // 검색어가 없으면 검색 모달 토글
      toggleSearchModal();
    }
  };
  // 검색 모달을 토글하는 함수
  const toggleSearchModal = () => {
    setSearchModalOpen(!isSearchModalOpen);
  };

  // 검색 모달을 여는 함수
  const openSearchModal = () => {
    setSearchModalOpen(true);
  };

  // 검색 모달을 닫는 함수
  const closeSearchModal = () => {
    setSearchModalOpen(false);
  };

  // 버거 메뉴 모달
  const handleBurgerIconClick = () => {
    if (isNoticeModalOpen) {
      setIsNoticeModalOpen(false);
    }
    setIsMenuModalOpen((prevState) => !prevState);
  };

  // 메뉴 모달 닫기
  // const closeMenuModal = () => {
  //   setIsMenuModalOpen(false);
  // };

  // mypage 이동
  const handleOpenMypage = () => {
    navigate('/user/myPage');
    closeModal();
  };
  // 플랜 작성하기 이동
  const handleOpenPlanCreate = () => {
    navigate('/planCreate/1');
    closeModal();
  };
  // 여행 정보 작성하기 이동
  const handleOpenTripCreate = () => {
    navigate('/travelCreate');
    closeModal();
  };

  // 로그인 모달 열기
  const handleOpenLogin = () => {
    setIsModalOpen(true); // 로그인 모달 상태를 true로 변경
    setIsMenuModalOpen((prevState) => !prevState);
  };
  // 로그아웃 처리
  const handleLogoutClick = () => {
    getLogout()
      .then(() => {
        // API 호출 후 로그아웃 처리
        logout(); // 상태 관리 로그아웃 처리
        cookie.remove('Authorization', { path: '/' });
        alert('로그아웃 되었습니다!');
        navigate('/'); // 홈으로 이동
        setIsMenuModalOpen((prevState) => !prevState);
      })
      .catch((error: any) => {
        console.error('Logout failed:', error);
        alert('로그아웃에 실패했습니다.');
        closeModal();
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsMenuModalOpen(false);
    setIsNoticeModalOpen(false);
  };

  // 로고 클릭 시 메인 페이지 이동
  const handleMainPage = () => {
    navigate('/');
    closeModal();
  };

  // 모달 토글 함수
  const handleNoticeClick = () => {
    if (isMenuModalOpen) {
      setIsMenuModalOpen(false);
    }
    setIsNoticeModalOpen((prevState) => !prevState); // 현재 상태의 반대로 설정
  };

  // 투표 모달을 여는 함수
  const handleOpenVoteModal = () => {
    setIsVoteModalOpen(true);
    closeModal();
  };

  // 투표 모달을 닫는 함수
  const handleCloseVoteModal = () => {
    setIsVoteModalOpen(false);
    closeModal();
  };

  // 초대 수락 함수
  const handleAcceptClick = () => {
    alert('현재 개발 중입니다!');
    closeModal();
  };

  // 초대 거절 함수
  const handleDenyClick = () => {
    alert('현재 개발 중입니다!');
    closeModal();
  };

  // 스크롤에 따라 상태 변경
  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 50;
      setIsScrolled(shouldBeScrolled);
      closeModal();
    };

    window.addEventListener('scroll', handleScroll);
    closeModal();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      closeModal();
    };
  }, []);

  const handleMakePlanClick = () => {
    navigate('/planList');
    closeModal();
  };

  const handleReviewPageClick = () => {
    navigate('/travelReview');
    closeModal();
  };

  // 로그인 상태에 따라 보여지는 컨텐츠가 달라지도록 조건부 렌더링 처리
  return (
    <S.Header onClick={handleOutsideClick}>
      <S.StickyHeader isScrolled={isScrolled}>
        <S.Container>
          {isScrolled ? (
            <>
              <S.Logo onClick={handleMainPage}>
                <img src={littleLogo} alt="떠나볼까 작은 로고" />
              </S.Logo>
            </>
          ) : (
            <>
              <S.Logo onClick={handleMainPage}>
                <img src={logoImage} alt="떠나볼까 로고" />
              </S.Logo>
            </>
          )}
          <SearchInput
            placeholder="어디로 떠나볼까요?"
            openSearchModal={toggleSearchModal}
            onIconClick={handleSearchIconClick}
            onInputChange={handleSearchInputChange}
          />
          <S.MenuContainer>
            {/* 알림 */}
            <S.BurgerMenuIcon>
              {isLoggedIn ? (
                <>
                  <img
                    src="/assets/icons/bell.svg"
                    onClick={handleNoticeClick}
                  />
                  <img
                    src={burgerIcon}
                    alt="메뉴 모달 열기"
                    onClick={handleBurgerIconClick}
                  />
                </>
              ) : (
                <div onClick={handleOpenLogin} style={{ fontSize: '20px' }}>
                  로그인
                </div>
              )}
            </S.BurgerMenuIcon>
            {isMenuModalOpen ? (
              <>
                {!isLoggedIn ? (
                  <></>
                ) : (
                  <>
                    <S.BurgerMenuList isLoggedIn={isLoggedIn}>
                      <button onClick={handleOpenMypage}>마이페이지</button>
                      <hr />
                      <button onClick={handleOpenPlanCreate}>
                        여행 플랜 작성하기
                      </button>
                      <hr />
                      <button onClick={handleOpenTripCreate}>
                        여행 정보 작성하기
                      </button>
                      <hr />
                      <button onClick={handleLogoutClick}>로그아웃</button>
                    </S.BurgerMenuList>
                  </>
                )}
              </>
            ) : (
              ''
            )}
            {/* {isNoticeModalOpen && <NoticeModal />} */}
            {isNoticeModalOpen ? (
              <>
                <S.ModalContainer>
                  <S.MenuItem>
                    <S.TitleBox>
                      <S.Title>
                        {' '}
                        <img src="/assets/icons/blueDot.svg" />
                        봄날의 고성
                      </S.Title>{' '}
                      플랜에 초대되었습니다. 수락하시겠습니까?
                    </S.TitleBox>
                    <div>
                      <Button
                        text="거절"
                        color="#F6F6F6"
                        textColor="gray"
                        borderRadius="15px"
                        width="100px"
                        borderColor="#F6F6F6"
                        marginRight="5px"
                        onClick={handleDenyClick}
                      />
                      <Button
                        text="수락"
                        borderRadius="15px"
                        width="100px"
                        onClick={handleAcceptClick}
                      />
                    </div>
                  </S.MenuItem>
                  <S.MenuItem>
                    <S.TitleBox>
                      <S.Title>
                        {' '}
                        <img src="/assets/icons/blueDot.svg" />
                        비가 안온다면 어떤 플랜이 나을까요?
                      </S.Title>{' '}
                      에 투표할 수 있습니다.
                    </S.TitleBox>
                    <div>
                      <Button
                        text="투표하러 가기"
                        color="#F6F6F6"
                        textColor="black"
                        borderRadius="15px"
                        width="130px"
                        borderColor="#F6F6F6"
                        onClick={handleOpenVoteModal}
                      />
                    </div>
                  </S.MenuItem>
                </S.ModalContainer>
              </>
            ) : (
              <></>
            )}
          </S.MenuContainer>
        </S.Container>
        <S.NavContainer>
          <S.NavItem onClick={handleReviewPageClick}>떠돌이 랜드</S.NavItem>
          <S.NavItem onClick={handleMakePlanClick}>어디로갈랜?</S.NavItem>
        </S.NavContainer>
      </S.StickyHeader>
      {/* 로그인 모달 */}
      {isModalOpen && <Login isOpen={isModalOpen} onClose={closeModal} />}
      {/* 검색 모달 */}
      {isSearchModalOpen && (
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={closeSearchModal}
          onSearch={openSearchModal}
        />
      )}
      {/* 투표 모달이 열렸을 때, Vote 컴포넌트를 렌더링합니다. */}
      {isVoteModalOpen && (
        <Vote isOpen={isVoteModalOpen} onClose={handleCloseVoteModal} />
      )}
    </S.Header>
  );
};

export default ReDesignHeader;
