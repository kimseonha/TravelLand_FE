import { createBrowserRouter } from 'react-router-dom';
import Main from '../pages/main/Main';
import KakaoRedirect from '@/pages/user/KakaoRedirect';
import MyPage from '@/pages/user/MyPage';
import SearchPage from '@/pages/Search/SearchPageModal';
import TravelReviewPage from '@/pages/travelReview/TravelReviewPage';
import TravelDetailPage from '@/pages/travelReview/TravelDetailPage';
import Login from '@/pages/user/Login';
import TravelPlanCreate1 from '@/pages/travelPlan/TravelPlanCreate1';
import TravelPlanCreate2 from '@/pages/travelPlan/TravelPlanCreate2';
import TravelPlanList from '@/pages/travelPlan/TravelPlanList';
import TravelPlanDetail from '@/pages/travelPlan/TravelPlanDetail';
import SearchResults from '@/pages/Search/SearchResults';
import ReviewCreatePage1 from '@/pages/travelReview/ReviewCreate1';
import ReviewCreate2 from '@/pages/travelReview/ReviewCreate2';
import ReviewCreate3 from '@/pages/travelReview/ReviewCreate3';
import GlobalStyle from '@/styles/GlobalStyles';
import App from '@/App';
import PrivateRoute from '@/components/PrivateRoute';
import TravelPlanUpdate1 from '@/pages/travelPlan/TravelPlanUpdate1';
import TravelPlanUpdate2 from '@/pages/travelPlan/TravelPlanUpdate2';
import EditTrip from '@/components/reviews/reviewIndex/EditTrip';
import EditTrip2 from '@/components/reviews/reviewIndex/EditTrip2';
import EditTrip3 from '@/components/reviews/reviewIndex/EditTrip3';

export const router = createBrowserRouter([
  {
    element: (
      <>
        <GlobalStyle />
        <App />
      </>
    ),
    children: [
      {
        path: '/',
        element: (
          <Main
            onClick={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        ),
      },
      {
        path: '/search',
        element: (
          <SearchPage
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
            onSearch={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        ),
      },
      { path: '/results', element: <SearchResults /> },
      { path: '/travelReview', element: <TravelReviewPage /> },
      { path: '/travelDetail/:tripId', element: <TravelDetailPage /> },
      { path: '/login/oauth', element: <KakaoRedirect /> },
      {
        path: '/user/myPage',
        element: (
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/login',
        element: (
          <Login
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        ),
      },
      {
        path: '/planCreate/1',
        element: (
          <PrivateRoute>
            <TravelPlanCreate1 />
          </PrivateRoute>
        ),
      },
      {
        path: '/planCreate/2',
        element: (
          <PrivateRoute>
            <TravelPlanCreate2 />
          </PrivateRoute>
        ),
      },
      { path: '/planList', element: <TravelPlanList /> },
      { path: '/planDetail/:id', element: <TravelPlanDetail /> },
      { path: '/TravelDetailPage/:tripId', element: <TravelDetailPage /> },
      {
        path: '/travelCreate',
        element: (
          <PrivateRoute>
            <ReviewCreatePage1 />
          </PrivateRoute>
        ),
      },
      {
        path: '/reviewCreate/2',
        element: (
          <PrivateRoute>
            <ReviewCreate2 />
          </PrivateRoute>
        ),
      },
      {
        path: '/reviewCreate/3',
        element: (
          <PrivateRoute>
            <ReviewCreate3 />
          </PrivateRoute>
        ),
      },
      {
        path: '/editTrip',
        element: (
          <PrivateRoute>
            <EditTrip />
          </PrivateRoute>
        ),
      },
      {
        path: '/editTrip/2',
        element: (
          <PrivateRoute>
            <EditTrip2 />
          </PrivateRoute>
        ),
      },
      {
        path: '/editTrip/3',
        element: (
          <PrivateRoute>
            <EditTrip3 />
          </PrivateRoute>
        ),
      },
      {
        path: '/planUpdate/1/:id',
        element: (
          <PrivateRoute>
            <TravelPlanUpdate1 />
          </PrivateRoute>
        ),
      },
      {
        path: '/planUpdate/2/:id',
        element: (
          <PrivateRoute>
            <TravelPlanUpdate2 />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
