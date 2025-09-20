import React from 'react';

const NoteIcon: React.FC = () => {
  return (
    <div className="relative w-10 h-10 rounded-xl shadow-md overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-b from-yellow-200 to-yellow-400" />
      <div className="absolute top-2.5 left-0 w-full h-full bg-white" />
      <div className="absolute top-3 left-0 right-0 space-y-2">
        <div className="border border-t border-gray-300 border-dashed" />
        <div className="h-px bg-gray-300" />
        <div className="h-px bg-gray-300" />
      </div>
    </div>
  );
};

export default NoteIcon;
