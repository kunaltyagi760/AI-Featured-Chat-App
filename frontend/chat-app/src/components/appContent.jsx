import { Route, Routes, useLocation } from "react-router-dom";
import UserForm from "../pages/userForm";
import LoginWithEmail from "../pages/login-email";
import LoginWithPhone from "../pages/login-phone";
import VerifyOtp from "../pages/verify-otp";
import PrivateRoute from "./privateRoute";
import ChatList from "./chatList";
import Navbar from "./nav";
import UserList from "./home";
import ResetPassword from "../pages/reset-pass";
import { AuthContext } from "../features/authContext";
import { useContext } from "react";
import ChatWindow from "./chatWindow";
import AIChat from "./ai-chat";

function AppContent() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const hideNavbarRoutes = ["/signup", "/login-email", "/login-phone", "/verify-otp"];

    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            <Routes>
                <Route path="/" element={<UserList />} />
                <Route path="/signup" element={<UserForm />} />
                <Route path="/login-email" element={<LoginWithEmail />} />
                <Route path="/login-phone" element={<LoginWithPhone />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path='/chats' element={
                    <PrivateRoute>
                        <ChatList />
                    </PrivateRoute>}
                />
                <Route path='/reset-password' element={
                    <PrivateRoute>
                        <ResetPassword />
                    </PrivateRoute>}
                />
                <Route path='/update-profile' element={
                    <PrivateRoute>
                        <UserForm user={user} />
                    </PrivateRoute>}
                />
                <Route path='/chat/:chatId' element={
                    <PrivateRoute>
                        <ChatWindow />
                    </PrivateRoute>}
                />
                <Route path='/ai-chat' element={
                    <PrivateRoute>
                        <AIChat />
                    </PrivateRoute>}
                />
            </Routes>
        </>
    );
}

export default AppContent