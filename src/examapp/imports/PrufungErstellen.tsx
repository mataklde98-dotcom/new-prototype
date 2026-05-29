import svgPaths from "./svg-a7t1rnf9ul";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Lightbulb, Sparkles, FileCheck, Braces, BookOpen } from 'lucide-react';

interface PrufungErstellenProps {
  onStartClick: () => void;
  isCreating?: boolean; // true = API is working, false = API finished
}

function Btn({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <div
      className={`absolute h-[46px] left-1/2 -translate-x-1/2 rounded-[12px] top-[647px] lg:top-[610px] w-[251px] max-w-[67%] transition-all ${ 
        disabled 
          ? 'bg-[#484848] cursor-not-allowed opacity-50' 
          : 'bg-[#009379] cursor-pointer hover:bg-[#00a88b]'
      }`}
      data-name="Btn"
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[144px] py-[13px] relative size-full">
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.3px]">
            <p className="leading-[normal]">Los geht's</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBarTime() {
  return (
    <div className="h-[21px] relative rounded-[24px] shrink-0 w-[54px]" data-name="_StatusBar-time">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[20px] leading-[22px] left-[27px] not-italic text-[17px] text-center text-white top-px tracking-[-0.408px] translate-x-[-50%] w-[54px]">9:41</p>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-full items-center justify-center min-h-px min-w-px relative shrink-0" data-name="Left Side">
      <StatusBarTime />
    </div>
  );
}

function TrueDepthCamera() {
  return <div className="absolute bg-black h-[37px] left-[calc(50%-22.5px)] rounded-[100px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[80px]" data-name="TrueDepth camera" />;
}

function FaceTimeCamera() {
  return <div className="absolute bg-black left-[calc(50%+44px)] rounded-[100px] size-[37px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="FaceTime camera" />;
}

function StatusBarDynamicIsland() {
  return (
    <div className="bg-black h-[37px] relative rounded-[100px] shrink-0 w-[125px]" data-name="StatusBar-dynamicIsland">
      <TrueDepthCamera />
      <FaceTimeCamera />
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="content-stretch flex flex-col h-full items-center pb-0 pt-[10px] px-0 relative shrink-0" data-name="Dynamic Island">
      <StatusBarDynamicIsland />
    </div>
  );
}

