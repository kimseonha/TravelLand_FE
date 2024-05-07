// import { NicknameModal } from '@/components/commons/modals/Modal';
import { LoadingComponent } from '@/components/layouts/LoadingComponent';
import { useGetUerInfoQuery } from '@/hooks/useQuery/useUserQuery';
import * as S from '@components/commons/user/myPage/MyPage.style';
import { useState } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import { useUpdateNickname } from '@/hooks/useMutation/useUserMutation';
import Modal from '@/components/commons/modals/Modal';

const MyPageUserInfo = () => {
  const { data, isLoading, isError, refetch } = useGetUerInfoQuery();
  const [modalOpen, setModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const { mutate: updateNickname } = useUpdateNickname();

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(event.target.value);
  };

  // 닉네임 변경 실행
  const handleUpdateNickname = () => {
    if (!newNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    updateNickname(newNickname, {
      onSuccess: () => {
        alert('닉네임이 변경되었습니다.');
        setModalOpen(false); // 모달 닫기
        refetch();
      },
      onError: (error) => {
        alert(`닉네임 변경에 실패했습니다: ${error.message}`);
      },
    });
  };

  const handleModalOpen = () => {
    console.log('모달 열기');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    console.log('모달 닫기');
    setModalOpen(false);
  };

  const userData = data?.data;
  if (isLoading)
    return (
      <div>
        <div>{LoadingComponent()}</div>
      </div>
    );
  if (isError) return <div>Error occurred during fetching</div>;
  return (
    <>
      <S.MyPageContainer>
        {' '}
        <S.UserInfoContainer>
          {/* 유저 정보 영역 */}
          {/* 이미지 */}
          <img src={userData.profileImage} />
          {/* 닉네임 & 이메일 */}
          <S.UserInfoCotent>
            <S.UserInfoContentName>
              <div>{userData.nickname}</div>
              <div>{userData.email}</div>
            </S.UserInfoContentName>
            {/* 회원정보 수정하기 버튼 */}
            <button
              onClick={() => {
                handleModalOpen();
              }}
            >
              회원정보 수정하기
            </button>
          </S.UserInfoCotent>
        </S.UserInfoContainer>
        {/* 빈 박스 영역 */}
        <S.UserOtherInfoContainer />
      </S.MyPageContainer>
      <Modal isOpen={modalOpen} onClose={handleModalClose}>
        <div style={{ position: 'relative', padding: '20px' }}>
          <CloseButton onClick={handleModalClose}>
            <IoClose size="50px" />{' '}
          </CloseButton>
          <h2>닉네임 변경</h2>
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <NicknameInput
              type="text"
              placeholder="새 닉네임 입력"
              value={newNickname}
              onChange={handleNicknameChange}
            />
            <NicknameBtn onClick={handleUpdateNickname}>변경하기</NicknameBtn>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MyPageUserInfo;

const NicknameInput = styled.input`
  width: 250px;
  height: 50px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #bbb;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

const NicknameBtn = styled.button`
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 10px;
  margin-left: 18px;
  font-size: 18px;
  background-color: #5ac8ec;
  color: #fff;
  font-weight: 600;
`;
