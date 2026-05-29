import svgPaths from "./svg-w2q3yixnip";
import { imgG6015 } from "./svg-6to9w";

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

function Section3() {
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

function Frame7() {
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
      <Frame7 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[103px] top-[271px]">
      <div className="absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[189.5px] not-italic text-[#797979] text-[14px] text-center text-nowrap top-[281.5px] tracking-[-0.3px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">How does an exam work?</p>
      </div>
    </div>
  );
}

function Frame8() {
  return <div className="absolute bg-[#2b2b30] border border-[#009379] border-solid h-[54px] left-[22px] rounded-[8px] shadow-[0px_0px_27.3px_0px_rgba(0,147,121,0.35)] top-[438px] w-[333px]" />;
}

function Frame1() {
  return <div className="absolute bg-[#009379] left-[34px] rounded-[5px] size-[23px] top-[453px]" />;
}

function G() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[24px_19.636px]" data-name="g6015" style={{ maskImage: `url('${imgG6015}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 19.6364">
        <g id="g6015">
          <path d={svgPaths.p239b7e80} fill="var(--fill-0, #F1C40F)" id="rect3220" />
          <path d={svgPaths.p17011000} fill="var(--fill-0, #E74C3C)" id="rect3990" />
          <path d={svgPaths.p775f500} fill="var(--fill-0, #222222)" id="rect3992" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <G />
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute contents inset-0" data-name="layer1">
      <ClipPathGroup />
    </div>
  );
}

function Component775923CountryFlagGermanGermanyNationalIcon() {
  return (
    <div className="absolute h-[19.636px] left-[74px] overflow-clip top-[453.95px] w-[24px]" data-name="775923_country_flag_german_germany_national_icon 1">
      <Layer />
    </div>
  );
}

function Section1() {
  return (
    <div className="absolute contents left-[22px] top-[438px]" data-name="Section 5">
      <Frame8 />
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[117px] not-italic text-[17px] text-white top-[456px] w-[209px]">Topic Example</p>
      <Frame1 />
      <Component775923CountryFlagGermanGermanyNationalIcon />
    </div>
  );
}

function Frame9() {
  return <div className="absolute bg-[#2b2b30] border border-[#009379] border-solid h-[54px] left-[22px] rounded-[8px] shadow-[0px_0px_27.3px_0px_rgba(0,147,121,0.35)] top-[572px] w-[333px]" />;
}

function Frame2() {
  return <div className="absolute bg-[#009379] left-[34px] rounded-[5px] size-[23px] top-[587px]" />;
}

function G1() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[24px_19.636px]" data-name="g6015" style={{ maskImage: `url('${imgG6015}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 19.6364">
        <g id="g6015">
          <path d={svgPaths.p239b7e80} fill="var(--fill-0, #F1C40F)" id="rect3220" />
          <path d={svgPaths.p17011000} fill="var(--fill-0, #E74C3C)" id="rect3990" />
          <path d={svgPaths.p775f500} fill="var(--fill-0, #222222)" id="rect3992" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <G1 />
    </div>
  );
}

function Layer1() {
  return (
    <div className="absolute contents inset-0" data-name="layer1">
      <ClipPathGroup1 />
    </div>
  );
}

function Component775923CountryFlagGermanGermanyNationalIcon1() {
  return (
    <div className="absolute h-[19.636px] left-[74px] overflow-clip top-[587.95px] w-[24px]" data-name="775923_country_flag_german_germany_national_icon 1">
      <Layer1 />
    </div>
  );
}

function Section6() {
  return (
    <div className="absolute contents left-[22px] top-[572px]" data-name="Section 12">
      <Frame9 />
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[117px] not-italic text-[17px] text-white top-[590px] w-[209px]">Topic Example</p>
      <Frame2 />
      <Component775923CountryFlagGermanGermanyNationalIcon1 />
    </div>
  );
}

function Frame10() {
  return <div className="absolute bg-[#2b2b30] border border-[#009379] border-solid h-[54px] left-[22px] rounded-[8px] shadow-[0px_0px_27.3px_0px_rgba(0,147,121,0.35)] top-[505px] w-[333px]" />;
}

function Frame3() {
  return <div className="absolute bg-[#009379] left-[34px] rounded-[5px] size-[23px] top-[520px]" />;
}

function G2() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[24px_19.636px]" data-name="g6015" style={{ maskImage: `url('${imgG6015}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 19.6364">
        <g id="g6015">
          <path d={svgPaths.p239b7e80} fill="var(--fill-0, #F1C40F)" id="rect3220" />
          <path d={svgPaths.p17011000} fill="var(--fill-0, #E74C3C)" id="rect3990" />
          <path d={svgPaths.p775f500} fill="var(--fill-0, #222222)" id="rect3992" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <G2 />
    </div>
  );
}

function Layer2() {
  return (
    <div className="absolute contents inset-0" data-name="layer1">
      <ClipPathGroup2 />
    </div>
  );
}

