import { useEffect, useState } from 'react';
import * as S from '../Plan.style';
import * as IS from '@components/commons/inputs/Input.style';
import * as PS from '@components/plans/Plan.style';
import Button from '@/components/commons/buttons/Button';
import { useLocation } from 'react-router-dom';
import { ModernInput } from '@/components/commons/inputs/Input';
import KaKaoMap from '@/components/maps/KaKaoMap';
import { TfiArrowCircleRight } from 'react-icons/tfi';
import { TimeSelectBox } from '@/components/commons/timeSelect/TimeSelectBox';
import { useCreatePlanMutation } from '@/hooks/useMutation/useTravelPlanMutation';

export interface UnitPlan {
  title: string;
  content: string;
  time: string;
  budget: number;
  place_name: string;
  address: string;
  x: number;
  y: number;
  budgetFormatted?: string; // 추가된 필드
}

export interface DayPlan {
  date: string;
  unitPlans: UnitPlan[];
}

export interface WholePlan {
  title: string;
  budget: number;
  area: string;
  isPublic: boolean;
  tripStartDate: string;
  tripEndDate: string;
  isVotable: boolean;
  dayPlans: DayPlan[];
}
// 날짜 변환 함수
const formatDate = (date: { toISOString: () => string }) => {
  return date.toISOString().split('T')[0]; // 날짜 부분만 추출 ('YYYY-MM-DD')
};

