// app/components/student/ChatWindow.jsx

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send, User, Bot, Flag, ThumbsUp, MessageCircle } from "lucide-react";
import { LoadingAnimation } from "@/components/common";
import AddIssueModal from "./AddIssueModal";
import FeedbackModal from "./FeedbackModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useI18n } from "@/lib/i18n";

const ChatWindow = ({ chat, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const { t, isRTL } = useI18n();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };

  useEffect(() => {
    // Only scroll to bottom when new messages are added, not on initial load
    if (chat.messages && chat.messages.length > 0) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [chat.messages?.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setIsLoading(true);
      console.log("Sending message:", message);

      // Store the message before sending
      const messageToSend = message;
      
      // Send user message first
      await onSendMessage(messageToSend);

      // Clear the input ONLY after successful send
      setMessage("");

      try {
        console.log("Getting AI response...");
        // Get AI response from Groq
        const response = await fetch("/api/groq", {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: messageToSend,
            chatId: chat._id // إرسال معرف المحادثة
          }),
        });

        console.log("Groq response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Groq API error:", errorText);
          throw new Error("Failed to get AI response");
        }

        const data = await response.json();
        console.log("AI response:", data);

        // Send AI message
        await onSendMessage(data.reply, "ai");
      } catch (error) {
        console.error("Error getting AI response:", error);
        // Send error message to chat
        await onSendMessage("أعتذر، حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة لاحقاً.", "ai");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReportIssue = (message) => {
    setSelectedMessage(message);
    setIsIssueModalOpen(true);
  };

  const handleRateResponse = (message) => {
    setSelectedMessage(message);
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitIssue = async (issueData) => {
    try {
      const response = await fetch(`/api/issues/student`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...issueData,
          conversationId: chat._id,
          messageId: selectedMessage._id,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit issue");
      setIsIssueModalOpen(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error submitting issue:", error);
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...feedbackData,
          conversationId: chat._id,
          messageId: selectedMessage._id,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit feedback");
      setIsFeedbackModalOpen(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };


  const renderMessage = (msg) => {
    return (
      <div
        key={msg._id}
        className={`flex ${
          msg.from === "student" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex items-end space-x-2 ${
            msg.from === "student" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              msg.from === "student" ? "bg-[#60a5fa]" : "bg-gray-400"
            }`}
          >
            {msg.from === "student" ? (
              <User className="text-white" size={16} />
            ) : (
              <Bot className="text-white" size={16} />
            )}
          </div>
          <div
            className={`max-w-xs lg:max-w-md ${
              msg.from === "student"
                ? "bg-[#60a5fa] text-white rounded-lg"
                : "bg-white text-gray-900 rounded-lg shadow"
            } p-3`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className={`prose prose-sm max-w-none ${
                msg.from === "student" ? "prose-invert" : ""
              }`}
            >
              {msg.message_text}
            </ReactMarkdown>
            <div className="flex justify-between items-center mt-1">
              <p className={`text-xs ${
                msg.from === "student" ? "text-blue-100" : "text-[#60a5fa]"
              }`}>
                {format(new Date(msg.time_sent), "HH:mm")}
              </p>
              {msg.from === "ai" && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleRateResponse(msg)}
                    className="p-1 rounded-full hover:bg-[#dbeafe]/20 text-[#60a5fa]"
                    title={t('chat.rate_response')}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    onClick={() => handleReportIssue(msg)}
                    className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-200 transform hover:scale-110"
                    title={t('chat.report_issue')}
                  >
                    <Flag size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#f8fafc] border-b border-[#dbeafe]/30 p-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#60a5fa] rounded-full flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1e40af]">
              {chat.customName || chat.name}
            </h2>
            <p className="text-sm text-[#60a5fa]">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#dbeafe]/10">
        {chat.messages && chat.messages.length > 0 ? (
          chat.messages.map(renderMessage)
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#60a5fa] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#1e40af] mb-2">
                {t('chat.welcome_title')}
              </h3>
              <p className="text-[#60a5fa]">
                {t('chat.welcome_description')}
              </p>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#60a5fa]">
                <Bot className="text-white" size={16} />
              </div>
              <div className="bg-white rounded-lg p-3 shadow">
                <LoadingAnimation />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f8fafc] border-t border-[#dbeafe]/30 p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-white border border-[#dbeafe]/30 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent text-[#1e40af] placeholder-gray-500"
            placeholder={isLoading ? "جاري الإرسال..." : "اكتب رسالتك..."}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-[#60a5fa] hover:bg-[#3b82f6] text-white rounded-full p-2 transition-colors ${
              isLoading || !message.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !message.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      <AddIssueModal
        isOpen={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedMessage(null);
        }}
        onSubmit={handleSubmitIssue}
        conversationId={chat._id}
        messageId={selectedMessage?._id}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setSelectedMessage(null);
        }}
        onSubmit={handleSubmitFeedback}
        conversationId={chat._id}
        messageId={selectedMessage?._id}
      />

    </div>
  );
};

export default ChatWindow;
