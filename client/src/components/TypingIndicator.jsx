import React from "react";

const TypingIndicator = () => {
    return (
      <div className="flex items-center space-x-1 bg-white rounded-xs rounded-tl-xl rounded-bl-none w-16 mt-1 h-6 px-3">
        <span className="h-2 w-2 bg-slate-600 rounded-full animate-bounce [animation-delay:0s]"></span>
        <span className="h-2 w-2 bg-slate-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="h-2 w-2 bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    );
  };
  
  export default TypingIndicator;