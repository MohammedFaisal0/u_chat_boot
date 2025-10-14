"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { 
  PlusCircle, 
  Search, 
  MessageCircle, 
  Trash2, 
  Star, 
  Edit3, 
  Bookmark,
  Clock,
  CheckCircle
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ChatList = ({
  chats,
  onSelectChat,
  selectedChatId,
  onNewChat,
  onDeleteChat,
  onToggleFavorite,
  onRenameChat,
  onSaveChat,
  showOnlySaved = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t, isRTL } = useI18n();

  const filteredChats = chats.filter(chat => {
    const matchesSearch = (chat.customName || chat.name).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSavedFilter = showOnlySaved ? chat.isSaved : true;
    return matchesSearch && matchesSavedFilter;
  });

  const getChatStatus = (chat) => {
    if (chat.isSaved) return { icon: Bookmark, color: "text-green-600", label: t('chat.saved') };
    if (chat.isFavorite) return { icon: Star, color: "text-yellow-600", label: t('chat.favorite') };
    return { icon: MessageCircle, color: "text-gray-400", label: t('chat.normal') };
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-[#dbeafe]/30 bg-[#f8fafc]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#60a5fa] w-4 h-4" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#dbeafe]/30 rounded-lg focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent text-sm text-[#1e40af] placeholder-gray-500 shadow-sm"
          />
        </div>
        {showOnlySaved && (
          <div className="mt-2 flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-[#60a5fa]" />
            <span className="text-sm text-[#60a5fa] font-medium">
              {t('chat.saved_conversations')}
            </span>
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center">
            <div className="bg-[#dbeafe]/20 rounded-full p-4 inline-block mb-4">
              <MessageCircle className="w-8 h-8 text-[#60a5fa] mx-auto" />
            </div>
            <p className="text-[#1e40af] text-sm mb-4">
              {searchTerm ? t('chat.no_search_results') : t('chat.no_chats')}
            </p>
            {!searchTerm && (
              <button
                onClick={onNewChat}
                className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                {t('chat.start_first_chat')}
              </button>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => {
              const isSelected = selectedChatId === chat._id;
              const status = getChatStatus(chat);
              const StatusIcon = status.icon;

              return (
                <div
                  key={chat._id}
                  onClick={() => onSelectChat(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group border ${
                    isSelected
                      ? "bg-[#60a5fa]/10 border-[#60a5fa] shadow-md"
                      : "hover:bg-[#dbeafe]/20 border-[#dbeafe]/30 hover:border-[#60a5fa]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        <h3 className={`text-sm font-medium truncate ${
                          isSelected ? "text-[#60a5fa]" : "text-[#1e40af]"
                        }`}>
                          {chat.customName || chat.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-[#60a5fa]">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(chat.time_started || chat.createdAt || Date.now()), "MMM d, HH:mm")}</span>
                        {chat.messages && chat.messages.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{chat.messages.length} {t('chat.messages')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(chat._id, chat.isFavorite);
                        }}
                        className={`p-1.5 rounded-md hover:bg-[#dbeafe]/20 transition-colors duration-200 ${
                          chat.isFavorite ? "text-yellow-500 bg-yellow-50" : "text-[#60a5fa]"
                        }`}
                        title={chat.isFavorite ? t('chat.unfavorite') : t('chat.favorite')}
                      >
                        <Star className={`w-4 h-4 ${chat.isFavorite ? "fill-current" : ""}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveChat(chat._id, chat.isSaved);
                        }}
                        className={`p-1.5 rounded-md hover:bg-[#dbeafe]/20 transition-colors duration-200 ${
                          chat.isSaved ? "text-green-500 bg-green-50" : "text-[#60a5fa]"
                        }`}
                        title={chat.isSaved ? t('chat.unsave_conversation') : t('chat.save_conversation')}
                      >
                        <Bookmark className={`w-4 h-4 ${chat.isSaved ? "fill-current" : ""}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRenameChat(chat._id, chat.customName || chat.name);
                        }}
                        className="p-1.5 rounded-md hover:bg-[#dbeafe]/20 text-[#60a5fa] hover:text-[#3b82f6] transition-colors duration-200"
                        title={t('chat.rename')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat._id);
                        }}
                        className="p-1.5 rounded-md hover:bg-red-50 text-[#60a5fa] hover:text-red-600 transition-colors duration-200"
                        title={t('chat.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-t border-[#dbeafe]/30">
        <button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white px-4 py-2 rounded-lg font-semibold hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t('chat.new_chat')}</span>
        </button>
      </div>
    </div>
  );
};

export default ChatList;