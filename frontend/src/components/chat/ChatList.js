import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Home, Search, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatList = ({ chats, userType }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, unread, name

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

  // Filter and sort chats
  const filteredAndSortedChats = React.useMemo(() => {
    let filtered = chats.filter(chat => {
      const searchLower = searchQuery.toLowerCase();
      return (
        chat.property?.title?.toLowerCase().includes(searchLower) ||
        chat.other_user?.full_name?.toLowerCase().includes(searchLower) ||
        chat.last_message?.message?.toLowerCase().includes(searchLower)
      );
    });

    // Sort chats
    if (sortBy === 'unread') {
      filtered.sort((a, b) => (b.unread_count || 0) - (a.unread_count || 0));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => 
        (a.other_user?.full_name || '').localeCompare(b.other_user?.full_name || '')
      );
    } else {
      // Sort by recent (last_message_at)
      filtered.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
    }

    return filtered;
  }, [chats, searchQuery, sortBy]);

  if (chats.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 text-center"
        data-testid="empty-chat-list"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-full flex items-center justify-center mb-4"
        >
          <MessageCircle className="w-10 h-10 text-blue-500 dark:text-blue-400" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
        >
          No conversations yet
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 max-w-sm"
        >
          {userType === 'renter' 
            ? 'Start browsing properties and contact owners to begin conversations.'
            : 'Renters will contact you about your properties.'}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-testid="chat-list"
    >
      {/* Search and Sort Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative mb-3"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            data-testid="chat-search-input"
          />
        </motion.div>

        {/* Sort dropdown */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            data-testid="chat-sort-dropdown"
          >
            <option value="recent">Most Recent</option>
            <option value="unread">Unread First</option>
            <option value="name">Name</option>
          </select>
          {filteredAndSortedChats.length !== chats.length && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-sm text-blue-600 dark:text-blue-400 font-medium"
            >
              ({filteredAndSortedChats.length} results)
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedChats.map((chat, index) => (
            <motion.div
              key={chat.chat_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
              onClick={() => handleChatClick(chat.chat_id)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200 relative group"
              data-testid={`chat-item-${chat.chat_id}`}
            >
              {/* New message indicator */}
              {chat.unread_count > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-blue-600 rounded-r-full"
                />
              )}

              <div className="flex gap-3">
                {/* Property thumbnail */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex-shrink-0"
                >
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-200">
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
                </motion.div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {chat.property?.title || 'Property'}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                      {formatTime(chat.last_message_at)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {chat.other_user?.full_name || 'User'}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {searchQuery && chat.last_message?.message ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: chat.last_message.message.replace(
                              new RegExp(searchQuery, 'gi'),
                              (match) => `<mark class="bg-yellow-200 dark:bg-yellow-600/50">${match}</mark>`
                            )
                          }}
                        />
                      ) : (
                        chat.last_message?.message || 'No messages yet'
                      )}
                    </p>
                    {chat.unread_count > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className="ml-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 animate-pulse"
                        data-testid={`unread-badge-${chat.chat_id}`}
                      >
                        {chat.unread_count > 9 ? '9+' : chat.unread_count}
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>

              {/* Archive button on hover (desktop) */}
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ scale: 1.1 }}
                className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle archive
                }}
                title="Archive"
              >
                <Archive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No results message */}
      {filteredAndSortedChats.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Search className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No conversations found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm">
            Try adjusting your search terms
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatList;