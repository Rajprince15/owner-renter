// =================================================================
// HOMER - CHAT SERVICE
// Handles all chat-related API calls with mock/real switchability
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';
import { mockChats, mockProperties, mockUsers } from './mockData';

// =================================================================
// API ENDPOINT: POST /api/chats/initiate
// Creates a new chat or returns existing chat
// =================================================================
export const initiateChat = async (propertyId, initialMessage = 'Hi, I am interested in this property. Is it still available?') => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Check if free tier and at limit
    if (user.subscription_tier === 'free' && user.contacts_used >= 5) {
      return mockApiError('Contact limit reached. Upgrade to premium.', 403);
    }
    
    // Find property to get owner_id
    const property = mockProperties.find(p => p.property_id === propertyId);
    if (!property) {
      return mockApiError('Property not found', 404);
    }
    
    // Check if chat already exists
    const existingChat = mockChats.find(
      c => c.property_id === propertyId && c.renter_id.includes(userId)
    );
    
    if (existingChat) {
      return mockApiCall({ 
        chat_id: existingChat.chat_id,
        existing: true
      });
    }
    
    // Create new chat
    const newChat = {
      chat_id: `chat_${Date.now()}`,
      property_id: propertyId,
      renter_id: userId,
      owner_id: property.owner_id,
      initiated_by: 'renter',
      created_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
      status: 'active',
      messages: [
        {
          message_id: `msg_${Date.now()}`,
          sender_id: userId,
          sender_type: 'renter',
          message: initialMessage,
          timestamp: new Date().toISOString(),
          is_read: false,
          attachments: []
        }
      ]
    };
    
    mockChats.push(newChat);
    
    // Increment contacts_used
    user.contacts_used++;
    localStorage.setItem('user', JSON.stringify(user));
    
    return mockApiCall({ 
      chat_id: newChat.chat_id,
      existing: false
    });
  }
  
  return axios.post('/api/chats/initiate', { propertyId, initialMessage });
};

// =================================================================
// API ENDPOINT: GET /api/chats
// Get all chats for current user
// =================================================================
export const getChats = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    
    // Get chats where user is either renter or owner
    const userChats = mockChats.filter(
      c => c.renter_id.includes(userId) || c.owner_id.includes(userId)
    );
    
    // Enrich with property and user data
    const enrichedChats = userChats.map(chat => {
      const property = mockProperties.find(p => p.property_id === chat.property_id);
      const isRenter = chat.renter_id.includes(userId);
      const otherUserId = isRenter ? chat.owner_id : chat.renter_id;
      const otherUser = mockUsers.find(u => u.user_id === otherUserId);
      
      const lastMessage = chat.messages[chat.messages.length - 1];
      const unreadCount = chat.messages.filter(
        msg => !msg.is_read && !msg.sender_id.includes(userId)
      ).length;
      
      return {
        ...chat,
        property: property ? {
          property_id: property.property_id,
          title: property.title,
          location: property.location,
          images: property.images,
          rent: property.rent
        } : null,
        other_user: otherUser ? {
          user_id: otherUser.user_id,
          full_name: otherUser.full_name,
          user_type: otherUser.user_type
        } : null,
        last_message: lastMessage,
        unread_count: unreadCount
      };
    });
    
    // Sort by last_message_at (most recent first)
    enrichedChats.sort((a, b) => 
      new Date(b.last_message_at) - new Date(a.last_message_at)
    );
    
    return mockApiCall(enrichedChats);
  }
  
  return axios.get('/api/chats');
};

// =================================================================
// API ENDPOINT: GET /api/chats/:chat_id
// Get single chat with all messages
// =================================================================
export const getChatDetail = async (chatId) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    
    const chat = mockChats.find(c => c.chat_id === chatId);
    
    if (!chat) {
      return mockApiError('Chat not found', 404);
    }
    
    // Check if user is part of this chat
    if (!chat.renter_id.includes(userId) && !chat.owner_id.includes(userId)) {
      return mockApiError('Not authorized', 403);
    }
    
    // Mark messages as read
    chat.messages.forEach(msg => {
      if (!msg.sender_id.includes(userId)) {
        msg.is_read = true;
      }
    });
    
    // Enrich with property and user data
    const property = mockProperties.find(p => p.property_id === chat.property_id);
    const isRenter = chat.renter_id.includes(userId);
    const otherUserId = isRenter ? chat.owner_id : chat.renter_id;
    const otherUser = mockUsers.find(u => u.user_id === otherUserId);
    
    return mockApiCall({
      ...chat,
      property: property ? {
        property_id: property.property_id,
        title: property.title,
        location: property.location,
        images: property.images,
        rent: property.rent,
        bhk_type: property.bhk_type
      } : null,
      other_user: otherUser ? {
        user_id: otherUser.user_id,
        full_name: otherUser.full_name,
        user_type: otherUser.user_type
      } : null,
      current_user_type: isRenter ? 'renter' : 'owner'
    });
  }
  
  return axios.get(`/api/chats/${chatId}`);
};

// =================================================================
// API ENDPOINT: POST /api/chats/:chat_id/messages
// Send a message in a chat
// Parameters:
//   - messageText: The text content of the message
//   - attachments: Array of attachment objects (optional)
//   - messageType: Type of message - 'text' (default), 'schedule_visit', 'document_request' (optional)
// =================================================================
export const sendMessage = async (chatId, messageText, attachments = [], messageType = 'text') => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    
    const chat = mockChats.find(c => c.chat_id === chatId);
    
    if (!chat) {
      return mockApiError('Chat not found', 404);
    }
    
    // Check if user is part of this chat
    if (!chat.renter_id.includes(userId) && !chat.owner_id.includes(userId)) {
      return mockApiError('Not authorized', 403);
    }
    
    const senderType = chat.renter_id.includes(userId) ? 'renter' : 'owner';
    
    const newMessage = {
      message_id: `msg_${Date.now()}`,
      sender_id: userId,
      sender_type: senderType,
      message: messageText,
      message_type: messageType,
      timestamp: new Date().toISOString(),
      is_read: false,
      attachments: attachments
    };
    
    chat.messages.push(newMessage);
    chat.last_message_at = newMessage.timestamp;
    
    return mockApiCall({ 
      message_id: newMessage.message_id,
      message: newMessage
    });
  }
  
  return axios.post(`/api/chats/${chatId}/messages`, {
    message: messageText,
    attachments,
    message_type: messageType
  });
};

// =================================================================
// API ENDPOINT: GET /api/chats/unread-count
// Get total unread message count
// =================================================================
export const getUnreadCount = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiCall({ unread_count: 0 });
    }
    
    const userId = token.split('_')[2];
    
    const userChats = mockChats.filter(
      c => c.renter_id.includes(userId) || c.owner_id.includes(userId)
    );
    
    let unreadCount = 0;
    userChats.forEach(chat => {
      const unreadMessages = chat.messages.filter(
        msg => !msg.is_read && !msg.sender_id.includes(userId)
      );
      unreadCount += unreadMessages.length;
    });
    
    return mockApiCall({ unread_count: unreadCount });
  }
  
  return axios.get('/api/chats/unread-count');
};

// =================================================================
// EXPORT ALL FUNCTIONS
// =================================================================
export default {
  initiateChat,
  getChats,
  getChatDetail,
  sendMessage,
  getUnreadCount
};
