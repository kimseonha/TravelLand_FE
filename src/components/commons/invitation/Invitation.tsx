import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import Button from '../buttons/Button';
import { InvitationModal } from '../modals/Modal';
import * as S from './Invitation.style';
import { InvitedPerson } from '@/components/plans/planComponents/PlanDetail';
import { useNicknameSearchQuery } from '@/hooks/useQuery/useTravelPlanQuery';

interface InvitationProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (user: InvitedPerson) => void;
}

export const Invitation: React.FC<InvitationProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<InvitedPerson | null>(null);
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useNicknameSearchQuery(searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // selectedUser 전체 객체를 저장하는 로직
  const handleSelectionChange = (user: InvitedPerson) => {
    setSelectedUser(user);
  };

  const handleInvite = () => {
    if (selectedUser) {
      onInvite(selectedUser);
      setSearchTerm('');
      setSelectedUser(null);
      onClose();
    } else {
      alert('사용자를 선택해주세요.');
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedUser(null);
    onClose();
  };

  return (
    <>
      <InvitationModal isOpen={isOpen} onClose={handleClose}>
        <S.InvitationCloseButton onClick={onClose}>
          <IoClose size="50px" />
        </S.InvitationCloseButton>
        <S.InvitationHeader>
          <div style={{ marginTop: '30px' }}>
            함께 여행할 동행자를 선택해주세요
          </div>
        </S.InvitationHeader>
        <hr />
        <S.InvitationSearchBar>
          <S.InvitationSearchInput
            type="text"
            placeholder="동행자를 검색해주세요."
            required
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <S.InvitationSearchButton onClick={() => setSearchTerm(searchTerm)}>
            <FiSearch size="1.5em" />
          </S.InvitationSearchButton>
        </S.InvitationSearchBar>
        {isLoading && <div>검색 중...</div>}
        {isError && <div>검색에 실패했습니다: {error?.message}</div>}
        {users?.data && (
          <ul>
            {users.data.map(
              (
                user: InvitedPerson, // 타입 명시적 적용
              ) => (
                <li key={user.email}>
                  <label>
                    <input
                      type="radio"
                      name="selectedUser"
                      value={user.email}
                      checked={selectedUser?.email === user.email}
                      onChange={() => handleSelectionChange(user)}
                    />
                    {user.nickname} ({user.email})
                  </label>
                </li>
              ),
            )}
          </ul>
        )}
        <Button
          text="초대하기"
          onClick={handleInvite}
          color="#5ac8ec"
          height="50px"
          width="160px"
          textColor="white"
          borderColor="transparent"
          borderRadius="16px"
        />
      </InvitationModal>
    </>
  );
};
