import svgPaths from "./svg-vnzlpvefo3";

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

function Section1() {
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

function Group1() {
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

function Frame1() {
  return (
    <div className="absolute border border-[#484848] border-solid left-[313px] overflow-clip rounded-[30px] size-[42px] top-[76px]">
      <ArrowSmLeft />
      <Group1 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[313px] top-[76px]">
      <Frame1 />
    </div>
  );
}

function Section() {
  return (
    <div className="absolute h-[174.217px] left-[119px] top-[124px] w-[146.481px]" data-name="Section 3">
      <div className="absolute inset-[-0.66%_-0.52%_-0.66%_-0.78%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 148.391 176.511">
          <g id="Section 3">
            <path d={svgPaths.p277fbcf0} fill="var(--fill-0, #C0DDD8)" id="Vector 57" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p3da20f80} fill="var(--fill-0, #F1F0F9)" id="Vector 75" />
            <path d={svgPaths.p2c1c8000} fill="var(--fill-0, #00362C)" id="Vector 72" />
            <path d={svgPaths.p222e8500} fill="var(--fill-0, #009379)" id="Vector 73" />
            <ellipse cx="5.73406" cy="10.7557" fill="var(--fill-0, #009379)" id="Ellipse 28" rx="5.73406" ry="10.7557" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 48.5422 54.3351)" />
            <ellipse cx="5.73406" cy="10.7557" fill="var(--fill-0, #009379)" id="Ellipse 30" rx="5.73406" ry="10.7557" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 93.2745 56.8088)" />
            <g filter="url(#filter0_f_8_1318)" id="Ellipse 27">
              <ellipse cx="9.36735" cy="14.7181" fill="var(--fill-0, #009379)" rx="9.36735" ry="14.7181" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 45.5215 49.882)" />
            </g>
            <g filter="url(#filter1_f_8_1318)" id="Ellipse 29">
              <ellipse cx="9.36735" cy="14.7181" fill="var(--fill-0, #009379)" rx="9.36735" ry="14.7181" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 90.0053 52.6034)" />
            </g>
            <path d={svgPaths.p1cd93800} fill="var(--fill-0, white)" id="Vector 74" />
            <path d={svgPaths.p2f77c280} fill="var(--fill-0, #009379)" id="Vector 66" stroke="var(--stroke-0, #00362C)" strokeWidth="2.29374" />
            <path d={svgPaths.p2fd6ac30} fill="var(--fill-0, #00705C)" id="Vector 67" />
            <path d={svgPaths.p2b631af0} fill="var(--fill-0, #00A88B)" id="Vector 68" stroke="var(--stroke-0, #00362C)" strokeWidth="1.14687" />
            <path d={svgPaths.p3b6c9ef0} fill="var(--fill-0, #009379)" id="Vector 61" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p3fb3fc00} fill="var(--fill-0, #EBEBF5)" id="Vector 58" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p31888c80} fill="var(--fill-0, #009379)" id="Vector 59" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.pf53900} fill="var(--fill-0, #EBEBF5)" id="Vector 60" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p1e1800} fill="var(--fill-0, #009379)" id="Vector 65" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p3999dd00} fill="var(--fill-0, #EBEBF5)" id="Vector 63" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p49c3480} fill="var(--fill-0, #009379)" id="Vector 64" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.pc98a400} fill="var(--fill-0, #EBEBF5)" id="Vector 62" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p36bbbb80} fill="var(--fill-0, #009379)" id="Vector 71" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p7a2e700} fill="var(--fill-0, white)" id="Vector 70" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p1ae2ac80} id="Vector 83" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p6123f80} fill="var(--fill-0, #009379)" id="Vector 84" />
            <path d={svgPaths.p28b12400} fill="var(--fill-0, #00705C)" id="Vector 85" />
            <path d={svgPaths.p72ce700} fill="var(--fill-0, white)" id="Vector 69" stroke="var(--stroke-0, black)" strokeWidth="2.29374" />
            <path d={svgPaths.p1baffdc0} fill="var(--fill-0, #D0D0D0)" id="Vector 76" />
            <path d={svgPaths.p35f84b00} fill="var(--fill-0, #D0D0D0)" id="Vector 78" />
            <path d={svgPaths.p3d735d52} fill="var(--fill-0, white)" id="Vector 77" />
            <path d={svgPaths.pa317400} fill="var(--fill-0, #005C4C)" id="Vector 79" />
            <path d={svgPaths.p5d01080} fill="var(--fill-0, #005C4C)" id="Vector 81" />
            <path d={svgPaths.p22d73a80} fill="var(--fill-0, #009379)" id="Vector 80" />
            <path d={svgPaths.p233a3800} fill="var(--fill-0, #009379)" id="Vector 82" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="65.4929" id="filter0_f_8_1318" width="54.9738" x="26.0532" y="32.6227">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_8_1318" stdDeviation="9.0316" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="65.4929" id="filter1_f_8_1318" width="54.9738" x="70.537" y="35.344">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_8_1318" stdDeviation="9.0316" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[190px] left-[21px] rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)] top-[402px] w-[329px]">
      <div className="absolute left-[22px] size-[115px] top-[58px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 115 115">
          <path d={svgPaths.p3cdb7a00} fill="var(--fill-0, #E74C3C)" id="Ellipse 41" />
        </svg>
      </div>
      <div className="absolute flex items-center justify-center left-[22px] size-[115px] top-[58px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg]">
          <div className="relative size-[115px]">
            <div className="absolute inset-[17.43%_0.15%_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 114.83 94.9499">
                <path d={svgPaths.p5a1d700} fill="url(#paint0_radial_8_1357)" id="Ellipse 42" />
                <defs>
                  <radialGradient cx="0" cy="0" gradientTransform="translate(163.875 -4.23759) rotate(132.769) scale(156.655 156.655)" gradientUnits="userSpaceOnUse" id="paint0_radial_8_1357" r="1">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#009379" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[152px] not-italic text-[12px] text-white top-[80px] w-[120px]">
        <p className="mb-[12px] text-[#009379]">Correct</p>
        <p className="mb-[12px] text-[#e74c3c]">Incorrect</p>
        <p className="text-[#a1a1a1]">Skipped</p>
      </div>
      <div className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[282px] not-italic text-[12px] text-white top-[80px] w-[36px]">
        <p className="mb-[12px] text-[#009379]">14</p>
        <p className="mb-[12px] text-[#e74c3c]">6</p>
        <p className="text-[#a1a1a1]">0</p>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[19px] not-italic text-[14px] text-white top-[19px] w-[88px]">Overview</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[294px] not-italic text-[#a1a1a1] text-[14px] text-right top-[19px] translate-x-[-100%] w-[93px]">20 Questions</p>
    </div>
  );
}

