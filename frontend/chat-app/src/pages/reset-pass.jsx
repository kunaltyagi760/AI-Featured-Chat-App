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
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AuthContext } from "../features/authContext";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    setError("");
    try {
      await API.put("/user/reset-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      logout();
      alert("Password updated successfully");
      navigate("/login-email");
    } catch (err) {
        console.log(err)
      alert("Password reset failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box p={6} maxW={{ base: "90%", md: "400px" }} w="full" borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading mb={4} textAlign="center">Reset Password</Heading>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Old Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                placeholder="Enter old password"
                onChange={handleChange}
                required
              />
              <InputRightElement>
                <Button variant="ghost" onClick={() => togglePasswordVisibility("old")}>
                  {showPassword.old ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                onChange={handleChange}
                required
              />
              <InputRightElement>
                <Button variant="ghost" onClick={() => togglePasswordVisibility("new")}>
                  {showPassword.new ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Confirm New Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmNewPassword"
                placeholder="Confirm new password"
                onChange={handleChange}
                required
              />
              <InputRightElement>
                <Button variant="ghost" onClick={() => togglePasswordVisibility("confirm")}>
                  {showPassword.confirm ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {error && <Text color="red.500">{error}</Text>}
          <Button colorScheme="blue" width="full" onClick={handleResetPassword}>Reset Password</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default ResetPassword;