import svgPaths from "./svg-urzdbglsr2";

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
    <div className="backdrop-blur-[10px] backdrop-filter content-stretch flex flex-col gap-[2px] h-[53px] items-start relative shrink-0 w-[393px]" data-name="TopNavigation">
      <StatusBar />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-11px] top-0">
      <TopNavigation />
    </div>
  );
}

function Section2() {
  return (
    <div className="absolute contents left-[-11px] top-0" data-name="Section 7">
      <Frame />
    </div>
  );
}

function ArrowSmLeft() {
  return (
    <div className="absolute left-[8px] size-[24px] top-[8px]" data-name="arrow-sm-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-sm-left"></g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-[16px] size-[9px] top-[15px]">
      <div className="absolute inset-[-8.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
          <g id="Group 2085662703">
            <path d="M0.750001 0.75L9.75 9.75" id="Vector 120" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
            <path d="M9.75 0.75L0.75 9.75" id="Vector 121" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute border border-[#484848] border-solid left-[313px] overflow-clip rounded-[30px] size-[42px] top-[76px]">
      <ArrowSmLeft />
      <Group2 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[313px] top-[76px]">
      <Frame3 />
    </div>
  );
}

function Frame1() {
  return <div className="absolute bg-[#2b2b30] border-[#484848] border-[1.5px] border-solid left-[11px] rounded-[5px] size-[23px] top-[14px]" />;
}

function Frame4() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[54px] left-[22px] overflow-clip rounded-[8px] top-[361px] w-[333px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[54px] not-italic text-[17px] text-white top-[17px] w-[209px]">Choice</p>
      <Frame1 />
    </div>
  );
}

function Section() {
  return (
    <div className="absolute contents left-[22px] top-[361px]" data-name="Section 5">
      <Frame4 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[22px] top-[361px]">
      <Section />
    </div>
  );
}

function Frame2() {
  return <div className="absolute bg-[#2b2b30] border-[#484848] border-[1.5px] border-solid left-[11px] rounded-[5px] size-[23px] top-[14px]" />;
}

function Frame5() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[54px] left-[22px] overflow-clip rounded-[8px] top-[428px] w-[333px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[54px] not-italic text-[17px] text-white top-[17px] w-[209px]">Choice</p>
      <Frame2 />
    </div>
  );
}

function Section1() {
  return (
    <div className="absolute contents left-[22px] top-[428px]" data-name="Section 5">
      <Frame5 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[22px] top-[428px]">
      <Section1 />
    </div>
  );
}

function Frame6() {
  return <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[128px] left-[7px] rounded-[8px] top-[614px] w-[361px]" />;
}