function Btn() {
  return (
    <div className="absolute bg-[#009379] h-[46px] left-[105px] rounded-[12px] top-[624px] w-[166px]" data-name="Btn">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[144px] py-[13px] relative size-full">
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-center text-nowrap text-white tracking-[-0.3px]">
            <p className="leading-[normal]">View Exam</p>
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

function Frame2() {
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

function Frame3() {
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

function Frame4() {
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

function Frame6() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentChat20Regular1 />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">KI-Tools</p>
    </div>
  );
}

function Frame5() {
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
        <Frame2 />
        <Frame3 />
        <Frame4 />
        <Frame6 />
        <Frame5 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.1px] border-[rgba(0,0,0,0.5)] border-solid inset-[-0.1px] pointer-events-none" />
    </div>
  );
}

export default function ViewExam() {
  return (
    <div className="bg-[#0a0a0a] overflow-clip relative rounded-[50px] size-full" data-name="View Exam">
      <Section1 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[188.5px] not-italic text-[16px] text-center text-white top-[333px] translate-x-[-50%] w-[281px]">Feel free to review the Questions from your completed Exam</p>
      <Group2 />
      <Section />
      <div className="absolute left-[216px] size-[68px] top-[248px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 68 68">
          <circle cx="34" cy="34" fill="var(--fill-0, white)" id="Ellipse 214" r="32.75" stroke="var(--stroke-0, black)" strokeWidth="2.5" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[normal] left-[249.5px] not-italic text-[#0a0a0a] text-[28px] text-center top-[261px] translate-x-[-50%] w-[53px]">2</p>
      <Frame7 />
      <Btn />
      <NavigationBar />
    </div>
  );
}