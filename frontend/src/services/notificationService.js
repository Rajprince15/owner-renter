// =================================================================
// HOMER - NOTIFICATION SERVICE
// Handles all notification-related API calls with mock/real switchability
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';
import { mockNotifications, getNotificationsByUser, getUnreadNotificationsCount } from './mockData';

// =================================================================
// API ENDPOINT: GET /api/notifications
// =================================================================
export const getNotifications = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    const notifications = getNotificationsByUser(userId);
    
    return mockApiCall(notifications);
  }
  
  return axios.get('/api/notifications');
};

// =================================================================
// API ENDPOINT: GET /api/notifications/unread-count
// =================================================================
export const getUnreadCount = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    const count = getUnreadNotificationsCount(userId);
    
    return mockApiCall({ unread_count: count });
  }
  
  return axios.get('/api/notifications/unread-count');
};

// =================================================================
// API ENDPOINT: PUT /api/notifications/:notification_id/read
// =================================================================
export const markAsRead = async (notificationId) => {
  if (USE_MOCK) {
    const notification = mockNotifications.find(n => n.notification_id === notificationId);
    
    if (!notification) {
      return mockApiError('Notification not found', 404);
    }
    
    notification.is_read = true;
    
    return mockApiCall({ message: 'Notification marked as read' });
  }
  
  return axios.put(`/api/notifications/${notificationId}/read`);
};

// =================================================================
// API ENDPOINT: PUT /api/notifications/mark-all-read
// =================================================================
export const markAllAsRead = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    mockNotifications
      .filter(n => n.user_id === userId)
      .forEach(n => n.is_read = true);
    
    return mockApiCall({ message: 'All notifications marked as read' });
  }
  
  return axios.put('/api/notifications/mark-all-read');
};

// =================================================================
// API ENDPOINT: DELETE /api/notifications/:notification_id
// =================================================================
export const deleteNotification = async (notificationId) => {
  if (USE_MOCK) {
    const index = mockNotifications.findIndex(n => n.notification_id === notificationId);
    
    if (index === -1) {
      return mockApiError('Notification not found', 404);
    }
    
    mockNotifications.splice(index, 1);
    
    return mockApiCall({ message: 'Notification deleted' });
  }
  
  return axios.delete(`/api/notifications/${notificationId}`);
};

// =================================================================
// EXPORT ALL FUNCTIONS
// =================================================================
export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
