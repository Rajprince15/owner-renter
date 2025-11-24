import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwn, senderName }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div 
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      data-testid={`message-${message.message_id}`}
    >
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <p className="text-xs text-gray-600 mb-1 ml-2">{senderName}</p>
        )}
        <div
          className={`rounded-lg px-4 py-2 ${isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="text-xs opacity-90">
                  📎 {attachment}
                </div>
              ))}
            </div>
          )}
          
          {/* Timestamp and read status */}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
              {formatTime(message.timestamp)}
            </span>
            {isOwn && (
              <span className="text-blue-100">
                {message.is_read ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
