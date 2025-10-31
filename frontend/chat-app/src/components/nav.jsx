import {
    useDisclosure, Avatar, Drawer, DrawerBody, DrawerFooter, DrawerOverlay,
    DrawerContent, DrawerCloseButton, Box, Button, VStack, Text, Flex, Heading
} from "@chakra-ui/react";
import { useRef, useContext } from "react";
import { AuthContext } from "../features/authContext";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AlertDialogBox from "./alertBox";

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const avatarRef = useRef();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleUpdate = () => {
        onClose()
        navigate("/update-profile");
    }

    const handleResetPass = () => {
        onClose()
        navigate("/reset-password");
    }

    return (
        <>
            {/* Navbar */}
            <Flex align="center" bg="blue.500" p={4} color="white" w="100%" justify="space-between">
                <Box flex="1" textAlign={{ base: "center" }}>
                    <Heading size="md">AI Featured Chat App</Heading>
                </Box>
                <Box>
                    {user ? (
                        <Avatar
                            ref={avatarRef}
                            src={user.profileImage || "https://th.bing.com/th/id/OIP.q2YsgHsjuMWvKbVbnp-aJwHaHa?w=250&h=250&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.3&pid=3.1&rm=2"}
                            size="md"
                            cursor="pointer"
                            onClick={onOpen}
                            _hover={{ boxShadow: "md" }}
                        />
                    ) : (
                        <Button colorScheme="teal" onClick={() => navigate("/login-email")}>Login</Button>
                    )}
                </Box>
            </Flex>

            {/* Sidebar Drawer */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={avatarRef}>
                <DrawerOverlay />
                <DrawerContent p={4}>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <VStack spacing={4} align="center">
                            <Avatar
                                src={user?.profileImage || "https://th.bing.com/th/id/OIP.q2YsgHsjuMWvKbVbnp-aJwHaHa?w=250&h=250&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.3&pid=3.1&rm=2"}
                                size="xl"
                                icon={<FaUserCircle />}
                            />
                            <Text fontSize="lg" fontWeight="bold">{user?.name || "Guest User"}</Text>
                            <Text fontSize="md" color="gray.600">{user?.email || "guest@example.com"}</Text>
                            <Button colorScheme="blue" w="full" onClick={handleUpdate}>Update Profile</Button>
                            <Button colorScheme="purple" w="full" onClick={handleResetPass}>Reset Password</Button>
                            <AlertDialogBox action={"Delete Account"}/>
                            <AlertDialogBox action={"Logout"}/>
                        </VStack>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" w="full" onClick={onClose}>Close</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default Navbar;
