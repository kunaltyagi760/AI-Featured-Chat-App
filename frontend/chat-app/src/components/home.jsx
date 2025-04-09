import { useState, useEffect, useCallback, useContext } from "react";
import {
    Input, Box, Button, Image, VStack, Text, Spinner, HStack, Center, Flex, useToast
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import { AuthContext } from "../features/authContext";

const UserList = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch Users
    const fetchUsers = async (query, pageNumber) => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.get(user ? "/user/profile" : "/user", {
                params: { search: query, page: pageNumber },
            });
            setUsers(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load users");
            setUsers([]);
            setTotalPages(0);
        }
        setLoading(false);
    };

    const debouncedFetchUsers = useCallback(
        debounce((query, pageNumber) => {
            fetchUsers(query, pageNumber);
        }, 1000),
        []
    );


    useEffect(() => {
        if (search) {
            debouncedFetchUsers(search, page);
        } else {
            fetchUsers("", page);
        }
    }, [search, page]);
    
    // Handle creating a chat and navigating to chat page
    const handleMessageClick = async (userId) => {
        if (!user) {
            navigate("/login-email");
            return;
        }

        try {
            const response = await API.post("/chats", { userId });
            const chatId = response.data.chatId;
            navigate(`/chat/${chatId}`);
        } catch (err) {
            toast({
                title: "Error",
                description: err.response?.data?.error || "Unable to create chat",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={6} textAlign="center">
            <Flex justify="center" align="center" gap={4} flexWrap="wrap" mb={4}>
                <Input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1);
                    }}
                    placeholder="Search by name, email, or location"
                    width={{ base: "80%", md: "50%" }}
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: "blue.500" }}
                    p={2}
                />
                {user && (
                    <Button
                        onClick={() => navigate("/chats")}
                        colorScheme="blue"
                        px={6}
                        py={2}
                        borderRadius="md"
                        boxShadow="md"
                        fontWeight="bold"
                        _hover={{ bg: "blue.600" }}
                    >
                        Chats
                    </Button>
                )}
            </Flex>

            {loading ? (
                <Center>
                    <Spinner size="xl" color="blue.500" />
                </Center>
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : (
                <VStack spacing={5} align="center">
                    {users.map((user) => (
                        <Box
                            key={user.email}
                            p={4}
                            borderWidth={1}
                            borderRadius="lg"
                            boxShadow="md"
                            width={{ base: "90%", md: "50%" }}
                            textAlign="center"
                            bg="white"
                        >
                            <Image
                                src={user.profileImage}
                                alt={user.name}
                                boxSize="100px"
                                borderRadius="full"
                                mb={2}
                                mx="auto"
                                border="2px solid"
                                borderColor="gray.300"
                            />
                            <Text fontWeight="bold" fontSize="lg">{user.name}</Text>
                            <Text color="gray.600">{user.email}</Text>
                            <Text fontSize="sm" color="gray.500">{user.location}</Text>
                            <Button
                                colorScheme="blue"
                                mt={3}
                                onClick={() => handleMessageClick(user._id)}
                            >
                                Message
                            </Button>
                        </Box>
                    ))}
                </VStack>
            )}

            {/* Pagination */}
            {users.length > 0 && totalPages > 1 && (
                <HStack mt={6} spacing={2} justify="center">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index + 1}
                            onClick={() => setPage(index + 1)}
                            colorScheme={page === index + 1 ? "blue" : "gray"}
                            variant={page === index + 1 ? "solid" : "outline"}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </HStack>
            )}
        </Box>
    );
};

export default UserList;