function SignalWifiBattery() {
  return (
    <div className="h-[13px] relative shrink-0 w-[78.401px]" data-name="Signal, Wifi, Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 78.4012 13">
        <g id="Signal, Wifi, Battery">
          <g id="Icon / Mobile Signal">
            <path d={svgPaths.p1ec31400} fill="var(--fill-0, white)" />
            <path d={svgPaths.p19f8d480} fill="var(--fill-0, white)" />
            <path d={svgPaths.p13f4aa00} fill="var(--fill-0, white)" />
            <path d={svgPaths.p1bfb7500} fill="var(--fill-0, white)" />
          </g>
          <path d={svgPaths.p36909200} fill="var(--fill-0, white)" id="Wifi" />
          <g id="_StatusBar-battery">
            <path d={svgPaths.pb6b7100} id="Outline" opacity="0.35" stroke="var(--stroke-0, #888888)" />
            <path d={svgPaths.p9c6aca0} fill="var(--fill-0, #888888)" id="Battery End" opacity="0.4" />
            <path d={svgPaths.p2cb42c00} fill="var(--fill-0, white)" id="Fill" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function RightSide() {
  return (
    <div className="basis-0 content-stretch flex grow h-full items-center justify-center min-h-px min-w-px relative shrink-0" data-name="Right Side">
      <SignalWifiBattery />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="content-stretch flex h-[59px] items-end justify-center relative shrink-0 w-full" data-name="StatusBar">
      <LeftSide />
      <DynamicIsland />
      <RightSide />
    </div>
  );
}

function TopNavigation() {
  return (
    <div className="backdrop-blur-[10px] backdrop-filter content-stretch flex flex-col gap-[2px] h-[53px] items-start relative shrink-0 w-full" data-name="TopNavigation">
      <StatusBar />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center w-full top-0">
      <TopNavigation />
    </div>
  );
}

function Section1() {
  return (
    <div className="absolute w-full top-0 lg:hidden" data-name="Section 7">
      <Frame />
    </div>
  );
}

function Section() {
  return (
    <div className="absolute h-[228.147px] left-1/2 -translate-x-1/2 top-[253px] lg:top-[180px] w-[191.825px]" data-name="Section 3">
      <div className="absolute inset-[-0.5%_-0.34%_-0.5%_-0.6%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 193.617 230.441">
          <g id="Section 3">
            <path d={svgPaths.p21703e80} fill="var(--fill-0, #C0DDD8)" id="Vector 57" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p10dfb300} fill="var(--fill-0, #F1F0F9)" id="Vector 75" />
            <path d={svgPaths.p1045f800} fill="var(--fill-0, #00362C)" id="Vector 72" />
            <path d={svgPaths.p72cbec0} fill="var(--fill-0, #009379)" id="Vector 73" />
            <ellipse cx="7.50908" cy="14.0852" fill="var(--fill-0, #009379)" id="Ellipse 28" rx="7.50908" ry="14.0852" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 63.2138 70.8)" />
            <ellipse cx="7.50908" cy="14.0852" fill="var(--fill-0, #009379)" id="Ellipse 30" rx="7.50908" ry="14.0852" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 121.793 74.0394)" />
            <g filter="url(#filter0_f_4_1594)" id="Ellipse 27">
              <ellipse cx="12.2671" cy="19.2742" fill="var(--fill-0, #009379)" rx="12.2671" ry="19.2742" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 59.2581 64.9684)" />
            </g>
            <g filter="url(#filter1_f_4_1594)" id="Ellipse 29">
              <ellipse cx="12.2671" cy="19.2742" fill="var(--fill-0, #009379)" rx="12.2671" ry="19.2742" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 117.512 68.5321)" />
            </g>
            <path d={svgPaths.p2197d2f0} fill="var(--fill-0, white)" id="Vector 74" />
            <path d={svgPaths.p61697c0} fill="var(--fill-0, #009379)" id="Vector 66" stroke="var(--stroke-0, #00362C)" strokeWidth="2.29374" />
            <path d={svgPaths.p5ea8e00} fill="var(--fill-0, #00705C)" id="Vector 67" />
            <path d={svgPaths.p169c3ac0} fill="var(--fill-0, #00A88B)" id="Vector 68" stroke="var(--stroke-0, #00362C)" strokeWidth="1.14687" />
            <path d={svgPaths.p66def40} fill="var(--fill-0, #009379)" id="Vector 61" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p1ce180f0} fill="var(--fill-0, #EBEBF5)" id="Vector 58" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.pcedbf00} fill="var(--fill-0, #009379)" id="Vector 59" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p947d400} fill="var(--fill-0, #EBEBF5)" id="Vector 60" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p14e03900} fill="var(--fill-0, #009379)" id="Vector 65" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p4ba2100} fill="var(--fill-0, #EBEBF5)" id="Vector 63" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.pea17c00} fill="var(--fill-0, #009379)" id="Vector 64" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p2db9d800} fill="var(--fill-0, #EBEBF5)" id="Vector 62" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p72b3300} fill="var(--fill-0, #009379)" id="Vector 71" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p9161600} fill="var(--fill-0, white)" id="Vector 70" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p38984400} id="Vector 83" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p3ab50000} fill="var(--fill-0, #009379)" id="Vector 84" />
            <path d={svgPaths.p31abaaf0} fill="var(--fill-0, #00705C)" id="Vector 85" />
            <path d={svgPaths.p9e8ee80} fill="var(--fill-0, white)" id="Vector 69" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p3b0fec10} fill="var(--fill-0, #D0D0D0)" id="Vector 76" />
            <path d={svgPaths.p211bce00} fill="var(--fill-0, #D0D0D0)" id="Vector 78" />
            <path d={svgPaths.p35b84380} fill="var(--fill-0, white)" id="Vector 77" />
            <path d={svgPaths.p10708e80} fill="var(--fill-0, #005C4C)" id="Vector 79" />
            <path d={svgPaths.p39df8000} fill="var(--fill-0, #005C4C)" id="Vector 81" />
            <path d={svgPaths.p1b2d1d80} fill="var(--fill-0, #009379)" id="Vector 80" />
            <path d={svgPaths.p342e9900} fill="var(--fill-0, #009379)" id="Vector 82" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="74.5836" id="filter0_f_4_1594" width="60.8081" x="39.3548" y="47.9579">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_4_1594" stdDeviation="9.0316" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="74.5836" id="filter1_f_4_1594" width="60.8081" x="97.6087" y="51.5216">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_4_1594" stdDeviation="9.0316" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function SolarHome2Outline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="solar:home-2-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="solar:home-2-outline">
          <path clipRule="evenodd" d={svgPaths.p7306a20} fill="var(--fill-0, white)" fillOpacity="0.5" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p2833c480} fill="var(--fill-0, white)" fillOpacity="0.5" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <SolarHome2Outline />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap">Home</p>
    </div>
  );
}

function FluentMeetNow16Regular() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="fluent:meet-now-16-regular">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="fluent:meet-now-16-regular">
          <path d={svgPaths.p3f3cb900} fill="var(--fill-0, white)" fillOpacity="0.5" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentMeetNow16Regular />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap">Meetings</p>
    </div>
  );
}

function FluentChat20Regular() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="fluent:chat-20-regular">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="fluent:chat-20-regular" opacity="0.5">
          <path d={svgPaths.p14867580} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentChat20Regular />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap">Chats</p>
    </div>
  );
}

