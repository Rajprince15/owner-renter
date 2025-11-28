import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import { getChats, getChatDetail, sendMessage } from '../../services/chatService';
import { pageTransition, fadeInUp } from '../../utils/motionConfig';

const RenterChats = () => {
  const { chatId } = useParams();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (chatId) {
      loadChatDetail(chatId);
    } else {
      setSelectedChat(null);
    }
  }, [chatId]);

  const loadChats = async () => {
    try {
      const response = await getChats();
      setChats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading chats:', err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const loadChatDetail = async (id) => {
    try {
      const response = await getChatDetail(id);
      setSelectedChat(response.data);
    } catch (err) {
      console.error('Error loading chat detail:', err);
      setError('Failed to load chat');
    }
  };

  const handleSendMessage = async (messageText, attachments = [], messageType = 'text') => {
    if (!selectedChat) return;
    
    try {
      await sendMessage(selectedChat.chat_id, messageText, attachments, messageType);
      await loadChatDetail(selectedChat.chat_id);
      await loadChats();
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const handleRefresh = async () => {
    if (selectedChat) {
      await loadChatDetail(selectedChat.chat_id);
    }
    await loadChats();
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center"
        {...pageTransition}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"
          />
          <motion.p 
            className="mt-4 text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading your chats...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      {...pageTransition}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-testid="page-title">My Chats</h1>
          </div>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Conversations with property owners
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-4 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <div className="flex h-[calc(100vh-250px)]">
            {/* Chat List (Left Side) */}
            <motion.div 
              className={`${chatId ? 'hidden lg:block' : 'block'} w-full lg:w-96 border-r overflow-y-auto`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ChatList chats={chats} userType="renter" />
            </motion.div>

            {/* Chat Window (Right Side) */}
            <motion.div 
              className={`${chatId ? 'block' : 'hidden lg:flex'} flex-1`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {selectedChat ? (
                <ChatWindow
                  chat={selectedChat}
                  onSendMessage={handleSendMessage}
                  onRefresh={handleRefresh}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <MessageCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a chat from the list to view messages
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RenterChats;