function Section3() {
  return (
    <div className="absolute contents left-[7px] top-[614px]" data-name="Section 5">
      <Frame6 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[7px] top-[614px]">
      <Section3 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[28.68px] not-italic text-[#009379] text-[14px] top-[631px] w-[95.399px]">Very good!</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[356.07px] not-italic text-[#a1a1a1] text-[14px] text-right top-[631px] translate-x-[-100%] w-[194.051px]">Show Solution</p>
    </div>
  );
}

function Frame7() {
  return <div className="absolute bg-[#2b2b30] border border-[#009379] border-solid h-[54px] left-[22px] rounded-[8px] shadow-[0px_0px_27.3px_0px_rgba(0,147,121,0.35)] top-[495px] w-[333px]" />;
}

function Component775923CountryFlagGermanGermanyNationalIcon() {
  return <div className="absolute h-[19.636px] left-[74px] top-[510.95px] w-[24px]" data-name="775923_country_flag_german_germany_national_icon 1" />;
}

function Section4() {
  return (
    <div className="absolute contents left-[22px] top-[495px]" data-name="Section 5">
      <Frame7 />
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[77px] not-italic text-[#009379] text-[17px] top-[513px] w-[209px]">Choice</p>
      <Component775923CountryFlagGermanGermanyNationalIcon />
      <div className="absolute inset-[63.3%_85.07%_34.85%_9.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 15">
          <path d={svgPaths.pac8f470} fill="var(--fill-0, #009379)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[27px] top-[134px]">
      <div className="absolute bg-[#e74c3c] h-[5px] left-[27px] rounded-[13px] top-[137px] w-[36px]" />
      <div className="absolute bg-[#e74c3c] h-[5px] left-[68px] rounded-[13px] top-[137px] w-[36px]" />
      <div className="absolute bg-[#e74c3c] h-[5px] left-[109px] rounded-[13px] top-[137px] w-[36px]" />
      <div className="absolute bg-[#009379] h-[5px] left-[150px] rounded-[13px] top-[137px] w-[36px]" />
      <div className="absolute bg-[#009379] h-[5px] left-[191px] rounded-[13px] top-[137px] w-[36px]" />
      <div className="absolute bg-[#009379] h-[11px] left-[232px] rounded-[13px] top-[134px] w-[36px]" />
      <div className="absolute bg-[#555] h-[5px] left-[273px] rounded-[13px] top-[137px] w-[36px]" />
      <div className="absolute bg-[#555] h-[5px] left-[314px] rounded-bl-[13px] rounded-tl-[13px] top-[137px] w-[28px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[10.71%_60.27%_86.7%_34.13%]" data-name="Group">
      <div className="absolute inset-[-7.14%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="Group">
            <path d={svgPaths.p1f1b6800} id="Vector" stroke="var(--stroke-0, #CE0000)" strokeWidth="3" />
            <path d={svgPaths.p2edd2b80} id="Vector_2" stroke="var(--stroke-0, #CE0000)" strokeLinecap="round" strokeWidth="3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[128px] top-[75px]">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[158px] not-italic text-[#ce0000] text-[30px] text-nowrap top-[75px]">00:09</p>
      <Group />
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative size-[44px]">
      <div className="absolute inset-[-10.45%_-15%_-19.55%_-15%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.2 57.2">
          <g filter="url(#filter0_d_4_1680)" id="Frame 2087325020">
            <rect fill="var(--fill-0, #2B2B30)" height="44" rx="22" shapeRendering="crispEdges" width="44" x="6.6" y="4.6" />
            <rect height="43" rx="21.5" shapeRendering="crispEdges" stroke="var(--stroke-0, #484848)" width="43" x="7.1" y="5.1" />
            <path d={svgPaths.p9e77600} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57.2" id="filter0_d_4_1680" width="57.2" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="3.3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_1680" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_4_1680" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Btn() {
  return (
    <div className="absolute bg-[#009379] h-[46px] left-[78px] rounded-[12px] top-[667px] w-[221px]" data-name="Btn">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[144px] py-[13px] relative size-full">
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.3px]">
            <p className="leading-[normal]">next</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[78px] top-[667px]">
      <Btn />
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

function Frame8() {
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

function Frame9() {
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

function Frame10() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentChat20Regular />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap">Chats</p>
    </div>
  );
}

function Group1() {
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
      <Group1 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentChat20Regular1 />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">KI-Tools</p>
    </div>
  );
}

function Frame11() {
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
    <div className="absolute bg-[#24262f] h-[78px] left-0 top-[736px] w-[375px]" data-name="Navigation Bar">
      <div className="content-stretch flex gap-[7px] items-center justify-center overflow-clip p-[16px] relative rounded-[inherit] size-full">
        <Frame8 />
        <Frame9 />
        <Frame10 />
        <Frame12 />
        <Frame11 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.1px] border-[rgba(0,0,0,0.5)] border-solid inset-[-0.1px] pointer-events-none" />
    </div>
  );
}

export default function AnswerCorrect() {
  return (
    <div className="bg-[#0a0a0a] overflow-clip relative rounded-[50px] size-full" data-name="Answer Correct">
      <Section2 />
      <Group3 />
      <div className="absolute flex flex-col font-['Baloo_Bhai_2:Medium',sans-serif] font-medium justify-center leading-[0] left-[21px] text-[#797979] text-[16px] text-nowrap top-[180px] tracking-[-0.3px] translate-y-[-50%]">
        <p className="leading-[normal]">0.5 PKT</p>
      </div>
      <div className="absolute font-['Poppins:SemiBold',sans-serif] h-[156px] leading-[26.697px] left-[21px] not-italic right-[20px] text-[16px] text-white top-[199px]">
        <p className="font-['Poppins:Bold',sans-serif] mb-0">Undertopic Example:</p>
        <p className="mb-0">&nbsp;</p>
        <p className="font-['Poppins:Regular',sans-serif]">{`"Wie wirkt sich regelmäßige körperliche Bewegung auf die geistige Gesundheit aus?"`}</p>
      </div>
      <Group4 />
      <Group5 />
      <Group7 />
      <Section4 />
      <Group8 />
      <Group6 />
      <div className="absolute flex items-center justify-center left-[21px] size-[44px] top-[668px]">
        <div className="flex-none rotate-[180deg]">
          <Frame13 />
        </div>
      </div>
      <Group9 />
      <NavigationBar />
    </div>
  );
}