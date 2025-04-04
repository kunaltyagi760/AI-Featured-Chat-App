import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import API from "../utils/axiosInstance";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Image,
  VStack,
  InputLeftAddon,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";

import { AuthContext } from "../features/authContext";

const UserForm = ({ user = null }) => {
  const navigate = useNavigate();
  const {updateUser} = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    profileImage: null,
    password: "",
    confirmPassword: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone.slice(3) || "",
        location: user.location || "",
        age: user.age || "",
        profileImage: user.profileImage || null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let phoneValue = value.replace(/\D/g, ""); 
      if (phoneValue.length > 10) return;
      setFormData({ ...formData, phone: phoneValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("phone", `+91${formData.phone}`);

    for (let key in formData) {
      if (key !== "phone" && key !== "confirmPassword") {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      if (user) {
        const res = await API.put("/user/update", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const { updatedUser } = res.data;
        updateUser(updatedUser);
        alert("Profile updated successfully");
        navigate("/")
      } else {
        await API.post("/auth/signup", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Signup successful");
        navigate("/login-email");
      }
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.error || err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" p={{ base: 4, md: 6 }}>
      <Box p={{ base: 4, md: 6 }} maxW={{ base: "90%", md: "400px" }} w="full" borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading mb={4} textAlign="center">{user ? "Update Profile" : "Sign Up"}</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <InputGroup>
                <InputLeftAddon children="+91" />
                <Input type="tel" name="phone" placeholder="Enter 10-digit phone number" value={formData.phone} onChange={handleChange} required maxLength="10" />
              </InputGroup>
            </FormControl>

            {!user && (
              <>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" onChange={handleChange} required />
                    <InputRightElement>
                      <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} required />
                    <InputRightElement>
                      <Button variant="ghost" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {error && <Text color="red.500">{error}</Text>}
                </FormControl>
              </>
            )}

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" placeholder="Enter your location" value={formData.location} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Age</FormLabel>
              <Input type="number" name="age" placeholder="Enter your age" value={formData.age} onChange={handleChange} min="1" />
            </FormControl>

              <FormControl>
                <FormLabel>Profile Image</FormLabel>
                <Input type="file" accept="image/png, image/jpeg, image/svg" onChange={handleFileChange} />
                {preview && <Image src={preview} alt="Profile Preview" boxSize="100px" mt={2} />}
              </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
              {user ? "Update Profile" : "Sign Up"}
            </Button>
            {(!user) && <Button variant="outline" colorScheme="gray" width="full" onClick={() => navigate("/login-email")}>
              Already Signed Up? Login
            </Button>}
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default UserForm;
