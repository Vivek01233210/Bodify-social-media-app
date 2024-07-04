import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// import UpdatePost from './components/Posts/UpdatePosts';
import PublicNavbar from './components/Navbar/PublicNavbar';
import CreatePost from './components/Posts/CreatePost'
import PostsList from './components/Posts/PostsList'
import HomePage from './components/Home/HomePage';
import PostDetail from './components/Posts/PostDetail';
import Login from './components/User/Login';
import Register from './components/User/Register';
import Profile from './components/User/Profile';
import PrivateNavbar from './components/Navbar/PrivateNavbar';
import { checkAuthStatusAPI } from './APIServices/userAPI';
import { isAuthenticated } from './redux/slices/authSlice';
import Protected from "./components/Protected/Protected";
import UserDashboard from "./components/User/UserDashboard";
import AccountSummary from "./components/User/AccountSummary";
import AddCategory from "./components/Category/AddCategory";
import CreatePlan from "./components/Plan/CreatePlan";
import Pricing from "./components/Plan/Pricing";
import CheckoutForm from "./components/Plan/CheckoutForm";
import PaymentSuccess from "./components/Plan/PaymentSuccess";
import PayingFreePlan from "./components/Plan/PayingFreePlan";
import AccountVerification from "./components/User/AccountVerification";
import RequestResetPassword from "./components/User/RequestResetPassword";
import ResetPassword from "./components/User/ResetPassword";
import Rankings from "./components/User/CreatorsRanking";
import NotificationList from "./components/Notification/NotificationList";
import MyFollowers from "./components/User/MyFollowers";
import MyFollowing from "./components/User/MyFollowing";
import MyEarnings from "./components/User/MyEarning";
import MyPosts from "./components/User/MyPosts";
import UpdatePost from "./components/Posts/UpdatePost";
import Settings from "./components/User/SettingsPage";
import UpdateEmail from "./components/User/UpdateEmail";
import UploadProfilePicture from "./components/User/UploadProfilePicture";
import ListUsers from "./components/User/ListUsers";
import Admin from "./components/IsAdmin/AdminRoute";
import Footer from "./components/Footer/Footer.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";


function App() {

  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  const { userAuth } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(isAuthenticated(data));
  }, [data]);


  return (
    <BrowserRouter>
      {userAuth ? <PrivateNavbar /> : <PublicNavbar />}
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<HomePage />} path="/" />
        {!userAuth && <Route element={<Login />} path="/login" />}
        {!userAuth && <Route element={<Register />} path="/register" />}
        <Route element={<PostsList />} path="/posts" />
        <Route element={<PostDetail />} path="/posts/:postId" />

        {!userAuth?.hasSelectedPlan && <Route element={<Pricing />} path="/pricing" />}
        <Route element={<CheckoutForm />} path="/checkout/:planId" />
        <Route element={<RequestResetPassword />} path="/forgot-password" />
        <Route element={<ResetPassword />} path="/reset-password/:resetToken" />
        <Route element={<Rankings />} path="/ranking" />

        {/* PROTECTED ROUTES */}
        {/* <Route element={<Protected><Profile /></Protected>} path="/profile" /> */}
        <Route element={<Protected><PaymentSuccess /></Protected>} path="/success" />
        <Route element={<Protected><PayingFreePlan /></Protected>} path="/free-subscription" />

        <Route element={<UserDashboard />} path="/dashboard" >

          {/* ADMIN ROUTES */}
          <Route element={<Protected><Admin><ListUsers /></Admin></Protected>} path="list-all-users" />
          <Route element={<Protected><Admin><CreatePlan /></Admin></Protected>} path="add-plan" />
          <Route element={<Protected><Admin><AddCategory /></Admin></Protected>} path="add-category" />

          <Route element={<Protected><Profile /></Protected>} path="" />
          <Route element={<Protected><CreatePost /></Protected>} path="create-post" />
          <Route element={<Protected><AccountVerification /></Protected>} path="account-verification/:verifyToken" />
          <Route element={<Protected><NotificationList /></Protected>} path="notifications" />
          <Route element={<Protected><MyFollowers /></Protected>} path="my-followers" />
          <Route element={<Protected><MyFollowing /></Protected>} path="my-followings" />
          <Route element={<Protected><MyEarnings /></Protected>} path="my-earnings" />
          <Route element={<Protected><MyPosts /></Protected>} path="my-posts" />
          <Route element={<Protected><UpdatePost /></Protected>} path="update-post/:postId" />
          <Route element={<Protected><Settings /></Protected>} path="settings" />
          <Route element={<Protected><UpdateEmail /></Protected>} path="add-email" />
          <Route element={<Protected><UploadProfilePicture /></Protected>} path="upload-profile-photo" />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App;