import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Home, MapPin, IndianRupee, RefreshCw, Calendar, FileText, Shield } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Button from '../common/Button';

const ChatWindow = ({ chat, onSendMessage, onRefresh }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showScheduleVisit, setShowScheduleVisit] = useState(false);
  const [showRequestDocuments, setShowRequestDocuments] = useState(false);
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

  const handleScheduleVisit = async () => {
    const visitMessage = `I would like to schedule a property visit. Please let me know your available time slots.`;
    await onSendMessage(visitMessage, [], 'schedule_visit');
    setShowScheduleVisit(false);
  };

  const handleRequestDocuments = async () => {
    const docMessage = `Could you please share the property documents for verification? (Ownership proof, property tax receipts, etc.)`;
    await onSendMessage(docMessage, [], 'document_request');
    setShowRequestDocuments(false);
  };

  // Determine user role badge
  const getUserRoleBadge = (userType) => {
    if (userType === 'owner') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Home className="w-3 h-3 mr-1" />
          Owner
        </span>
      );
    } else if (userType === 'renter') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Shield className="w-3 h-3 mr-1" />
          Renter
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full" data-testid="chat-window">
      {/* Chat Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            data-testid="back-button"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-white" data-testid="chat-title">
                {chat.other_user?.full_name || 'User'}
              </h2>
              {getUserRoleBadge(chat.other_user?.user_type)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {chat.property?.title || 'Property'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 p-2"
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
              <div className="mb-6 bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-200">
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
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {chat.property.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">
                        {chat.property.location?.locality}, {chat.property.location?.city}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
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
        <div className="hidden lg:block w-80 border-l border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4 overflow-y-auto transition-colors duration-200">
          {chat.property && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Property Details</h3>
                
                {chat.property.images?.[0] && (
                  <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-3">
                    <img
                      src={chat.property.images[0]}
                      alt={chat.property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {chat.property.title}
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {chat.property.location?.address}, {chat.property.location?.locality}, {chat.property.location?.city}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-gray-600 dark:text-gray-300">Rent</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      ₹{chat.property.rent?.toLocaleString()}/month
                    </span>
                  </div>
                  
                  {chat.property.bhk_type && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Type</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
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
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-3 sticky bottom-0 transition-colors duration-200">
        {/* Role-specific quick actions */}
        <div className="flex gap-2 mb-3">
          {chat.current_user_type === 'renter' && (
            <>
              <button
                onClick={() => setShowScheduleVisit(!showScheduleVisit)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                data-testid="schedule-visit-btn"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Schedule Visit
              </button>
              <button
                onClick={() => setShowRequestDocuments(!showRequestDocuments)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
                data-testid="request-docs-btn"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Request Documents
              </button>
            </>
          )}
          {chat.current_user_type === 'owner' && (
            <>
              <button
                onClick={() => setShowScheduleVisit(!showScheduleVisit)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition"
                data-testid="propose-visit-btn"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Propose Visit Time
              </button>
            </>
          )}
        </div>

        {/* Quick action modals */}
        {showScheduleVisit && (
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
              {chat.current_user_type === 'renter' 
                ? 'Request a property visit?' 
                : 'Propose a visit time?'}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleScheduleVisit}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send Request
              </Button>
              <Button
                onClick={() => setShowScheduleVisit(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {showRequestDocuments && (
          <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-purple-900 dark:text-purple-200 mb-2">
              Request property verification documents?
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleRequestDocuments}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Send Request
              </Button>
              <Button
                onClick={() => setShowRequestDocuments(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default ChatWindow;
