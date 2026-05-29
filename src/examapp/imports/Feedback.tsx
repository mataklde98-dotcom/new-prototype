import svgPaths from "./svg-i0u4aa5lik";

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

function Section() {
  return (
    <div className="absolute contents left-[-11px] top-0" data-name="Section 7">
      <Frame />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[19px] top-[314px]">
      <div className="absolute bg-[#00382e] h-[15px] left-[29px] rounded-[13px] top-[373px] w-[313px]" />
      <div className="absolute bg-gradient-to-r from-[#8dcfc3] h-[15px] left-[29px] rounded-[13px] to-[#109a81] top-[373px] w-[161px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[185.5px] not-italic text-[18px] text-center text-white top-[314px] translate-x-[-50%] w-[333px]">How did you find the Exam?</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[188.5px] not-italic text-[#818181] text-[8px] text-center top-[394px] translate-x-[-50%] w-[59px]">okay</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[86px] not-italic text-[#818181] text-[8px] text-center top-[394px] translate-x-[-50%] w-[44px]">too easy</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[291px] not-italic text-[#818181] text-[8px] text-center top-[394px] translate-x-[-50%] w-[48px]">too difficult</p>
    </div>
  );
}

function Btn() {
  return (
    <div className="absolute bg-[#009379] h-[46px] left-[60px] rounded-[12px] top-[469px] w-[251px]" data-name="Btn">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[144px] py-[13px] relative size-full">
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.3px]">
            <p className="leading-[normal]">Done</p>
          </div>
        </div>
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
    <div className="absolute bg-[#24262f] h-[78px] left-0 top-[736px] w-[375px]" data-name="Navigation Bar">
      <div className="content-stretch flex gap-[7px] items-center justify-center overflow-clip p-[16px] relative rounded-[inherit] size-full">
        <Frame1 />
        <Frame2 />
        <Frame3 />
        <Frame5 />
        <Frame4 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.1px] border-[rgba(0,0,0,0.5)] border-solid inset-[-0.1px] pointer-events-none" />
    </div>
  );
}

export default function Feedback() {
  return (
    <div className="bg-[#0a0a0a] overflow-clip relative rounded-[50px] size-full" data-name="Feedback">
      <Section />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[24px] not-italic text-[16px] text-nowrap text-white top-[85px]">Feedback</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[26px] not-italic text-[#979797] text-[14px] text-nowrap top-[118px]">Your Feedback is important to us</p>
      <Group1 />
      <Btn />
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[186.5px] not-italic text-[#797979] text-[13px] text-center text-nowrap top-[544px] tracking-[-0.3px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">Contact Support</p>
      </div>
      <NavigationBar />
    </div>
  );
}