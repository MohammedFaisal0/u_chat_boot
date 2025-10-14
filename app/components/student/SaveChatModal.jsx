import React, { useState } from 'react';
import { X, Bookmark, BookmarkCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const SaveChatModal = ({ isOpen, onClose, chatId, onSave, isCurrentlySaved }) => {
  const [saveReason, setSaveReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { t, isRTL } = useI18n();

  const handleSave = async () => {
    if (!saveReason.trim()) {
      alert(t('chat.save_reason_required'));
      return;
    }

    setLoading(true);
    try {
      await onSave(chatId, saveReason);
      onClose();
      setSaveReason('');
    } catch (error) {
      alert(t('chat.save_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async () => {
    setLoading(true);
    try {
      await onSave(chatId, null, true); // true indicates unsave
      onClose();
    } catch (error) {
      alert(t('chat.unsave_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80]">
      <div className="bg-[#f8fafc] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1e40af]">
            {isCurrentlySaved ? t('chat.unsave_conversation') : t('chat.save_conversation')}
          </h2>
          <button
            onClick={onClose}
            className="text-[#60a5fa] hover:text-[#3b82f6]"
          >
            <X size={24} />
          </button>
        </div>

        {isCurrentlySaved ? (
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-[#dbeafe]/20 rounded-lg">
              <BookmarkCheck className="w-6 h-6 text-[#60a5fa] mr-3" />
              <div>
                <p className="text-[#1e40af] font-medium">{t('chat.conversation_saved')}</p>
                <p className="text-[#60a5fa] text-sm">{t('chat.saved_conversation_info')}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[#dbeafe]/30 rounded-lg text-[#1e40af] hover:bg-[#dbeafe]/20"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUnsave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : t('chat.unsave')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-[#dbeafe]/20 rounded-lg">
              <Bookmark className="w-6 h-6 text-[#60a5fa] mr-3" />
              <div>
                <p className="text-[#1e40af] font-medium">{t('chat.save_conversation_title')}</p>
                <p className="text-[#60a5fa] text-sm">{t('chat.save_conversation_info')}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1e40af] mb-2">
                {t('chat.save_reason')}
              </label>
              <textarea
                value={saveReason}
                onChange={(e) => setSaveReason(e.target.value)}
                placeholder={t('chat.save_reason_placeholder')}
                className="w-full p-3 border border-[#dbeafe]/30 rounded-lg text-[#1e40af] focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[#dbeafe]/30 rounded-lg text-[#1e40af] hover:bg-[#dbeafe]/20"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !saveReason.trim()}
                className="flex-1 px-4 py-2 bg-[#60a5fa] text-white rounded-lg hover:bg-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : t('chat.save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveChatModal;

