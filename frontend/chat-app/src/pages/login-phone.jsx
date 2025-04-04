import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  Heading, 
  VStack, 
  InputGroup, 
  InputLeftAddon 
} from "@chakra-ui/react";
import { useState } from "react";
import API from "../utils/axiosInstance";

const LoginWithPhone = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const sendOtp = async () => {
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    
    try {
      await API.post("/auth/send-otp", { phone: formattedPhone });
      alert("OTP Sent");
      navigate("/verify-otp", { state: { phone: formattedPhone } });
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box p={6} maxW={{ base: "90%", md: "400px" }} w="full" borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading mb={4} textAlign="center">Login with Phone</Heading>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Phone</FormLabel>
            <InputGroup>
              <InputLeftAddon children="+91" />
              <Input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} 
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />
            </InputGroup>
          </FormControl>
          <Button colorScheme="green" width="full" onClick={sendOtp}>Send OTP</Button>
          <Button variant="outline" width="full" onClick={() => navigate("/login-email")}>Login with Email</Button>
          <Button variant="link" onClick={() => navigate("/signup")}>Sign Up</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginWithPhone;
