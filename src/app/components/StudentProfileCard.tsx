import React from 'react';
import { Info } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function StudentProfileCard() {
  const { profileImage, userName } = useUser();
  const firstName = userName.split(' ')[0];

  return (
    <div className="relative rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-5 transition-colors duration-200 hover:border-white/[0.10]">
      {/* Profile Section - Horizontal Layout */}
      <div className="flex items-center gap-4 mb-5">
        {/* Profile Picture - Premium flat ring */}
        <div className="flex-shrink-0">
          <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-[2px]">
            <img 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover" 
              src={profileImage} 
            />
          </div>
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/35 mb-0.5">
            Willkommen zurück
          </p>
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-white leading-tight truncate">
            {firstName}
          </h3>
        </div>
      </div>

      {/* Knowledge Level Section */}
      <div>
        {/* Label + Percentage row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/35">
              Wissensstand
            </p>
            <button 
              className="w-[14px] h-[14px] flex-shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Knowledge level info"
            >
              <Info className="w-full h-full text-white/20" />
            </button>
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white/60">
            25%
          </p>
        </div>

        {/* Progress Bar - Flat */}
        <div className="relative h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full rounded-full bg-[#4ADE80]"
            style={{ width: '25%' }}
          />
        </div>
      </div>
    </div>
  );
}