const formatDateForWholePlan = (date: Date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const PlanCreate2: React.FC = () => {
  const location = useLocation();

  const tripStartDate = new Date(location.state.tripStartDate);
  const tripEndDate = new Date(location.state.tripEndDate);

  const isPublic = location.state.isPublic;
  const area = location.state.area;
  const totalBudget = location.state.totalBudget;
  const totalPlanTitle = location.state.totalPlanTitle;
  const parsedTotalBudget = parseInt(totalBudget, 10); // 문자열을 숫자로 변환

  // useState부분
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const [unitPlans, setUnitPlans] = useState<UnitPlan[]>([
    {
      title: '',
      time: '00:00',
      place_name: '',
      address: '',
      content: '',
      budget: 0,
      x: 0,
      y: 0,
    },
  ]);

  const [wholePlan, _] = useState<WholePlan[]>([
    {
      title: totalPlanTitle,
      budget: isNaN(parsedTotalBudget) ? 0 : parsedTotalBudget, // 숫자 변환 실패 시 0으로 대체
      area,
      isPublic,
      tripStartDate: formatDate(tripStartDate),
      tripEndDate: formatDate(tripEndDate),
      isVotable: false,
      dayPlans: [],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);

  // 총 일수 계산
  const calculateTotalDays = () => {
    const start = tripStartDate;
    const end = tripEndDate;
    const diff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(diff / (1000 * 3600 * 24)) + 1; // 종료 날짜 포함
    return totalDays;
  };
  // 상태를 초기화하는 부분에서 함수를 호출
  const [totalDays, setTotalDays] = useState(calculateTotalDays());

  // startDate와 currentStep을 기반으로 해당 일차의 날짜 계산
  const calculateDateForStep = (start: string | Date, step: number): string => {
    const resultDate = new Date(start);

    resultDate.setDate(resultDate.getDate() + step + 1); // step이 0부터 시작으로 0인 경우 전일이 보여서 수정
    return formatDate(resultDate);
  };

  const [dayPlans, setDayPlans] = useState<DayPlan[]>([
    {
      date: calculateDateForStep(tripStartDate, 0),
      unitPlans: [],
    },
  ]);
  // Updates the time in unitPlans at the specified index
  const handleTimeChange = (
    part: 'hour' | 'minute',
    value: string,
    index: number,
  ) => {
    const updatedUnitPlans = [...unitPlans];
    let timeParts = updatedUnitPlans[index].time.split(':');

    if (part === 'hour') {
      timeParts[0] = value || '00';
    } else if (part === 'minute') {
      timeParts[1] = value || '00';
    }

    updatedUnitPlans[index].time = `${timeParts[0]}:${timeParts[1]}`;
    setUnitPlans(updatedUnitPlans);
  };

  useEffect(() => {
    setTotalDays(calculateTotalDays());
  }, [tripStartDate, tripEndDate]);

  const handleInputChange = (
    index: number,
    field: keyof UnitPlan,
    value: string,
  ) => {
    const newUnitPlans = [...unitPlans];
    if (field === 'budget') {
      // 숫자 이외의 문자를 제거하고, 콤마로 포맷합니다.
      const cleanedValue = value.replace(/[^0-9]/g, ''); // 숫자만 추출
      const numericValue = parseInt(cleanedValue, 10); // 정수 변환
      if (!cleanedValue) {
        newUnitPlans[index].budget = 0; // 값이 비어있으면 0을 저장
        newUnitPlans[index].budgetFormatted = ''; // 포맷된 값도 비워줍니다.
      } else if (!isNaN(numericValue)) {
        newUnitPlans[index].budget = numericValue; // 숫자로 변환하여 저장
        newUnitPlans[index].budgetFormatted = numericValue.toLocaleString(); // 콤마 포맷 적용
      } else {
        alert('숫자만 입력이 가능합니다.');
      }
    } else if (field === 'x' || field === 'y') {
      const numericValue = parseFloat(value);
      newUnitPlans[index][field] = isNaN(numericValue) ? 0 : numericValue;
    } else {
      newUnitPlans[index][field] = value;
    }
    setUnitPlans(newUnitPlans);
  };

  // KaKaoMap 컴포넌트에서 위치가 선택되었을 때 호출될 함수
  // 위치 선택 핸들러 수정
  const handleSelectPlace = (selectedLocation: any, index: number) => {
    const x = parseFloat(selectedLocation.x);
    const y = parseFloat(selectedLocation.y);
    const address =
      selectedLocation.road_address_name || selectedLocation.address_name;
    const place_name = selectedLocation.place_name;
    handleInputChange(index, 'x', x.toString());
    handleInputChange(index, 'y', y.toString());
    handleInputChange(index, 'address', address);
    handleInputChange(index, 'place_name', place_name);
    setIsModalOpen(false);
  };

  const handleOpenMapClick = (index: number) => {
    setSelectedLocationIndex(index);
    setIsModalOpen(true);
  };

  // 추가하기 버튼
  const handlePlanAdd = () => {
    // 현재 unitPlans에 새 UnitPlan 추가
    const newUnitPlan = {
      title: '',
      time: '00:00',
      address: '',
      content: '',
      place_name: '',
      budget: 0,
      x: 0,
      y: 0,
    };

    const updatedUnitPlans = [...unitPlans, newUnitPlan];
    setUnitPlans(updatedUnitPlans);
  };

  const handleDeleteUnitPlanClick = (index: number) => {
    if (index > 0) {
      // 첫 번째 unitPlan은 삭제되지 않도록 함
      const updatedUnitPlans = unitPlans.filter((_, idx) => idx !== index);
      setUnitPlans(updatedUnitPlans);
    }
  };

  useEffect(() => {
    // 현재 단계의 DayPlan에 현재 unitPlans를 저장합니다.
    const newDayPlans = [...dayPlans];
    newDayPlans[currentStep] = {
      ...newDayPlans[currentStep],
      unitPlans: [...unitPlans],
    };

    setDayPlans(newDayPlans);
  }, [unitPlans, currentStep]);

  // handleDayChange 함수 내에서 currentStep 업데이트 로직 확인 및 최적화
  const handleDayChange = (stepIndex: number) => {
    // 현재 일차의 데이터를 저장합니다.
    const newDayPlans = [...dayPlans];

    // 현재 일차 데이터 업데이트
    if (newDayPlans[currentStep]) {
      newDayPlans[currentStep] = {
        ...newDayPlans[currentStep],
        unitPlans: [...unitPlans],
      };
    } else {
      // 현재 일차 데이터가 없다면 새로운 DayPlan 생성
      newDayPlans[currentStep] = {
        date: calculateDateForStep(tripStartDate, currentStep),
        unitPlans: [...unitPlans],
      };
    }

    // 새로운 일차를 추가하기 전에 마지막 일차가 있는지 확인하고, 없으면 추가합니다.
    if (stepIndex >= newDayPlans.length) {
      for (let i = newDayPlans.length; i <= stepIndex; i++) {
        newDayPlans.push({
          date: calculateDateForStep(tripStartDate, i),
          unitPlans: [],
        });
      }
    }

    // DayPlans 배열을 업데이트
    setDayPlans(newDayPlans);

    // 새 일차로 변경
    setCurrentStep(stepIndex);

    // 선택된 일차의 UnitPlans 로드하거나 초기화
    setUnitPlans(
      newDayPlans[stepIndex].unitPlans.length > 0
        ? newDayPlans[stepIndex].unitPlans
        : [
            {
              title: '',
              time: '',
              place_name: '',
              address: '',
              content: '',
              budget: 0,
              x: 0,
              y: 0,
            },
          ],
    );
  };

  const createPlanList = useCreatePlanMutation();

  // 등록하기 버튼
  const handlePlanSubmit = () => {
    // 현재 unitPlans에 내용이 있는지 확인
    const isUnitPlansEmpty = unitPlans.every(
      (unitPlan) => !unitPlan.title && !unitPlan.content,
    );
    // 마지막 일차의 unitPlans가 비어있지 않다면 업데이트
    if (!isUnitPlansEmpty) {
      const updatedDayPlans = [...dayPlans];
      if (updatedDayPlans.length === currentStep + 1) {
        updatedDayPlans[currentStep] = {
          ...updatedDayPlans[currentStep],
          unitPlans: unitPlans,
        };
      } else {
        // 마지막 일차가 아직 작성되지 않았다면 추가
        updatedDayPlans.push({
          date: calculateDateForStep(tripStartDate, updatedDayPlans.length),
          unitPlans: unitPlans,
        });
      }
      // `totalBudget`를 숫자로 파싱
      const numericBudget = parseInt(wholePlan[0].budget.toString(), 10);
      const validBudget = isNaN(numericBudget) ? 0 : numericBudget;

      // wholePlan을 객체로 설정하여 전송
      const planToSubmit = {
        ...wholePlan[0],
        title: totalPlanTitle,
        area: area,
        budget: validBudget, // 숫자로 변환된 예산 적용
        tripStartDate: formatDateForWholePlan(tripStartDate), // 포맷된 날짜로 확정
        tripEndDate: formatDateForWholePlan(tripEndDate), // 포맷된 날짜로 확정
        dayPlans: updatedDayPlans,
      };

      // 여기서 API 호출 등의 추가 작업을 수행할 수 있습니다.

      createPlanList.mutate(planToSubmit);
      setIsSubmit(true);
      localStorage.removeItem('planData');
    } else {
      // 마지막 일차의 unitPlans가 비어 있다면, 사용자에게 작성을 유도하는 메시지 표시
      alert('마지막 일차의 계획을 완성해주세요.');
    }
  };

  return (
    <>
      {/* 여행 일자 박스 영역 */}
      <S.PlanDetailDateBox>
        {Array.from({ length: totalDays }, (_, index) => (
          <S.PlanDetailDateButton
            key={index}
            onClick={() => handleDayChange(index)}
            isActive={currentStep === index}
          >
            {`${index + 1}일차`}
            {currentStep === index && (
              <>
                <hr />
                <div>{calculateDateForStep(tripStartDate, index)}</div>
              </>
            )}
          </S.PlanDetailDateButton>
        ))}
      </S.PlanDetailDateBox>
      {/* 스태퍼 박스 영역 */}

      {unitPlans.map((input, index) => (
        <>
          <div style={{ marginBottom: '20px' }}>
            <S.PlanDetailCreateBox>
              <IS.PlanListInputContainer key={index}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {/* 첫 번째 작성 영역이 아닐 때만 삭제 버튼을 보여줌 */}
                  {index > 0 && (
                    <Button
                      text="삭제하기"
                      borderColor="gray"
                      color="white"
                      textColor="gray"
                      hoverColor="#5AC8EC"
                      onClick={() => handleDeleteUnitPlanClick(index)}
                    />
                  )}
                </div>
                {/* 출발지 영역 */}
                <IS.ListInputbox>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                  >
                    제목 &nbsp; <img src="/assets/icons/requiredPoint.svg" />
                  </div>
                  <input
                    placeholder="제목을 입력해주세요"
                    value={input.title}
                    onChange={(e) =>
                      handleInputChange(index, 'title', e.target.value)
                    }
                  />
                </IS.ListInputbox>
                {/* 시간 영역 */}
                <IS.ListInputbox>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                  >
                    시간 &nbsp; <img src="/assets/icons/requiredPoint.svg" />
                  </div>{' '}
                  <div key={index}>
                    <TimeSelectBox
                      hourValue={input.time.split(':')[0]}
                      minuteValue={input.time.split(':')[1]}
                      onHourChange={(hour) =>
                        handleTimeChange('hour', hour, index)
                      }
                      onMinuteChange={(minute) =>
                        handleTimeChange('minute', minute, index)
                      }
                    />
                  </div>
                </IS.ListInputbox>
                {/* 일정 영역 */}
                <IS.ListInputbox>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                  >
                    일정 &nbsp; <img src="/assets/icons/requiredPoint.svg" />
                  </div>
                  <ModernInput
                    placeholder="일정을 입력해주세요."
                    value={input.content}
                    type="text"
                    height={50}
                    onChange={(e) =>
                      handleInputChange(index, 'content', e.target.value)
                    }
                  />
                </IS.ListInputbox>
                {/* 경비 영역 */}
                <IS.ListInputbox>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                  >
                    경비 &nbsp; <img src="/assets/icons/requiredPoint.svg" />
                  </div>
                  <ModernInput
                    placeholder="경비는 숫자로 입력해주세요."
                    value={input.budgetFormatted || ''}
                    type="text" // Set input type as number to allow only numeric values
                    height={50}
                    onChange={(e) =>
                      handleInputChange(index, 'budget', e.target.value)
                    }
                  />
                </IS.ListInputbox>
                {/* 위치 영역 */}
                <IS.ListInputboxWithFlex>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                  >
                    위치 &nbsp; <img src="/assets/icons/requiredPoint.svg" />
                  </div>
                  <IS.ListContent>
                    <ModernInput
                      placeholder="우측 화살표를 클릭하여 지도에서 검색해서 입력해주세요."
                      value={
                        input.place_name && input.address
                          ? `${input.place_name}, ${input.address}`
                          : ''
                      }
                      readonly={true}
                      type={'text'}
                      border="transparent"
                      width={1000}
                      fontSize={18}
                    />
                    <IS.ImgBox>
                      <TfiArrowCircleRight
                        size="35px"
                        color="lightGray"
                        onClick={() => handleOpenMapClick(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    </IS.ImgBox>
                  </IS.ListContent>
                </IS.ListInputboxWithFlex>
              </IS.PlanListInputContainer>
            </S.PlanDetailCreateBox>
          </div>
        </>
      ))}

      <PS.ButtonBox>
        <Button
          text="+"
          width="78%"
          height="60px"
          color="white"
          borderColor="gray"
          borderRadius="25px"
          textColor="gray"
          onClick={handlePlanAdd}
        />
      </PS.ButtonBox>
      {/* 등록하기 버튼 영역 */}
      <S.ButtonBoxToRight>
        <Button
          text="등록하기"
          width="150px"
          height="50px"
          borderRadius="15px"
          fontWeight="bold"
          textColor="white"
          color="#5AC8EC"
          borderColor="#5AC8EC"
          marginRight="15px"
          onClick={handlePlanSubmit} // 등록하기 버튼 클릭 핸들러 추가
          disabled={isSubmit}
        />
      </S.ButtonBoxToRight>

      {isModalOpen && (
        <KaKaoMap
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(location) =>
            handleSelectPlace(location, selectedLocationIndex)
          }
          searchKeyword=""
        />
      )}
    </>
  );
};

export default PlanCreate2;
