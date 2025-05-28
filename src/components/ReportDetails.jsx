import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Image, Text, Heading, VStack, Input,
  Button, Box, HStack, IconButton
} from '@chakra-ui/react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // your firebase config file
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

const ReportDetailsModal = ({ isOpen, onClose, report }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const chatEndRef = useRef(null);

  // Listen to auth changes and set current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to messages for this report
  useEffect(() => {
    if (!report?.id) return;

    const messagesRef = collection(db, 'reports', report.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [report?.id]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send a new message
  const handleSend = async () => {
    if (!input.trim() || !report?.id || !user) return;

    try {
      await addDoc(collection(db, 'reports', report.id, 'messages'), {
        text: input.trim(),
        uid: user.uid,
        senderName: user.displayName || user.email || 'Anonymous',
        reportSender: report.sender || 'Unknown',
        timestamp: serverTimestamp()
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Delete message by id
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'reports', report.id, 'messages', id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Start editing a message
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  // Save edited message
  const saveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      const messageRef = doc(db, 'reports', report.id, 'messages', editingId);
      await updateDoc(messageRef, {
        text: editingText.trim(),
        timestamp: serverTimestamp() // Optional: update timestamp on edit
      });
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating message:', error);
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
              >
                {messages.map((msg) => {
                  const isOwner = msg.uid === user?.uid;
                  return (
                    <Box
                      key={msg.id}
                      mb={3}
                      p={2}
                      bg={isOwner ? 'blue.50' : 'gray.100'}
                      borderRadius="md"
                    >
                      <HStack justifyContent="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="bold" color={isOwner ? 'blue.600' : 'gray.800'}>
                          {msg.senderName || 'Unknown'}{' '}
                          <Text as="span" fontSize="xs" color="gray.500">
                            {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'p, MMM d') : '...'}
                          </Text>
                        </Text>

                        {/* Show Edit/Delete only if user owns this message */}
                        {isOwner && (
                          <HStack spacing={1}>
                            {editingId === msg.id ? (
                              <>
                                <IconButton
                                  icon={<CheckIcon />}
                                  size="xs"
                                  colorScheme="green"
                                  aria-label="Save edit"
                                  onClick={saveEdit}
                                />
                                <IconButton
                                  icon={<CloseIcon />}
                                  size="xs"
                                  colorScheme="red"
                                  aria-label="Cancel edit"
                                  onClick={cancelEditing}
                                />
                              </>
                            ) : (
                              <>
                                <IconButton
                                  icon={<EditIcon />}
                                  size="xs"
                                  aria-label="Edit message"
                                  onClick={() => startEditing(msg.id, msg.text)}
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  size="xs"
                                  colorScheme="red"
                                  aria-label="Delete message"
                                  onClick={() => handleDelete(msg.id)}
                                />
                              </>
                            )}
                          </HStack>
                        )}
                      </HStack>

                      {editingId === msg.id ? (
                        <Input
                          size="sm"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        />
                      ) : (
                        <Text fontSize="sm" ml={2}>{msg.text}</Text>
                      )}
                    </Box>
                  );
                })}
                <div ref={chatEndRef} />
              </Box>

              <HStack>
                <Input
                  placeholder="Type a message with emoji… 😊"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  isDisabled={!user}
                />
                <Button colorScheme="teal" onClick={handleSend} isDisabled={!user}>
                  Send
                </Button>
              </HStack>
              {!user && (
                <Text fontSize="xs" color="red.500" mt={2}>
                  Please log in to send messages.
                </Text>
              )}
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportDetailsModal;
