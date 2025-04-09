import { Box, Button, Input, FormControl, FormLabel, Heading, VStack } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AuthContext } from "../features/authContext";
import API from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const phone = window.history.state?.usr?.phone || "";
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {
        try {
            const res = await API.post("/auth/verify-otp", { phone, otp });
            alert("Login Successful");
            const { token, user } = res.data;
            login(token, user);
            navigate("/chats");
        } catch (err) {
            alert(err.response.data.message || err.response.data.error);
        }
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
            <Box p={6} maxW={{ base: "90%", md: "400px" }} w="full" borderWidth={1} borderRadius="md" boxShadow="md">
                <Heading mb={4} textAlign="center">Verify OTP</Heading>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel>Enter OTP</FormLabel>
                        <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter opt"/>
                    </FormControl>
                    <Button colorScheme="green" width="full" onClick={verifyOtp}>Verify & Login</Button>
                </VStack>
            </Box>
        </Box>
    );
};

export default VerifyOtp;


