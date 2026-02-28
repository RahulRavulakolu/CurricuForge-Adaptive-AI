import React from 'react';

export default function Hero3DOrb() {
  return (
    <div className="relative w-[600px] h-[500px] flex items-center justify-center overflow-hidden">
      {/* Static gradient orb as replacement */}
      <div className="relative">
        <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#00E5FF]/30 to-[#8B5FFF]/30 blur-2xl" />
        <div className="absolute inset-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#00E5FF]/20 to-transparent blur-xl" />
        <div className="absolute inset-10 w-[320px] h-[320px] rounded-full bg-gradient-to-bl from-[#8B5FFF]/20 to-transparent blur-lg" />
        
        {/* Inner core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5FFF] shadow-2xl shadow-[#00E5FF]/50" />
        </div>
      </div>
      
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[500px] h-[400px] rounded-full bg-gradient-to-r from-[#00E5FF]/10 to-[#8B5FFF]/10 blur-3xl" />
      </div>
    </div>
  );
}