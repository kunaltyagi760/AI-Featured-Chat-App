import {
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'

import { useRef, useContext } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { AuthContext } from "../features/authContext";
import { useNavigate } from 'react-router-dom';

function AlertDialogBox({ action }) {
    const { logout, deleteAccount } = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const navigate = useNavigate()

    const handleAction = () => {
        (action === "Logout") ? logout() : deleteAccount()
        navigate("/login-email");
    }

    return (
        <>
            <Button w="full" colorScheme={action==="Logout"? "teal" : "red"} onClick={onOpen}>
                {action}
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {action}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {`Are you sure? You want to ${action}.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme={action==="Logout"? "teal" : "red"} onClick={handleAction} ml={3}>
                                {action}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default AlertDialogBox