import { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Input, Button, VStack, Text, HStack, Avatar, Spinner, Alert, AlertIcon, Center } from "@chakra-ui/react";
import { io } from "socket.io-client";
import API from "../utils/axiosInstance";
import { AuthContext } from "../features/authContext";

const socket = io("http://localhost:5000"); // Replace with your backend URL

const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (chat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chat])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chat])

  useEffect(() => {
    fetchChatDetails();
    fetchMessages();
    socket.emit("joinChat", chatId);

    socket.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [chatId]);

  const fetchChatDetails = async () => {
    try {
      const res = await API.get(`/chats/${chatId}`);
      setChat(res.data);
    } catch (err) {
      setError("Failed to load chat details.");
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/messages/${chatId}`);
      setMessages(res.data);
    } catch (err) {
      setError("Failed to load messages.");
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const receiverId = chat.participants.find((p) => p._id !== user._id)._id;
    const messageData = { chatId, receiverId, message: newMessage };

    try {
      const res = await API.post("/messages", messageData);
      socket.emit("sendMessage", res.data);
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message.");
    }
  };

  return (
    <Box p={4}>
      {/* Back Button */}
      <Button mb={4} onClick={() => navigate("/chats")}>← Back to Chats</Button>

      {/* Error Message */}
      {error && (
        <Alert status="error" mb={3}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Chat Messages */}
      {loading ? <Center>
        <Spinner size="xl" color="blue.500" />
      </Center> : (
        chat && (
          <Box>
            {/* Receiver Profile */}
            <HStack mb={4}>
              <Avatar src={chat.participants.find((p) => p._id !== user._id)?.profileImage} size="md" />
              <Text fontSize="lg" fontWeight="bold">{chat.participants.find((p) => p._id !== user._id)?.name}</Text>
            </HStack>

            <VStack spacing={3} h="400px" overflowY="auto" p={2} border="1px solid lightgray" borderRadius="md">
              {user && messages.length > 0 ? (
                messages.map((msg, index) => (
                  <Box
                    key={index}
                    alignSelf={msg.sender !== user._id ? "flex-start" : "flex-end"}
                    bg={msg.sender !== user._id ? "gray.100" : "blue.200"}
                    p={2}
                    borderRadius="20px"
                    borderTopLeftRadius={msg.sender !== user._id ? "sm" : "20px"}
                    borderTopRightRadius={msg.sender !== user._id ? "20px" : "sm"}
                    maxW="80%"
                    boxShadow="sm"
                    ml={msg.sender === user._id ? "10px" : "0"}
                    mr={msg.sender !== user._id ? "10px" : "0"}
                  >
                    <Text>{msg.message}</Text>
                    <Text fontSize="xs" color="gray.500" textAlign="right" mt={1}>
                      {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">No messages yet. Start a conversation!</Text>
              )}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Message Input */}
            <HStack mt={4}>
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send message on Enter key press
              />
              <Button colorScheme="blue" onClick={sendMessage}>Send</Button>
            </HStack>
          </Box>
        ))}
    </Box>
  );
};

export default ChatWindow;
