// NotFound.jsx
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box textAlign="center" py={20} px={6}>
      <VStack spacing={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={'gray.500'} mb={6}>
          The page you’re looking for doesn’t seem to exist.
        </Text>

        <Button
          as={Link}
          to="/"
          colorScheme="teal"
          variant="solid"
        >
          Go to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound;
