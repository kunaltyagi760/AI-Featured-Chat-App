import { useState, useRef, useEffect } from "react";
import sendMessage from "../utils/send-message";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, VStack, Text, HStack, Avatar, Alert, AlertIcon } from "@chakra-ui/react";

const AIChat = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])

    useEffect(() => {
        if (!loading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [loading])

    const handleSendMessage = async (text) => {
        const userMessage = {
            id: Date.now(),
            text,
            sender: "user",
            timestamp: new Date().toISOString()
        }
        
        setNewMessage("")
        setMessages((prev) => [...prev, userMessage])
        setLoading(true);

        try {
            const conversationHistory = messages.map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text
            }))

            const botResponse = await sendMessage(text, conversationHistory)
            setMessages((prev) => [...prev, botResponse])
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

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
            {<Box>
                {/* Receiver Profile */}
                <HStack mb={4}>
                    <Avatar src="https://th.bing.com/th/id/R.8c0695df083a971d2f5e6df2611a9dbb?rik=EEs19wrNOeizSA&riu=http%3a%2f%2ficons.iconarchive.com%2ficons%2fkillaaaron%2fadobe-cc-circles%2f1024%2fAdobe-Ai-icon.png&ehk=puvq0038VJwPYAMAs%2faxn%2fLJp8B93wBUHgXMXUhr9ME%3d&risl=&pid=ImgRaw&r=0" size="md" />
                </HStack>

                <VStack spacing={3} h="400px" overflowY="auto" p={2} border="1px solid lightgray" borderRadius="md">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <Box
                                alignSelf={msg.sender !== "user" ? "flex-start" : "flex-end"}
                                bg={msg.sender !== "user" ? "gray.100" : "blue.200"}
                                p={2}
                                borderRadius="20px"
                                borderTopLeftRadius={msg.sender !== "user" ? "sm" : "20px"}
                                borderTopRightRadius={msg.sender !== "user" ? "20px" : "sm"}
                                maxW="80%"
                                boxShadow="sm"
                                ml={msg.sender === "user" ? "10px" : "0"}
                                mr={msg.sender !== "user" ? "10px" : "0"}
                            >
                                <Text>{msg.text}</Text>
                                <Text fontSize="xs" color="gray.500" textAlign="right" mt={1}>
                                    {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Text>
                            </Box>
                        ))
                    ) : (
                        <Text color="gray.500">No messages yet!</Text>
                    )}
                    <div ref={messagesEndRef} />
                </VStack>

                {/* Message Input */}
                <HStack mt={4}>
                    <Input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={loading ? "Thinking..." :"Ask anything..."}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage(newMessage)}
                        disabled={loading}
                    />
                    <Button colorScheme="blue" onClick={() => handleSendMessage(newMessage)}>Send</Button>
                </HStack>
            </Box>
            }
        </Box>
    );
};

export default AIChat