function Group() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Group">
      <div className="absolute inset-[-2.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <g id="Group">
            <path d={svgPaths.p2cbbee00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p1a9d2600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p21794800} fill="var(--fill-0, white)" id="Vector_3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function FluentChat20Regular1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[2px] relative shrink-0 size-[24px]" data-name="fluent:chat-20-regular">
      <Group />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentChat20Regular1 />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">KI-Tools</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col gap-[8.5px] h-[62px] items-center px-[8px] py-[11px] relative rounded-[100px] shrink-0">
      <div className="relative shrink-0 size-[19.5px]" data-name="Union">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 19.5">
          <path d={svgPaths.p8fa8980} fill="var(--fill-0, white)" fillOpacity="0.5" id="Union" />
        </svg>
      </div>
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap">Profil</p>
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="absolute bg-[#24262f] h-[78px] left-0 bottom-0 w-full lg:hidden" data-name="Navigation Bar">
      <div className="content-stretch flex gap-[7px] items-center justify-center overflow-clip p-[16px] relative rounded-[inherit] size-full">
        <Frame1 />
        <Frame2 />
        <Frame3 />
        <Frame5 />
        <Frame4 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.1px] border-[rgba(0,0,0,0.5)] border-solid inset-[-00.1px] pointer-events-none" />
    </div>
  );
}

export default function PrufungErstellen({ onStartClick, isCreating = true }: PrufungErstellenProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  // When API finishes (isCreating becomes false), show success message briefly
  useEffect(() => {
    if (!isCreating && !showSuccess) {
      setShowSuccess(true);
    }
  }, [isCreating, showSuccess]);

  return (
    <div className="bg-[#0a0a0a] overflow-hidden relative size-full" data-name="Prüfung erstellen">
      <Btn onClick={onStartClick} disabled={isCreating} />
      <Section1 />
      
      {/* Glow effect - pulsating during loading */}
      <motion.div 
        className="absolute h-[190px] left-1/2 -translate-x-1/2 top-[278px] lg:top-[205px] w-[149px]"
        animate={isCreating ? {
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.05, 1],
        } : {
          opacity: 0.5,
          scale: 1
        }}
        transition={{
          duration: 2,
          repeat: isCreating ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-[-84.53%_-107.79%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 470.2 511.2">
            <g filter="url(#filter0_d_4_1629)" id="Ellipse 213">
              <ellipse cx="235.1" cy="255.6" fill="var(--fill-0, #D9D9D9)" rx="74.5" ry="95" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="511.2" id="filter0_d_4_1629" width="470.2" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset />
                <feGaussianBlur stdDeviation="80.3" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.576471 0 0 0 0 0.47451 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_1629" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4_1629" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </motion.div>
      
      {/* Mascot - REMOVED (Ice character) */}
      <div className="relative">
        
        {/* Document - ALWAYS visible, just filled when complete */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[360px] lg:top-[290px] w-[70px] h-[50px] flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
          <div className="w-[60px] h-[42px] bg-white rounded-[4px] shadow-xl p-[6px] flex flex-col gap-[3px]">
            {/* Lines - filled when complete, pulsing during creation */}
            {[0, 1, 2, 3, 4].map((lineIndex) => (
              <motion.div 
                key={lineIndex} 
                className="w-full h-[5px] bg-[#009379] rounded-full"
                animate={isCreating ? {
                  opacity: [0.3, 1, 0.3],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isCreating ? Infinity : 0,
                  delay: lineIndex * 0.15,
                  ease: "easeInOut"
                }}
                style={{ opacity: isCreating ? 0.3 : 1 }}
              />
            ))}
          </div>
        </div>

        {/* Glow effect - only during creation */}
        {isCreating && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[360px] lg:top-[290px] w-[60px] h-[40px] rounded-[8px] bg-[#009379]/40 blur-md pointer-events-none"
            style={{ zIndex: 1 }}
            animate={{
              opacity: [0.4, 0.9, 0.4],
              scale: [0.95, 1.08, 0.95],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Hands typing animation - only during creation */}
        {isCreating && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[380px] lg:top-[310px] w-[120px] h-[40px] pointer-events-none"
            style={{ zIndex: 10 }}
          >
            {/* Left hand tap effect */}
            <motion.div
              className="absolute left-[25px] top-[15px] w-4 h-4 rounded-full bg-[#009379]/40 blur-[2px]"
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            
            {/* Right hand tap effect */}
            <motion.div
              className="absolute right-[25px] top-[15px] w-4 h-4 rounded-full bg-[#009379]/40 blur-[2px]"
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: 0.3,
                ease: "easeOut"
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Status text with animation */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[510px] lg:top-[460px] w-full px-4">
        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Simple fixed message - NO FAKE PROGRESS */}
              <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic text-[16px] text-nowrap text-white">
                Prüfung wird erstellt...
              </p>

              {/* Indeterminate loading indicator (3 pulsing dots) */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#009379]"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <div className="w-12 h-12 rounded-full bg-[#009379] flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
              <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic text-[16px] text-nowrap text-white">
                Prüfung wurde erstellt!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}