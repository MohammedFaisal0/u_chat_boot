"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import NewChatForm from "./NewChatForm";
import RenameChatModal from "./RenameChatModal";
import SaveChatModal from "./SaveChatModal";
import { Loader2, AlertCircle, MessageCircle, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/uis";
import { useI18n } from "@/lib/i18n";

const ChatInterface = ({ studentId }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewChatFormVisible, setIsNewChatFormVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [chatToRename, setChatToRename] = useState(null);
  const [chatToSave, setChatToSave] = useState(null);
  const [currentChatName, setCurrentChatName] = useState("");
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chats', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch chats");
      const data = await response.json();
      setChats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = async (message, from = "student") => {
    if (!selectedChat) return;

    try {
      const response = await fetch(`/api/chats/${selectedChat._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_text: message, from: from }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const newMessage = await response.json();
      
      // Update the selected chat with the new message
      setSelectedChat(prevChat => ({
        ...prevChat,
        messages: [...(prevChat.messages || []), newMessage]
      }));

      // Also update the chats list to reflect the new message count
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, messages: [...(chat.messages || []), newMessage] }
            : chat
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleNewChat = () => {
    setIsNewChatFormVisible(true);
  };

  const handleCreateNewChat = async (chatName) => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ name: chatName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create new chat");
      }
      const newChat = await response.json();
      setChats((prevChats) => [...prevChats, newChat]);
      setSelectedChat(newChat);
      setIsNewChatFormVisible(false);
    } catch (err) {
      console.error("Error creating chat:", err);
      setError("An error occurred while creating a new chat: " + err.message);
    }
  };

  const handleDeleteChat = (chatId) => {
    setChatToDelete(chatId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      const response = await fetch(`/api/chats/${chatToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete chat");

      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatToDelete));
      if (selectedChat?._id === chatToDelete) {
        setSelectedChat(null);
      }
      setIsDeleteModalOpen(false);
      setChatToDelete(null);
    } catch (err) {
      setError("An error occurred while deleting the chat.");
    }
  };

  const handleToggleFavorite = async (chatId, isFavorite) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      });
      if (!response.ok) throw new Error("Failed to update favorite status");

      // Update local state
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, isFavorite } : chat
        )
      );

      // Update selected chat if it's the one being modified
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat((prev) => ({ ...prev, isFavorite }));
      }
    } catch (err) {
      setError("An error occurred while updating favorite status.");
    }
  };

  const handleRenameChat = (chatId, currentName) => {
    setChatToRename(chatId);
    setCurrentChatName(currentName);
    setIsRenameModalOpen(true);
  };

  const handleSaveChat = (chatId, isCurrentlySaved) => {
    if (isCurrentlySaved) {
      // If already saved, ask for confirmation before unsaving
      if (confirm(t('chat.confirm_unsave'))) {
        handleSaveChatAction(chatId, null, true);
      }
    } else {
      // If not saved, open modal to ask for reason
      setChatToSave(chatId);
      setIsSaveModalOpen(true);
    }
  };

  const handleSaveChatAction = async (chatId, saveReason, isUnsave = false) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isSaved: !isUnsave,
          savedAt: !isUnsave ? new Date() : null,
          saveReason: !isUnsave ? saveReason : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to save/unsave chat");

      // Update local state
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId
            ? {
              ...chat,
              isSaved: !isUnsave,
              savedAt: !isUnsave ? new Date() : null,
              saveReason: !isUnsave ? saveReason : null,
            }
            : chat
        )
      );

      // Update selected chat if it's the one being modified
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat((prev) => ({
          ...prev,
          isSaved: !isUnsave,
          savedAt: !isUnsave ? new Date() : null,
          saveReason: !isUnsave ? saveReason : null,
        }));
      }

      // Show success message for direct unsave
      if (isUnsave && !saveReason) {
        // Direct unsave - show brief success message
        console.log("Chat unsaved successfully");
      }
    } catch (err) {
      setError("An error occurred while saving/unsaving the chat.");
      throw err;
    }
  };

  const confirmRenameChat = async (newName) => {
    try {
      const response = await fetch(`/api/chats/${chatToRename}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customName: newName }),
      });
      if (!response.ok) throw new Error("Failed to rename chat");

      // Update local state
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatToRename ? { ...chat, customName: newName } : chat
        )
      );

      // Update selected chat if it's the one being renamed
      if (selectedChat && selectedChat._id === chatToRename) {
        setSelectedChat((prev) => ({ ...prev, customName: newName }));
      }

      setIsRenameModalOpen(false);
      setChatToRename(null);
      setCurrentChatName("");
    } catch (err) {
      setError("An error occurred while renaming the chat.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="student" title={t('nav.chats')}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#60a5fa] mx-auto mb-4" />
            <p className="text-[#1e40af]">{t('common.loading')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="student" title={t('nav.chats')}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] bg-[#f8fafc] rounded-xl shadow-lg overflow-hidden border border-[#dbeafe]/30">
      <div className="flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-1/3 border-r border-[#dbeafe]/30 flex flex-col bg-[#f8fafc]">
          {/* Header */}
          <div className="p-4 border-b border-[#dbeafe]/30 bg-[#f8fafc] shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1e40af]">
                {t('nav.chats')}
              </h2>
              <button
                onClick={handleNewChat}
                className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t('chat.new_chat')}</span>
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
            <ChatList
              chats={chats}
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChat?._id}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onToggleFavorite={handleToggleFavorite}
              onRenameChat={handleRenameChat}
              onSaveChat={handleSaveChat}
            />
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-[#f8fafc]">
          {isNewChatFormVisible ? (
            <div className="flex-1 flex items-center justify-center bg-[#dbeafe]/20 p-8">
              <div className="bg-[#f8fafc] rounded-xl shadow-lg p-6 w-full max-w-md">
                <NewChatForm
                  onSubmit={handleCreateNewChat}
                  onCancel={() => setIsNewChatFormVisible(false)}
                />
              </div>
            </div>
          ) : selectedChat ? (
            <ChatWindow chat={selectedChat} onSendMessage={handleSendMessage} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#dbeafe]/20 to-[#f8fafc]/30">
              <div className="text-center p-8">
                <div className="bg-[#f8fafc] rounded-full p-6 shadow-lg inline-block mb-6">
                  <MessageCircle className="w-16 h-16 text-[#60a5fa] mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-[#1e40af] mb-3">
                  {t('chat.select_chat_title')}
                </h3>
                <p className="text-[#60a5fa] mb-8 text-lg max-w-md mx-auto">
                  {t('chat.select_chat_description')}
                </p>
                <button
                  onClick={handleNewChat}
                  className="bg-[#60a5fa] hover:bg-[#3b82f6] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('chat.start_new_chat')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteChat}
        title={t('chat.delete_chat')}
        message={t('chat.confirm_delete')}
      />

      <RenameChatModal
        isOpen={isRenameModalOpen}
        onClose={() => {
          setIsRenameModalOpen(false);
          setChatToRename(null);
          setCurrentChatName("");
        }}
        onSubmit={confirmRenameChat}
        currentName={currentChatName}
      />

      <SaveChatModal
        isOpen={isSaveModalOpen}
        onClose={() => {
          setIsSaveModalOpen(false);
          setChatToSave(null);
        }}
        chatId={chatToSave}
        onSave={handleSaveChatAction}
        isCurrentlySaved={selectedChat?.isSaved || false}
      />
    </div>
  );
};

export default ChatInterface;