function Component775923CountryFlagGermanGermanyNationalIcon2() {
  return (
    <div className="absolute h-[19.636px] left-[74px] overflow-clip top-[520.95px] w-[24px]" data-name="775923_country_flag_german_germany_national_icon 1">
      <Layer2 />
    </div>
  );
}

function Section5() {
  return (
    <div className="absolute contents left-[22px] top-[505px]" data-name="Section 11">
      <Frame10 />
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[117px] not-italic text-[17px] text-white top-[523px] w-[209px]">Topic Example</p>
      <Frame3 />
      <Component775923CountryFlagGermanGermanyNationalIcon2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[36px] left-[182px] overflow-clip rounded-[8px] top-[388px] w-[173px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[85px] not-italic text-[14px] text-center text-nowrap text-white top-[7px] translate-x-[-50%]">Edit Topics</p>
    </div>
  );
}

function Section() {
  return (
    <div className="absolute contents left-[182px] top-[388px]" data-name="Section 4">
      <Frame4 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute h-[8px] left-[10px] top-[13px] w-[17px]">
      <div className="absolute inset-[-9.38%_-4.41%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.5 9.5">
          <g id="Group 2085662705">
            <path d="M0.75 0.75H17.75" id="Vector 122" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
            <path d="M4.81522 8.75H13.6848" id="Vector 124" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
            <path d="M2.59783 4.75H15.9022" id="Vector 123" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[36px] left-[22px] overflow-clip rounded-[8px] top-[388px] w-[149px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[37px] not-italic text-[14px] text-nowrap text-white top-[7px]">Topics</p>
      <Group4 />
    </div>
  );
}

function Section4() {
  return (
    <div className="absolute contents left-[22px] top-[388px]" data-name="Section 10">
      <Frame5 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[22px] top-[388px]">
      <Section1 />
      <Section6 />
      <Section5 />
      <Section />
      <Section4 />
    </div>
  );
}

function Frame6() {
  return <div className="absolute bg-[#2b2b30] border-[#484848] border-[1.5px] border-solid left-[11px] rounded-[5px] size-[23px] top-[14px]" />;
}

function Frame11() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[54px] left-[22px] overflow-clip rounded-[8px] top-[320px] w-[333px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[61px] not-italic text-[#838383] text-[14px] top-[18px] w-[246px]">See results only at the end</p>
      <Frame6 />
    </div>
  );
}

function Section2() {
  return (
    <div className="absolute contents left-[22px] top-[320px]" data-name="Section 5">
      <Frame11 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[22px] top-[320px]">
      <Section2 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[-1px] top-[150px]">
      <div className="absolute bg-[#ccc] h-[15px] left-[32px] rounded-[13px] top-[209px] w-[313px]" />
      <div className="absolute bg-gradient-to-r from-[#8dcfc3] h-[15px] left-[32px] rounded-[13px] to-[#109a81] top-[209px] w-[36px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[188.5px] not-italic text-[18px] text-center text-white top-[150px] translate-x-[-50%] w-[333px]">Exam duration in minutes:</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[50px] not-italic text-[10px] text-center text-white top-[209px] translate-x-[-50%] w-[102px]">5</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[103.5px] not-italic text-[#818181] text-[8px] text-center top-[230px] translate-x-[-50%] w-[19px]">10</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[190.5px] not-italic text-[#818181] text-[8px] text-center top-[230px] translate-x-[-50%] w-[19px]">20</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[277.5px] not-italic text-[#818181] text-[8px] text-center top-[230px] translate-x-[-50%] w-[19px]">30</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[26.23%_78.13%_69.09%_14.4%]" data-name="Group">
      <div className="absolute inset-[-5.26%_-7.14%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 41.992">
          <g id="Group">
            <path d={svgPaths.p1a63abc0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="4" />
            <path d={svgPaths.p235b7700} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="4" />
            <path d={svgPaths.p1403f000} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            <path d={svgPaths.pc290d90} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Btn() {
  return (
    <div className="absolute bg-[#009379] h-[46px] left-[63px] rounded-[12px] top-[673px] w-[251px]" data-name="Btn">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[144px] py-[13px] relative size-full">
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.3px]">
            <p className="leading-[normal]">Create Exam</p>
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

function Frame12() {
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

function Frame13() {
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

function Frame14() {
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

function Frame16() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentChat20Regular1 />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">KI-Tools</p>
    </div>
  );
}

function Frame15() {
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
        <Frame12 />
        <Frame13 />
        <Frame14 />
        <Frame16 />
        <Frame15 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.1px] border-[rgba(0,0,0,0.5)] border-solid inset-[-0.1px] pointer-events-none" />
    </div>
  );
}

export default function PrufungErstellen() {
  return (
    <div className="bg-[#0a0a0a] overflow-clip relative rounded-[50px] size-full" data-name="Prüfung erstellen">
      <Section3 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[24px] not-italic text-[16px] text-nowrap text-white top-[85px]">Simulate Exam</p>
      <Group3 />
      <Group6 />
      <Group8 />
      <Group5 />
      <Group7 />
      <Group />
      <Btn />
      <NavigationBar />
    </div>
  );
}