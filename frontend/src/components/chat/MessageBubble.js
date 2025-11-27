import React from 'react';
import { Check, CheckCheck, Reply } from 'lucide-react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, isOwn, senderName, index = 0 }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const readReceiptVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}
      data-testid={`message-${message.message_id}`}
    >
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-gray-600 dark:text-gray-400 mb-1 ml-2"
          >
            {senderName}
          </motion.p>
        )}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`rounded-lg px-4 py-2 ${isOwn
            ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-none shadow-md'
            : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
          } relative`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.2 }}
              className="mt-2 space-y-1"
            >
              {message.attachments.map((attachment, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-xs opacity-90 bg-white/10 rounded px-2 py-1 cursor-pointer"
                >
                  📎 {attachment}
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Timestamp and read status */}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
              {formatTime(message.timestamp)}
            </span>
            {isOwn && (
              <motion.span
                variants={readReceiptVariants}
                initial="initial"
                animate="animate"
                className="text-blue-100"
              >
                {message.is_read ? (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCheck className="w-3 h-3" />
                  </motion.div>
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </motion.span>
            )}
          </div>

          {/* Reply indicator for threaded messages */}
          {message.reply_to && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1 text-xs opacity-75"
            >
              <Reply className="w-3 h-3" />
              <span>Reply to previous message</span>
            </motion.div>
          )}
        </motion.div>

        {/* Quick actions on hover (desktop) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="hidden lg:flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {/* Could add reply, forward, delete buttons here */}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;