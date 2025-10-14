// app/components/student/LoadingAnimation.jsx

import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="flex space-x-2 justify-center items-center bg-white p-3 rounded-lg shadow-md">
      <div className="w-2 h-2 bg-[#D9A76A] rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-[#D9A76A] rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-[#D9A76A] rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );
};

export default LoadingAnimation;
