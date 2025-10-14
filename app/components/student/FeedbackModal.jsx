import React, { useState } from "react";
import { X, Star } from "lucide-react";
import StarRating from "../ui/StarRating";

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  conversationId, 
  messageId 
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    onSubmit({ 
      rating, 
      comment,
      conversationId,
      messageId 
    });
    setRating(0);
    setComment("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[80]">
      <div className="bg-[#f8fafc] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1e40af]">Rate this response</h3>
          <button
            onClick={onClose}
            className="text-[#60a5fa] hover:text-[#3b82f6]"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1e40af] mb-2">
              How would you rate this response?
            </label>
            <div className="flex items-center space-x-2">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                interactive={true}
                size="lg"
              />
              <span className="text-sm text-[#60a5fa]">
                {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-[#1e40af] mb-2"
            >
              Additional comments (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-[#dbeafe]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60a5fa] text-[#1e40af] placeholder-gray-500"
              rows="3"
              placeholder="Share your thoughts about this response..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#1e40af] bg-[#dbeafe]/20 rounded-md hover:bg-[#dbeafe]/30 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#60a5fa] rounded-md hover:bg-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
