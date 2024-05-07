import { useCallback, useEffect, useState } from 'react';
import * as S from '../Plan.style';
import * as IS from '@components/commons/inputs/Input.style';
import * as PS from '@components/plans/Plan.style';
import Button from '@/components/commons/buttons/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ModernInput } from '@/components/commons/inputs/Input';
import KaKaoMap from '@/components/maps/KaKaoMap';
// import { useCreatePlanMutaton } from '@/hooks/useMutation';
import { TfiArrowCircleRight } from 'react-icons/tfi';
import { TimeSelectBox } from '@/components/commons/timeSelect/TimeSelectBox';
import { useUpdatePlanMutation } from '@/hooks/useMutation/useTravelPlanMutation';

export interface UnitPlan {
  placeName?: string;
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
  planId: number;
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PlanUpdate2: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [isSubmit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [budget, setBudget] = useState<number>(0);
  const [area, setArea] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [tripStartDate, setTripStartDate] = useState<string>('');
  const [tripEndDate, setTripEndDate] = useState<string>('');
  const [isVotable, setIsVotable] = useState<boolean>(true);
  // 여기에 planId 상태를 추가합니다.
  const [planId, setPlanId] = useState<number>(0);

  useEffect(() => {
    if (location.state && location.state.planDetails) {
      const {
        planId,
        title,
        budget,
        area,
        isPublic,
        tripStartDate,
        tripEndDate,
        isVotable,
        dayPlans,
      } = location.state.planDetails as WholePlan;

      // 날짜 포맷을 수정하여 설정
      const formattedStartDate = formatDate(tripStartDate);
      const formattedEndDate = formatDate(tripEndDate);

      setPlanId(planId);
      setTitle(title);
      setBudget(budget);
      setArea(area);
      setIsPublic(isPublic);
      setTripStartDate(formattedStartDate);
      setTripEndDate(formattedEndDate);
      setIsVotable(isVotable);

      // 다음은 각 dayPlans의 각 unitPlan에 대해 초기 위치 값을 설정합니다.
      const updatedDayPlans = dayPlans.map((dayPlan) => ({
        ...dayPlan,
        unitPlans: dayPlan.unitPlans.map((unitPlan) => ({
          ...unitPlan,
          // 이 부분은 이미 적절한 값이 설정되어 있다고 가정합니다.
          // 없는 경우 빈 문자열로 처리할 수 있습니다.
          place_name: unitPlan.placeName || '',
          address: unitPlan.address || '',
        })),
      }));

      setDayPlans(updatedDayPlans || []);
    }
  }, [location.state]);

  const handleInputChange = useCallback(
    (
      index: number,
      field: keyof UnitPlan,
      value: string,
      dayIndex: number = currentStep,
    ) => {
      setDayPlans((current) =>
        current.map((day, idx) => {
          if (idx === dayIndex) {
            return {
              ...day,
              unitPlans: day.unitPlans.map((unit, unitIndex) => {
                if (unitIndex === index) {
                  return {
                    ...unit,
                    [field]: value,
                  };
                }
                return unit;
              }),
            };
          }
          return day;
        }),
      );
    },
    [currentStep],
  );

  const handleTimeChange = (
    part: 'hour' | 'minute',
    value: string,
    index: number,
  ) => {
    const timeParts = dayPlans[currentStep].unitPlans[index].time.split(':');
    if (part === 'hour') {
      timeParts[0] = value;
    } else if (part === 'minute') {
      timeParts[1] = value;
    }
    handleInputChange(index, 'time', timeParts.join(':'));
  };

  const handlePlanAdd = useCallback(() => {
    const newUnitPlan: UnitPlan = {
      title: '',
      content: '',
      time: '00:00',
      budget: 0,
      place_name: '',
      address: '',
      x: 0,
      y: 0,
    };
    setDayPlans((current) => {
      const updatedDayPlans = [...current];
      updatedDayPlans[currentStep].unitPlans.push(newUnitPlan);
      return updatedDayPlans;
    });
  }, [currentStep]);

  const handleOpenMapClick = useCallback((index: number) => {
    setSelectedLocationIndex(index);
    setIsModalOpen(true);
  }, []);

  // KaKaoMap 컴포넌트에서 위치가 선택되었을 때 호출될 함수
  // 위치 선택 핸들러 수정
  const handleSelectPlace = (selectedLocation: any, index: number) => {
    const x = parseFloat(selectedLocation.x);
    const y = parseFloat(selectedLocation.y);
    const address =
      selectedLocation.road_address_name || selectedLocation.address_name;
    const place_name = selectedLocation.place_name; // 변수 이름을 place_name으로 변경
    handleInputChange(index, 'x', x.toString());
    handleInputChange(index, 'y', y.toString());
    handleInputChange(index, 'address', address);
    handleInputChange(index, 'place_name', place_name); // 필드도 place_name으로 변경
    setIsModalOpen(false);
  };

  const handleDeleteUnitPlanClick = useCallback(
    (index: number) => {
      setDayPlans((current) => {
        const updatedDayPlans = [...current];
        updatedDayPlans[currentStep].unitPlans.splice(index, 1);
        return updatedDayPlans;
      });
    },
    [currentStep],
  );

  const handleDayChange = (index: number) => {
    setCurrentStep(index);
  };

  const handlePlanGoBack = () => {
    navigate(`/planUpdate/1/${planId}`);
  };

  const updatePlanList = useUpdatePlanMutation();
  const handlePlanUpdateSubmit = () => {
    const updatedWholePlan: WholePlan = {
      planId: planId,
      title: title,
      budget: budget,
      area: area,
      isPublic: isPublic,
      tripStartDate: formatDate(tripStartDate),
      tripEndDate: formatDate(tripEndDate),
      isVotable: isVotable,
      dayPlans: dayPlans,
    };

    updatePlanList.mutate(updatedWholePlan);
  };

  return (
    <>
      {/* 여행 일자 박스 영역 */}
      <S.PlanDetailDateBox>
        {dayPlans.map((dayPlan, index) => (
          <S.PlanDetailDateButton
            key={index}
            onClick={() => handleDayChange(index)}
            isActive={currentStep === index}
          >
            {`${index + 1}일차`}
            {currentStep === index && (
              <>
                <hr />
                <div>{dayPlan.date}</div>
              </>
            )}
          </S.PlanDetailDateButton>
        ))}
      </S.PlanDetailDateBox>
      {/* 스태퍼 박스 영역 */}

      {dayPlans[currentStep] &&
        dayPlans[currentStep].unitPlans.map((unitPlan, index) => (
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
                      value={unitPlan.title}
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
                        hourValue={unitPlan.time.split(':')[0]}
                        minuteValue={unitPlan.time.split(':')[1]}
                        onHourChange={(hour) =>
                          handleTimeChange('hour', hour, index)
                        }
                        onMinuteChange={(minute) =>
                          handleTimeChange('minute', minute, index)
                        }
                      />
                    </div>
                    {/* <input
                    placeholder="09:30"
                    value={input.time}
                    onChange={(e) =>
                      handleInputChange(index, 'time', e.target.value)
                    }
                  /> */}
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
                      value={unitPlan.content}
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
                      value={unitPlan.budget || ''}
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
                          unitPlan.place_name && unitPlan.address
                            ? `${unitPlan.place_name}, ${unitPlan.address}`
                            : `${unitPlan.place_name}${unitPlan.address}`
                        }
                        readonly={true}
                        type={'text'}
                        border="transparent"
                        width={1000}
                        fontSize={18}
                      />
                      <IS.ImgBox>
                        {/* <IoIosArrowDropright
                    color="lightGray"
                    size="2rem"
                    onClick={() => handleOpenMapClick(index)}
                  /> */}
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
          text="뒤로가기"
          width="150px"
          height="50px"
          borderRadius="15px"
          fontWeight="bold"
          textColor="white"
          color="#5AC8EC"
          borderColor="#5AC8EC"
          marginRight="15px"
          onClick={() => handlePlanGoBack()} // 뒤로가기 버튼 클릭 핸들러 추가
          disabled={isSubmit}
        />
        <Button
          text="수정하기"
          width="150px"
          height="50px"
          borderRadius="15px"
          fontWeight="bold"
          textColor="white"
          color="#5AC8EC"
          borderColor="#5AC8EC"
          marginRight="15px"
          onClick={handlePlanUpdateSubmit} // 수정하기 버튼 클릭 핸들러 추가
          disabled={isSubmit || !updatePlanList}
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

export default PlanUpdate2;
