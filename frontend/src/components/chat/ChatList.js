import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Home } from 'lucide-react';

const ChatList = ({ chats, userType }) => {
  const navigate = useNavigate();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? 'Yesterday' : `${diffInDays}d ago`;
    }
  };

  const handleChatClick = (chatId) => {
    navigate(`/${userType}/chats/${chatId}`);
  };

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-chat-list">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-600 max-w-sm">
          {userType === 'renter' 
            ? 'Start browsing properties and contact owners to begin conversations.'
            : 'Renters will contact you about your properties.'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200" data-testid="chat-list">
      {chats.map((chat) => (
        <div
          key={chat.chat_id}
          onClick={() => handleChatClick(chat.chat_id)}
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          data-testid={`chat-item-${chat.chat_id}`}
        >
          <div className="flex gap-3">
            {/* Property thumbnail */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                {chat.property?.images?.[0] ? (
                  <img
                    src={chat.property.images[0]}
                    alt={chat.property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Chat info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {chat.property?.title || 'Property'}
                </h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatTime(chat.last_message_at)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">
                {chat.other_user?.full_name || 'User'}
              </p>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate">
                  {chat.last_message?.message || 'No messages yet'}
                </p>
                {chat.unread_count > 0 && (
                  <span 
                    className="ml-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                    data-testid={`unread-badge-${chat.chat_id}`}
                  >
                    {chat.unread_count}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
