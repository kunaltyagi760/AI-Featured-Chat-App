import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import API from "../utils/axiosInstance";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AuthContext } from "../features/authContext";
import { useNavigate } from "react-router-dom";

const LoginWithEmail = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", formData);
      alert("Login Successful");
      const { token, user } = res.data;
      login(token, user);
      navigate("/chats");
    } catch (err) {
      alert("Login Failed: " + (err.response.data.message || err.response.data.error));
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box p={6} maxW={{ base: "90%", md: "400px" }} w="full" borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading mb={4} textAlign="center">Login with Email</Heading>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" onChange={handleChange} placeholder="Enter your email" />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
                required
                w="full"
              />
              <InputRightElement>
                <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button colorScheme="blue" width="full" onClick={handleLogin}>Login</Button>
          <Button variant="outline" width="full" onClick={() => navigate("/login-phone")}>Login with Phone</Button>
          <Button variant="link" onClick={() => navigate("/signup")}>Sign Up</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginWithEmail;
