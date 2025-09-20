import React from 'react';
import { Music } from 'lucide-react';

const MusicIcon: React.FC<{ size?: number }> = ({ size = 34 }) => {
  return (
    <div
      className="flex items-center justify-center rounded-lg shadow-md"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(180deg, #fd355a 0%, #fd5163 100%)', // 원본 SVG a 그라디언트
      }}
    >
      <Music size={size * 0.5} color="white" />
    </div>
  );
};

export default MusicIcon;
