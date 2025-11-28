import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import { getChats, getChatDetail, sendMessage } from '../../services/chatService';
import { pageTransition, fadeInUp } from '../../utils/motionConfig';

const OwnerChats = () => {
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
        className="min-h-screen bg-gray-50 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50"
      {...pageTransition}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900" data-testid="page-title">
              My Chats 💬
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Conversations with potential renters
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="mb-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex h-[calc(100vh-250px)]">
            {/* Chat List (Left Side) */}
            <motion.div 
              className={`${chatId ? 'hidden lg:block' : 'block'} w-full lg:w-96 border-r overflow-y-auto`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ChatList chats={chats} userType="owner" />
            </motion.div>

            {/* Chat Window (Right Side) */}
            <motion.div 
              className={`${chatId ? 'block' : 'hidden lg:flex'} flex-1`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {selectedChat ? (
                <ChatWindow
                  chat={selectedChat}
                  onSendMessage={handleSendMessage}
                  onRefresh={handleRefresh}
                />
              ) : (
                <motion.div 
                  className="flex-1 flex items-center justify-center text-center p-8"
                  {...fadeInUp}
                >
                  <div>
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a chat from the list to view messages
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OwnerChats;