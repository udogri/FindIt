// components/ReportDetailsModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  Text,
  Heading,
  VStack,
  Input,
  Button,
  Box,
  HStack,
} from '@chakra-ui/react';

const ReportDetailsModal = ({ isOpen, onClose, report }) => {
  const [messages, setMessages] = useState([
    { from: 'system', text: 'You can chat here about this report.' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: 'user', text: input }]);
    setInput('');
  };

  if (!report) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{report.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            <Image
              src={report.imageUrl}
              alt={report.title}
              objectFit="cover"
              w="100%"
              h="250px"
              borderRadius="md"
            />
            <Text fontSize="sm" color="gray.600">
              {report.description}
            </Text>
            <Text fontWeight="bold" color={report.status === 'Lost' ? 'red.500' : 'green.500'}>
              Status: {report.status}
            </Text>

            <Box w="100%" mt={6}>
              <Heading size="sm" mb={2}>Chat</Heading>
              <Box
                bg="gray.100"
                borderRadius="md"
                p={3}
                h="150px"
                overflowY="auto"
                mb={3}
              >
                {messages.map((msg, idx) => (
                  <Text
                    key={idx}
                    fontSize="sm"
                    color={msg.from === 'user' ? 'blue.600' : 'gray.700'}
                    mb={1}
                  >
                    {msg.from === 'user' ? 'You' : 'System'}: {msg.text}
                  </Text>
                ))}
              </Box>
              <HStack>
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button colorScheme="teal" onClick={handleSend}>
                  Send
                </Button>
              </HStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportDetailsModal;
