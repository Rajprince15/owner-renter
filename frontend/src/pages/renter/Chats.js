import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import { getChats, getChatDetail, sendMessage } from '../../services/chatService';

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

  const handleSendMessage = async (messageText) => {
    if (!selectedChat) return;
    
    try {
      await sendMessage(selectedChat.chat_id, messageText);
      // Reload chat to get updated messages
      await loadChatDetail(selectedChat.chat_id);
      // Refresh chat list to update last message
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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900" data-testid="page-title">My Chats</h1>
          </div>
          <p className="text-gray-600">
            Conversations with property owners
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex h-[calc(100vh-250px)]">
            {/* Chat List (Left Side) */}
            <div className={`${chatId ? 'hidden lg:block' : 'block'} w-full lg:w-96 border-r overflow-y-auto`}>
              <ChatList chats={chats} userType="renter" />
            </div>

            {/* Chat Window (Right Side) */}
            <div className={`${chatId ? 'block' : 'hidden lg:flex'} flex-1`}>
              {selectedChat ? (
                <ChatWindow
                  chat={selectedChat}
                  onSendMessage={handleSendMessage}
                  onRefresh={handleRefresh}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a chat from the list to view messages
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenterChats;
