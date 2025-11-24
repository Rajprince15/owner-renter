import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Home, MapPin, IndianRupee, RefreshCw } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Button from '../common/Button';

const ChatWindow = ({ chat, onSendMessage, onRefresh }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleViewProperty = () => {
    if (chat.property?.property_id) {
      navigate(`/property/${chat.property.property_id}`);
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="chat-window">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="lg:hidden text-gray-600 hover:text-gray-900"
            data-testid="back-button"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div>
            <h2 className="font-semibold text-gray-900" data-testid="chat-title">
              {chat.other_user?.full_name || 'User'}
            </h2>
            <p className="text-sm text-gray-600">
              {chat.property?.title || 'Property'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          className="text-gray-600 hover:text-gray-900 p-2"
          data-testid="refresh-button"
          title="Refresh messages"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Property Info Card */}
            {chat.property && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex gap-3">
                  {chat.property.images?.[0] && (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={chat.property.images[0]}
                        alt={chat.property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {chat.property.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">
                        {chat.property.location?.locality}, {chat.property.location?.city}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-blue-600">
                      <IndianRupee className="w-3 h-3" />
                      <span>{chat.property.rent?.toLocaleString()}/month</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleViewProperty}
                  variant="outline"
                  className="w-full mt-3 text-sm"
                  data-testid="view-property-button"
                >
                  <Home className="w-4 h-4 mr-2" />
                  View Property Details
                </Button>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-1">
              {chat.messages.map((msg) => {
                const isOwn = msg.sender_type === chat.current_user_type;
                return (
                  <MessageBubble
                    key={msg.message_id}
                    message={msg}
                    isOwn={isOwn}
                    senderName={isOwn ? 'You' : chat.other_user?.full_name || 'User'}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Property Info Sidebar (Desktop) */}
        <div className="hidden lg:block w-80 border-l bg-gray-50 p-4 overflow-y-auto">
          {chat.property && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Property Details</h3>
                
                {chat.property.images?.[0] && (
                  <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-3">
                    <img
                      src={chat.property.images[0]}
                      alt={chat.property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <h4 className="font-semibold text-gray-900 mb-2">
                  {chat.property.title}
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      {chat.property.location?.address}, {chat.property.location?.locality}, {chat.property.location?.city}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-gray-600">Rent</span>
                    <span className="font-semibold text-blue-600">
                      ₹{chat.property.rent?.toLocaleString()}/month
                    </span>
                  </div>
                  
                  {chat.property.bhk_type && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-semibold text-gray-900">
                        {chat.property.bhk_type}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                onClick={handleViewProperty}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3 sticky bottom-0">
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
            data-testid="message-input"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            data-testid="send-button"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default ChatWindow;
