import React, { useState, useEffect } from 'react';
import {
  Menu, MenuButton, MenuList, MenuItem, IconButton, Badge, Box, Text, VStack, Flex, useToast
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { formatDistanceToNowStrict } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Error loading notifications.',
        description: 'Could not fetch your notifications.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    });

    return () => unsubscribeSnapshot();
  }, [user, toast]);

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error.',
        description: 'Could not mark notification as read.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === 'newMessage' && notification.reportId) {
      // Assuming you have a route to view report details, e.g., /community?reportId=...
      // For now, we'll navigate to community and expect the modal to open based on URL param or state
      // This might require further integration in Community.jsx or App.jsx to handle opening the modal
      navigate(`/community?reportId=${notification.reportId}`);
    }
  };

  return (
    <Menu>
      <MenuButton as={IconButton} icon={<BellIcon />} variant="ghost" color="white" fontSize="xl" position="relative">
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-1px"
            right="-1px"
            borderRadius="full"
            colorScheme="red"
            fontSize="0.7em"
            px="2"
            py="1"
          >
            {unreadCount}
          </Badge>
        )}
      </MenuButton>
      <MenuList bg="brand.700" border="none" shadow="lg" maxH="300px" overflowY="auto">
        {notifications.length === 0 ? (
          <MenuItem bg="brand.700" color="white" _hover={{ bg: 'brand.600' }}>
            No new notifications
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              bg={notification.read ? 'brand.700' : 'brand.600'}
              _hover={{ bg: 'brand.500' }}
              onClick={() => handleNotificationClick(notification)}
              py={3}
              px={4}
              borderBottom="1px solid"
              borderColor="brand.500"
            >
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" color="white" fontSize="sm">
                  {notification.senderName} sent a message on "{notification.reportTitle}"
                </Text>
                <Text fontSize="xs" color="gray.200" noOfLines={1}>
                  {notification.messageText}
                </Text>
                {notification.timestamp?.toDate && (
                  <Text fontSize="xs" color="gray.400">
                    {formatDistanceToNowStrict(notification.timestamp.toDate(), { addSuffix: true })}
                  </Text>
                )}
              </VStack>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
};

export default NotificationBell;
