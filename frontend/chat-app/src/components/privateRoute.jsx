import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../features/authContext";

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    return user ? children : <Navigate to="/login-email" />;
};

export default PrivateRoute;
