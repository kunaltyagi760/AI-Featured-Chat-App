import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VStack, HStack, Avatar, Text, Box, Spinner, Alert, AlertIcon, Flex, Button, Center } from "@chakra-ui/react";
import API from "../utils/axiosInstance";
import { AuthContext } from "../features/authContext";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)


  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/chats"); // Fetch user's chat list
      setChats(res.data);
    } catch (err) {
      setError("Failed to load chats.");
    }
    setLoading(false);
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4} px={4}>
        <Text fontSize="2xl" fontWeight="bold">Chats</Text>
        <Button colorScheme="blue" px={6} py={2} borderRadius="md" boxShadow="md" onClick={() => navigate("/")}>
          New
        </Button>
      </Flex>
      <VStack align="stretch" spacing={3}>
            <Box
              p={3}
              borderRadius="md"
              bg="gray.100"
              _hover={{ bg: "blue.100", cursor: "pointer" }}
              onClick={() => navigate("/ai-chat")}
              mb={3}>
              <HStack>
                <Avatar src="https://th.bing.com/th/id/R.8c0695df083a971d2f5e6df2611a9dbb?rik=EEs19wrNOeizSA&riu=http%3a%2f%2ficons.iconarchive.com%2ficons%2fkillaaaron%2fadobe-cc-circles%2f1024%2fAdobe-Ai-icon.png&ehk=puvq0038VJwPYAMAs%2faxn%2fLJp8B93wBUHgXMXUhr9ME%3d&risl=&pid=ImgRaw&r=0" size="md" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">Ask anything...</Text>
                </VStack>
              </HStack>
            </Box>
        </VStack>
      {error && (
        <Alert status="error" mb={3}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {loading ? (
        <Center>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : (
        <VStack align="stretch" spacing={3}>
          {chats.map((chat) => (
            <Box key={chat._id}
              p={3}
              borderRadius="md"
              bg="gray.100"
              _hover={{ bg: "blue.100", cursor: "pointer" }}
              onClick={() => navigate(`/chat/${chat._id}`)}>
              <HStack>
                <Avatar src={chat.participants.find((p) => p._id !== user._id)?.profileImage} size="md" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{chat.participants.find((p) => p._id !== user._id)?.name}</Text>
                  <Text fontSize="sm" color="gray.500">{(chat?.latestMessage?.message.length > 20 ? chat.latestMessage.message.slice(0,30) : chat.latestMessage.message) || "No messages yet"}</Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ChatList;
