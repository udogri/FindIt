// ChatBox.jsx
import React, { useEffect, useState } from 'react';
import { Box, Input, Button, VStack, Text } from '@chakra-ui/react';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function ChatBox ({ reportId }){
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, `reports/${reportId}/messages`);

  useEffect(() => {
    const q = query(messagesRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [reportId]);

  const sendMessage = async () => {
    if (message.trim() === '') return;
    await addDoc(messagesRef, {
      text: message,
      timestamp: new Date(),
    });
    setMessage('');
  };

  return (
    <Box mt={4} border="1px solid #ddd" p={3} borderRadius="md">
      <VStack align="stretch" maxH="200px" overflowY="auto" mb={3}>
        {messages.map((msg, index) => (
          <Text key={index} fontSize="sm" bg="gray.100" p={2} borderRadius="md">
            {msg.text}
          </Text>
        ))}
      </VStack>
      <HStack>
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button colorScheme="teal" onClick={sendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

