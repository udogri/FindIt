import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Image, Text, Heading, VStack, Input,
  Button, Box, HStack, IconButton, useDisclosure, Popover, PopoverTrigger, PopoverContent
} from '@chakra-ui/react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon, RepeatIcon, AddIcon } from '@chakra-ui/icons';
import EmojiPicker from 'emoji-picker-react';

const ReportDetailsModal = ({ isOpen, onClose, report }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !report?.id || !user) return;

    try {
      await addDoc(collection(db, 'reports', report.id, 'messages'), {
        text: input.trim(),
        uid: user.uid,
        senderName: user.displayName || user.email || 'Anonymous',
        reportSender: report.sender || 'Unknown',
        timestamp: serverTimestamp(),
        replyTo: replyTo ? replyTo.text : null,
        replySender: replyTo ? replyTo.senderName : null
      });
      setInput('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'reports', report.id, 'messages', id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      const messageRef = doc(db, 'reports', report.id, 'messages', editingId);
      await updateDoc(messageRef, {
        text: editingText.trim(),
        timestamp: serverTimestamp()
      });
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  if (!isOpen || !report) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
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
                bg="gray.50"
                borderRadius="lg"
                p={3}
                h="250px"
                overflowY="auto"
                mb={3}
              >
                {messages.map((msg) => {
                  const isOwner = msg.uid === user?.uid;
                  return (
                    <Box
                      key={msg.id}
                      mb={3}
                      p={3}
                      borderRadius="lg"
                      bg={isOwner ? 'blue.50' : 'gray.100'}
                      borderLeft="4px solid"
                      borderColor={isOwner ? 'blue.300' : 'gray.400'}
                    >
                      <HStack justifyContent="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="bold" color={isOwner ? 'blue.600' : 'gray.800'}>
                          {msg.senderName}{' '}
                          <Text as="span" fontSize="xs" color="gray.500">
                            • {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'p, MMM d') : '...'}
                          </Text>
                        </Text>
                        {isOwner && (
                          <HStack spacing={1}>
                            {editingId === msg.id ? (
                              <>
                                <IconButton icon={<CheckIcon />} size="xs" colorScheme="green" onClick={saveEdit} />
                                <IconButton icon={<CloseIcon />} size="xs" colorScheme="red" onClick={cancelEditing} />
                              </>
                            ) : (
                              <>
                                <IconButton icon={<EditIcon />} size="xs" onClick={() => startEditing(msg.id, msg.text)} />
                                <IconButton icon={<DeleteIcon />} size="xs" colorScheme="red" onClick={() => handleDelete(msg.id)} />
                              </>
                            )}
                          </HStack>
                        )}
                        {!isOwner && (
                          <IconButton
                            icon={<RepeatIcon />}
                            size="xs"
                            onClick={() => setReplyTo(msg)}
                            aria-label="Reply"
                          />
                        )}
                      </HStack>

                      {msg.replyTo && (
                        <Box bg="gray.200" p={2} borderRadius="md" mb={1}>
                          <Text fontSize="xs" color="gray.600">
                            Replying to <strong>{msg.replySender}</strong>: "{msg.replyTo}"
                          </Text>
                        </Box>
                      )}

                      {editingId === msg.id ? (
                        <Input
                          size="sm"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          autoFocus
                        />
                      ) : (
                        <Text fontSize="sm">{msg.text}</Text>
                      )}
                    </Box>
                  );
                })}
                <div ref={chatEndRef} />
              </Box>

              {replyTo && (
                <Box bg="yellow.50" p={2} borderRadius="md" mb={2}>
                  <Text fontSize="xs">Replying to <strong>{replyTo.senderName}</strong>: "{replyTo.text}"</Text>
                  <Button size="xs" ml={2} onClick={() => setReplyTo(null)} variant="ghost" color="red.400">
                    Cancel
                  </Button>
                </Box>
              )}

              <HStack align="start">
                <Input
                  ref={inputRef}
                  placeholder="Type a message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  isDisabled={!user}
                />
                <Popover isOpen={showEmoji} onClose={() => setShowEmoji(false)} placement="top">
                  <PopoverTrigger>
                    <IconButton
                      icon={<AddIcon />}
                      aria-label="Add emoji"
                      onClick={() => setShowEmoji(!showEmoji)}
                    />
                  </PopoverTrigger>
                  <PopoverContent w="300px">
                    <EmojiPicker onEmojiClick={onEmojiClick} height={350} />
                  </PopoverContent>
                </Popover>
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
