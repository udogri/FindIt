import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Image, Text, Heading, VStack, Input,
  Button, Box, HStack, IconButton, useDisclosure, Popover, PopoverTrigger, PopoverContent,
  Grid, GridItem, Tag, Divider, Avatar
} from '@chakra-ui/react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon, RepeatIcon, ChatIcon } from '@chakra-ui/icons';
import EmojiPicker from 'emoji-picker-react';

const ReportDetailsModal = ({ isOpen, onClose, report }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const { isOpen: isEmojiOpen, onOpen: onEmojiOpen, onClose: onEmojiClose } = useDisclosure();
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !report?.id || !user) return;

    try {
      await addDoc(collection(db, 'reports', report.id, 'messages'), {
        text: input.trim(),
        uid: user.uid,
        senderName: user.displayName || user.email || 'Anonymous',
        photoURL: user.photoURL,
        timestamp: serverTimestamp(),
        replyTo: replyTo ? { text: replyTo.text, senderName: replyTo.senderName } : null,
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
      });
      cancelEditing();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    onEmojiClose();
    inputRef.current?.focus();
  };

  if (!isOpen || !report) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader borderBottomWidth="1px">{report.title || 'Report Details'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} h="full">
            <GridItem p={6} borderRightWidth={{ md: "1px" }}>
              <VStack spacing={4} align="start">
                {report.imageUrl && (
                  <Image
                    src={report.imageUrl}
                    alt={report.title || 'Report Image'}
                    objectFit="cover"
                    w="100%"
                    h="300px"
                    borderRadius="lg"
                    shadow="md"
                  />
                )}
                <HStack justifyContent="space-between" w="100%">
                    <Heading size="lg">{report.title}</Heading>
                    <Tag size="lg" colorScheme={report.status === 'Lost' ? 'red' : 'green'}>
                        {report.status}
                    </Tag>
                </HStack>
                <Text fontSize="md" color="gray.600">
                  {report.description || 'No description provided.'}
                </Text>
              </VStack>
            </GridItem>

            <GridItem display="flex" flexDirection="column" h="full">
              <Box flex="1" p={6} overflowY="auto" display="flex" flexDirection="column">
                <Heading size="md" mb={4}>Community Chat</Heading>
                <VStack spacing={4} align="stretch" flex="1">
                  {messages.map((msg) => {
                    const isOwner = msg.uid === user?.uid;
                    return (
                      <Box key={msg.id} display="flex" justifyContent={isOwner ? 'flex-end' : 'flex-start'}>
                        <HStack spacing={3} align="start" maxW="80%">
                          {!isOwner && <Avatar size="sm" name={msg.senderName} src={msg.photoURL} />}
                          <VStack align={isOwner ? 'flex-end' : 'flex-start'} spacing={1}>
                            <HStack>
                                <Text fontSize="sm" fontWeight="bold">
                                {msg.senderName}
                                </Text>
                                <Text as="span" fontSize="xs" color="gray.500">
                                    • {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'p, MMM d') : '...'}
                                </Text>
                            </HStack>
                            
                            {msg.replyTo && (
                                <Box bg="gray.100" p={2} borderRadius="md" mb={1} w="fit-content">
                                <Text fontSize="xs" color="gray.600">
                                    Replying to <strong>{msg.replyTo.senderName}</strong>: "{msg.replyTo.text}"
                                </Text>
                                </Box>
                            )}

                            <Box
                              p={3}
                              borderRadius="lg"
                              bg={isOwner ? 'blue.500' : 'gray.100'}
                              color={isOwner ? 'white' : 'black'}
                            >
                              {editingId === msg.id ? (
                                <HStack>
                                  <Input
                                    size="sm"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                    autoFocus
                                    variant="filled"
                                  />
                                  <IconButton icon={<CheckIcon />} size="xs" colorScheme="green" onClick={saveEdit} />
                                  <IconButton icon={<CloseIcon />} size="xs" colorScheme="red" onClick={cancelEditing} />
                                </HStack>
                              ) : (
                                <Text fontSize="sm">{msg.text}</Text>
                              )}
                            </Box>
                            
                            <HStack spacing={1}>
                                {isOwner && editingId !== msg.id && (
                                <>
                                    <IconButton icon={<EditIcon />} size="xs" variant="ghost" onClick={() => startEditing(msg.id, msg.text)} />
                                    <IconButton icon={<DeleteIcon />} size="xs" variant="ghost" colorScheme="red" onClick={() => handleDelete(msg.id)} />
                                </>
                                )}
                                {!isOwner && (
                                <IconButton
                                    icon={<RepeatIcon />}
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => setReplyTo(msg)}
                                    aria-label="Reply"
                                />
                                )}
                            </HStack>
                          </VStack>
                          {isOwner && <Avatar size="sm" name={user.displayName} src={user.photoURL} />}
                        </HStack>
                      </Box>
                    );
                  })}
                  <div ref={chatEndRef} />
                </VStack>
              </Box>

              <Box p={4} borderTopWidth="1px">
                {replyTo && (
                  <Box bg="gray.100" p={2} borderRadius="md" mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Text fontSize="xs">Replying to <strong>{replyTo.senderName}</strong>: "{replyTo.text}"</Text>
                    <IconButton size="xs" icon={<CloseIcon />} onClick={() => setReplyTo(null)} variant="ghost" colorScheme="red" />
                  </Box>
                )}
                <HStack align="center">
                  <Popover isOpen={isEmojiOpen} onOpen={onEmojiOpen} onClose={onEmojiClose} placement="top-start">
                    <PopoverTrigger>
                      <IconButton
                        icon={<ChatIcon />}
                        aria-label="Add emoji"
                        variant="ghost"
                      />
                    </PopoverTrigger>
                    <PopoverContent w="auto" border="none" bg="transparent">
                      <EmojiPicker onEmojiClick={onEmojiClick} height={350} />
                    </PopoverContent>
                  </Popover>
                  <Input
                    ref={inputRef}
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    isDisabled={!user}
                    variant="filled"
                    borderRadius="full"
                  />
                  <Button colorScheme="blue" onClick={handleSend} isDisabled={!user || !input.trim()} borderRadius="full">
                    Send
                  </Button>
                </HStack>
                {!user && (
                  <Text fontSize="xs" color="red.500" mt={2} textAlign="center">
                    Please log in to send messages.
                  </Text>
                )}
              </Box>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter borderTopWidth="1px">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportDetailsModal;

