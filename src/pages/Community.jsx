import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  IconButton,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ReportDetailsModal = ({ isOpen, onClose, report, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!report || !user) return;

    const itemType = report.status === 'Lost' ? 'lostItems' : 'foundItems';
    const msgRef = collection(db, `${itemType}/${report.id}/messages`);
    const q = query(msgRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [report, user]);

  const sendMessage = async () => {
    if (!input.trim() || !report || !user) return;

    const itemType = report.status === 'Lost' ? 'lostItems' : 'foundItems';
    const msgRef = collection(db, `${itemType}/${report.id}/messages`);

    try {
      await addDoc(msgRef, {
        text: input,
        userId: user.uid,
        username: user.displayName || user.email,
        timestamp: serverTimestamp(),
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteMessage = async (id) => {
    const itemType = report.status === 'Lost' ? 'lostItems' : 'foundItems';
    try {
      await deleteDoc(doc(db, `${itemType}/${report.id}/messages`, id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const updateMessage = async (id) => {
    const itemType = report.status === 'Lost' ? 'lostItems' : 'foundItems';
    try {
      await updateDoc(doc(db, `${itemType}/${report.id}/messages`, id), {
        text: editText,
      });
      setEditMode(null);
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const addEmoji = (emoji) => {
    setInput(prev => prev + emoji.native);
  };

  if (!report || !user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{report.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {report.imageUrl && (
              <Image src={report.imageUrl} alt={report.title} borderRadius="md" />
            )}
            <Text fontSize="md">{report.description}</Text>
            <Text fontSize="sm" color="gray.500">
              Status: {report.status}
            </Text>

            <Divider mt={4} />
            <Text fontWeight="bold" fontSize="lg">💬 Messages</Text>

            {loading ? (
              <Spinner />
            ) : (
              <VStack align="stretch" spacing={3} mt={2}>
                {messages.length === 0 ? (
                  <Text color="gray.500" fontSize="sm">No messages yet.</Text>
                ) : (
                  messages.map((msg) => (
                    <Box key={msg.id} bg="gray.50" p={3} borderRadius="md">
                      <HStack justify="space-between">
                        <Text fontWeight="bold">{msg.username}</Text>
                        {msg.userId === user.uid && (
                          <HStack spacing={1}>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => {
                                setEditMode(msg.id);
                                setEditText(msg.text);
                              }}
                              aria-label="Edit"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              onClick={() => deleteMessage(msg.id)}
                              aria-label="Delete"
                            />
                          </HStack>
                        )}
                      </HStack>
                      {editMode === msg.id ? (
                        <HStack mt={2}>
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <IconButton
                            icon={<CheckIcon />}
                            onClick={() => updateMessage(msg.id)}
                            aria-label="Save"
                          />
                          <IconButton
                            icon={<CloseIcon />}
                            onClick={() => setEditMode(null)}
                            aria-label="Cancel"
                          />
                        </HStack>
                      ) : (
                        <Text mt={1}>{msg.text}</Text>
                      )}
                    </Box>
                  ))
                )}
              </VStack>
            )}

            {/* Message Input */}
            <Box mt={4}>
              <Textarea
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <HStack mt={2}>
                <Button colorScheme="blue" onClick={sendMessage}>Send</Button>
                <Button onClick={() => setShowPicker(!showPicker)}>😀 Emoji</Button>
              </HStack>
              {showPicker && (
                <Box mt={2}>
                  <Picker data={data} onEmojiSelect={addEmoji} />
                </Box>
              )}
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReportDetailsModal;
