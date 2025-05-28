import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Image, Text, Heading, VStack, Input,
  Button, Box, HStack
} from '@chakra-ui/react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { format } from 'date-fns';

const ReportDetailsModal = ({ isOpen, onClose, report }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!report?.id) return;

    const q = query(
      collection(db, 'reports', report.id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [report?.id]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !report?.id) return;

    try {
      await addDoc(collection(db, 'reports', report.id, 'messages'), {
        text: input.trim(),
        uid: user?.uid || null,
        senderName: user?.displayName || 'Anonymous',
        reportSender: report.sender || 'Unknown',
        timestamp: serverTimestamp()
      });
      setInput('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  if (!isOpen || !report) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{report.title || 'Report Details'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            {report.imageUrl && (
              <Image
                src={report.imageUrl}
                alt={report.title || 'Report Image'}
                objectFit="cover"
                w="100%"
                h="250px"
                borderRadius="md"
              />
            )}
            <Text fontSize="sm" color="gray.600">
              {report.description || 'No description provided.'}
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
                h="200px"
                overflowY="auto"
                mb={3}
                maxW="100%"
              >
                {messages.map((msg) => (
                  <Box key={msg.id} mb={2}>
                    <Text fontSize="sm" fontWeight="bold" color={msg.uid === user?.uid ? 'blue.600' : 'gray.800'}>
                      {msg.senderName || 'Unknown'} <Text as="span" fontSize="xs" color="gray.500">
                        {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'p, MMM d') : '...'}
                      </Text>
                    </Text>
                    <Text fontSize="sm" ml={2}>
                      {msg.text}
                    </Text>
                  </Box>
                ))}
                <div ref={chatEndRef} />
              </Box>
              <HStack>
                <Input
                  placeholder="Type a message with emoji… 😊"
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
