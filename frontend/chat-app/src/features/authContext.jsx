import { createContext, useState } from "react";
import API from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Get user from localStorage if available
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData)); // Store user data
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Remove user data
        setUser(null);
    };

    const updateUser = (updatedData) => {
        setUser(updatedData);
        localStorage.setItem("user", JSON.stringify(updatedData));
    }

    const deleteAccount = async() => {
        try {
            await API.delete("/user/delete");
            logout()
            alert("Account Deleted Successfully!");
        } catch (err) {
            alert(err.response.data.message || err.response.data.error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, deleteAccount, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
