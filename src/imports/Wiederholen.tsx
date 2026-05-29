import svgPaths from "./svg-exlv0u7fvb";

function StatusBarTime() {
  return (
    <div className="h-[21px] relative rounded-[24px] shrink-0 w-[54px]" data-name="_StatusBar-time">
      <p className="absolute css-4hzbpn font-['Poppins:SemiBold',sans-serif] h-[20px] leading-[22px] left-[27px] not-italic text-[17px] text-center text-white top-px tracking-[-0.408px] translate-x-[-50%] w-[54px]" style={{ fontFeatureSettings: "'case'" }}>
        9:41
      </p>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center justify-center min-h-px min-w-px relative" data-name="Left Side">
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
    <div className="content-stretch flex flex-col h-full items-center pt-[10px] relative shrink-0" data-name="Dynamic Island">
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
          <path d={svgPaths.p74e6d40} fill="var(--fill-0, white)" id="Wifi" />
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
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Right Side">
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
    <div className="backdrop-blur-[10px] content-stretch flex flex-col gap-[2px] h-[53px] items-start relative shrink-0 w-[393px]" data-name="TopNavigation">
      <StatusBar />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-11px] top-0">
      <TopNavigation />
    </div>
  );
}

function Section() {
  return (
    <div className="absolute contents left-[-11px] top-0" data-name="Section 7">
      <Frame4 />
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

function Group17() {
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
      <Group17 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents left-[313px] top-[76px]">
      <Frame7 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-0 right-0 top-[703px]">
      <p className="absolute css-4hzbpn font-['Poppins:SemiBold',sans-serif] h-[27px] leading-[26.697px] left-0 not-italic right-0 text-[#888] text-[11px] text-center top-[703px]">Generated with AI</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="absolute left-[262px] size-[42px] top-[76px]" data-name="Frame 224_2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="Frame 224_2">
          <rect height="41" rx="20.5" stroke="var(--stroke-0, #484848)" width="41" x="0.5" y="0.5" />
          <g id="arrow-sm-left_2"></g>
          <path d={svgPaths.p5471a00} fill="var(--fill-0, white)" id="Vector_8" />
        </g>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents left-[262px] top-[76px]">
      <Frame29 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents left-[49px] top-[133px]">
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[61px] not-italic text-[#009379] text-[12px] top-[133px]">Repeat</p>
      <div className="absolute inset-[17%_84.53%_81.9%_13.07%]" data-name="Vector_9">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
          <path d={svgPaths.p189da200} fill="var(--fill-0, #009379)" id="Vector_9" />
        </svg>
      </div>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents left-[155px] top-[133px]">
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[169px] not-italic text-[12px] text-white top-[133px]">Manual</p>
      <div className="absolute inset-[17%_56%_81.9%_41.33%]" data-name="Vector_10">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9">
          <path d={svgPaths.pfd47c80} fill="var(--fill-0, white)" id="Vector_10" />
        </svg>
      </div>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents left-[255px] top-[133px]">
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[268px] not-italic text-[12px] text-white top-[133px]">Prognosis</p>
      <div className="absolute inset-[16.87%_29.33%_81.9%_68%]" data-name="Vector_11">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <path d={svgPaths.p321e0300} fill="var(--fill-0, white)" id="Vector_11" />
        </svg>
      </div>
    </div>
  );
}

function IconFilter() {
  return (
    <div className="absolute inset-[10.84%_33.9%_86.99%_61.6%]" data-name="🦆 icon 'filter'">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.8843 17.6733">
        <g id="ð¦ icon 'filter'">
          <path d={svgPaths.p2dd89600} fill="var(--fill-0, white)" id="Vector_12" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bg-[#2b2b30] border-[#484848] border-b border-r border-solid border-t h-[36px] left-[84px] opacity-50 overflow-clip rounded-br-[8px] rounded-tr-[8px] top-0 w-[24px]">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] left-[54.5px] not-italic text-[14px] text-center text-white top-[7px] translate-x-[-50%]">Englisch</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[36px] left-[116px] opacity-50 overflow-clip rounded-[8px] top-0 w-[108px]">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] left-[53.5px] not-italic text-[14px] text-center text-white top-[7px] translate-x-[-50%]">Mathe</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#009379] border-solid h-[36px] left-[232px] overflow-clip rounded-[8px] top-0 w-[108px]" data-name="Frame 205_2">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] left-[53.5px] not-italic text-[14px] text-center text-white top-[7px] translate-x-[-50%]">Informatik</p>
    </div>
  );
}

function Section1() {
  return (
    <div className="absolute contents left-[232px] top-0" data-name="Section 10">
      <Frame28 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[36px] left-[348px] opacity-50 overflow-clip rounded-[8px] top-0 w-[108px]">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] left-[53px] not-italic text-[14px] text-center text-white top-[7px] translate-x-[-50%]">Chemie</p>
    </div>
  );
}

function Frame44() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[36px] left-[464px] opacity-50 overflow-clip rounded-[8px] top-0 w-[108px]">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] left-[53px] not-italic text-[14px] text-center text-white top-[7px] translate-x-[-50%]">Deutsch</p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[36px] left-[580px] opacity-50 overflow-clip rounded-[8px] top-0 w-[108px]">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] left-[53px] not-italic text-[14px] text-center text-white top-[7px] translate-x-[-50%]">Deutsch</p>
    </div>
  );
}

function Frame42() {
  return (
    <div className="absolute h-[36px] left-[-63px] top-[177px] w-[688px]">
      <Frame6 />
      <Frame5 />
      <Section1 />
      <Frame43 />
      <Frame44 />
      <Frame45 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Group_2">
      <div className="absolute inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Vector_13">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.5843 32">
          <path d={svgPaths.p1bf29600} fill="var(--fill-0, white)" id="Vector_13" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_89.51%_39.39%_8.34%]" data-name="Vector_14">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07038 8.74632">
          <path d={svgPaths.p1c35ea00} fill="var(--fill-0, white)" id="Vector_14" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_84.59%_39.39%_13.26%]" data-name="Vector_15">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07037 8.74632">
          <path d={svgPaths.p25046730} fill="var(--fill-0, white)" id="Vector_15" />
        </svg>
      </div>
      <div className="absolute flex inset-[44.24%_87.24%_35.47%_10.79%] items-center justify-center">
        <div className="flex-none h-[2.357px] rotate-[-72.81deg] w-[14.35px]">
          <div className="relative size-full" data-name="Vector_16">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3502 2.35679">
              <path d={svgPaths.p14930b40} fill="var(--fill-0, white)" id="Vector_16" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 26_2">
      <p className="col-1 css-4hzbpn font-['Poppins:SemiBold',sans-serif] h-[26.697px] leading-[26.697px] ml-0 mt-0 not-italic relative row-1 text-[11px] text-white w-[169.185px]">Alltag, Gefühle</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#618cff] content-stretch flex flex-col items-center justify-center pb-[5px] pl-[7.281px] pr-[7px] pt-[4.854px] relative rounded-[124.989px] shrink-0 w-[88px]" data-name="Frame 26_2">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[16.989px] not-italic relative shrink-0 text-[10px] text-white">Informatik</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[88px]">
      <Frame8 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="col-1 content-stretch flex h-[27px] items-center ml-0 mt-[0.3px] relative row-1 w-[88px]">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return <div className="bg-[#009379] h-[26.992px] rounded-br-[124.989px] rounded-tr-[124.989px] w-[46.658px]" />;
}

function Frame9() {
  return (
    <div className="bg-[#919191] col-1 h-[27px] ml-[97.9px] mt-0 relative rounded-[124.989px] row-1 w-[88px]" data-name="Frame 26_3">
      <div className="absolute flex h-[27.221px] items-center justify-center left-[-0.05px] top-[-0.23px] w-[46.79px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-179.72deg]">
          <Frame3 />
        </div>
      </div>
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[16.989px] left-[36.28px] not-italic text-[10px] text-white top-[5.3px]">50%</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Frame1 />
      <Frame9 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center leading-[0] left-[97px] top-[4px] w-[186px]">
      <Group8 />
      <Group7 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-[#2b2b30] h-[71px] relative rounded-[14px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#484848] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)]" />
      <Group1 />
      <Frame />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Group_3">
      <div className="absolute inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Vector_17">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.5843 32">
          <path d={svgPaths.p1bf29600} fill="var(--fill-0, white)" id="Vector_13" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_89.51%_39.39%_8.34%]" data-name="Vector_18">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07038 8.74632">
          <path d={svgPaths.p1c35ea00} fill="var(--fill-0, white)" id="Vector_14" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_84.59%_39.39%_13.26%]" data-name="Vector_19">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07037 8.74632">
          <path d={svgPaths.p25046730} fill="var(--fill-0, white)" id="Vector_15" />
        </svg>
      </div>
      <div className="absolute flex inset-[44.24%_87.24%_35.47%_10.79%] items-center justify-center">
        <div className="flex-none h-[2.357px] rotate-[-72.81deg] w-[14.35px]">
          <div className="relative size-full" data-name="Vector_20">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3502 2.35679">
              <path d={svgPaths.p14930b40} fill="var(--fill-0, white)" id="Vector_16" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 26_3">
      <p className="col-1 css-4hzbpn font-['Poppins:SemiBold',sans-serif] h-[26.697px] leading-[26.697px] ml-0 mt-0 not-italic relative row-1 text-[11px] text-white w-[169.185px]">Alltag, Gefühle</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[#618cff] content-stretch flex flex-col items-center justify-center pb-[5px] pl-[7.281px] pr-[7px] pt-[4.854px] relative rounded-[124.989px] shrink-0 w-[88px]" data-name="Frame 26_5">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[16.989px] not-italic relative shrink-0 text-[10px] text-white">Informatik</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[88px]" data-name="Frame 28_2">
      <Frame11 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="col-1 content-stretch flex h-[27px] items-center ml-0 mt-[0.3px] relative row-1 w-[88px]" data-name="Frame 27_2">
      <Frame20 />
    </div>
  );
}

function Frame24() {
  return <div className="bg-[#009379] h-[26.992px] rounded-br-[124.989px] rounded-tr-[124.989px] w-[46.658px]" data-name="Frame 29_2" />;
}

function Frame12() {
  return (
    <div className="bg-[#919191] col-1 h-[27px] ml-[97.9px] mt-0 relative rounded-[124.989px] row-1 w-[88px]" data-name="Frame 26_6">
      <div className="absolute flex h-[27.221px] items-center justify-center left-[-0.05px] top-[-0.23px] w-[46.79px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-179.72deg]">
          <Frame24 />
        </div>
      </div>
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[16.989px] left-[36.28px] not-italic text-[10px] text-white top-[5.3px]">50%</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 87_2">
      <Frame16 />
      <Frame12 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center leading-[0] left-[97px] top-[4px] w-[186px]" data-name="Frame 26_4">
      <Group9 />
      <Group13 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="bg-[#2b2b30] h-[71px] relative rounded-[14px] shrink-0 w-full" data-name="Frame 2087325020_2">
      <div aria-hidden="true" className="absolute border border-[#484848] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)]" />
      <Group2 />
      <Frame10 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Group_4">
      <div className="absolute inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Vector_21">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.5843 32">
          <path d={svgPaths.p1bf29600} fill="var(--fill-0, white)" id="Vector_13" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_89.51%_39.39%_8.34%]" data-name="Vector_22">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07038 8.74632">
          <path d={svgPaths.p1c35ea00} fill="var(--fill-0, white)" id="Vector_14" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_84.59%_39.39%_13.26%]" data-name="Vector_23">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07037 8.74632">
          <path d={svgPaths.p25046730} fill="var(--fill-0, white)" id="Vector_15" />
        </svg>
      </div>
      <div className="absolute flex inset-[44.24%_87.24%_35.47%_10.79%] items-center justify-center">
        <div className="flex-none h-[2.357px] rotate-[-72.81deg] w-[14.35px]">
          <div className="relative size-full" data-name="Vector_24">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3502 2.35679">
              <path d={svgPaths.p14930b40} fill="var(--fill-0, white)" id="Vector_16" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group10() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 26_4">
      <p className="col-1 css-4hzbpn font-['Poppins:SemiBold',sans-serif] h-[26.697px] leading-[26.697px] ml-0 mt-0 not-italic relative row-1 text-[11px] text-white w-[169.185px]">Alltag, Gefühle</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#618cff] content-stretch flex flex-col items-center justify-center pb-[5px] pl-[7.281px] pr-[7px] pt-[4.854px] relative rounded-[124.989px] shrink-0 w-[88px]" data-name="Frame 26_8">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[16.989px] not-italic relative shrink-0 text-[10px] text-white">Informatik</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[88px]" data-name="Frame 28_3">
      <Frame14 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="col-1 content-stretch flex h-[27px] items-center ml-0 mt-[0.3px] relative row-1 w-[88px]" data-name="Frame 27_3">
      <Frame21 />
    </div>
  );
}

function Frame25() {
  return <div className="bg-[#009379] h-[26.992px] rounded-br-[124.989px] rounded-tr-[124.989px] w-[46.658px]" data-name="Frame 29_3" />;
}

function Frame15() {
  return (
    <div className="bg-[#919191] col-1 h-[27px] ml-[97.9px] mt-0 relative rounded-[124.989px] row-1 w-[88px]" data-name="Frame 26_9">
      <div className="absolute flex h-[27.221px] items-center justify-center left-[-0.05px] top-[-0.23px] w-[46.79px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-179.72deg]">
          <Frame25 />
        </div>
      </div>
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[16.989px] left-[36.28px] not-italic text-[10px] text-white top-[5.3px]">50%</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 87_3">
      <Frame17 />
      <Frame15 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center leading-[0] left-[97px] top-[4px] w-[186px]" data-name="Frame 26_7">
      <Group10 />
      <Group14 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="bg-[#2b2b30] h-[71px] relative rounded-[14px] shrink-0 w-full" data-name="Frame 2087325021_2">
      <div aria-hidden="true" className="absolute border border-[#484848] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)]" />
      <Group3 />
      <Frame13 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Group_5">
      <div className="absolute inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Vector_25">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.5843 32">
          <path d={svgPaths.p1bf29600} fill="var(--fill-0, white)" id="Vector_13" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_89.51%_39.39%_8.34%]" data-name="Vector_26">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07038 8.74632">
          <path d={svgPaths.p1c35ea00} fill="var(--fill-0, white)" id="Vector_14" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_84.59%_39.39%_13.26%]" data-name="Vector_27">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07037 8.74632">
          <path d={svgPaths.p25046730} fill="var(--fill-0, white)" id="Vector_15" />
        </svg>
      </div>
      <div className="absolute flex inset-[44.24%_87.24%_35.47%_10.79%] items-center justify-center">
        <div className="flex-none h-[2.357px] rotate-[-72.81deg] w-[14.35px]">
          <div className="relative size-full" data-name="Vector_28">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3502 2.35679">
              <path d={svgPaths.p14930b40} fill="var(--fill-0, white)" id="Vector_16" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 26_5">
      <p className="col-1 css-4hzbpn font-['Poppins:SemiBold',sans-serif] h-[26.697px] leading-[26.697px] ml-0 mt-0 not-italic relative row-1 text-[11px] text-white w-[169.185px]">Alltag, Gefühle</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-[#618cff] content-stretch flex flex-col items-center justify-center pb-[5px] pl-[7.281px] pr-[7px] pt-[4.854px] relative rounded-[124.989px] shrink-0 w-[88px]" data-name="Frame 26_11">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[16.989px] not-italic relative shrink-0 text-[10px] text-white">Informatik</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[88px]" data-name="Frame 28_4">
      <Frame31 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="col-1 content-stretch flex h-[27px] items-center ml-0 mt-[0.3px] relative row-1 w-[88px]" data-name="Frame 27_4">
      <Frame22 />
    </div>
  );
}

function Frame26() {
  return <div className="bg-[#009379] h-[26.992px] rounded-br-[124.989px] rounded-tr-[124.989px] w-[46.658px]" data-name="Frame 29_4" />;
}

function Frame32() {
  return (
    <div className="bg-[#919191] col-1 h-[27px] ml-[97.9px] mt-0 relative rounded-[124.989px] row-1 w-[88px]" data-name="Frame 26_12">
      <div className="absolute flex h-[27.221px] items-center justify-center left-[-0.05px] top-[-0.23px] w-[46.79px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-179.72deg]">
          <Frame26 />
        </div>
      </div>
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[16.989px] left-[36.28px] not-italic text-[10px] text-white top-[5.3px]">50%</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 87_4">
      <Frame18 />
      <Frame32 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center leading-[0] left-[97px] top-[4px] w-[186px]" data-name="Frame 26_10">
      <Group11 />
      <Group15 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="bg-[#2b2b30] h-[71px] relative rounded-[14px] shrink-0 w-full" data-name="Frame 2087325022_2">
      <div aria-hidden="true" className="absolute border border-[#484848] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)]" />
      <Group4 />
      <Frame30 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Group_6">
      <div className="absolute inset-[25.35%_81.59%_29.58%_5.78%]" data-name="Vector_29">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.5843 32">
          <path d={svgPaths.p1bf29600} fill="var(--fill-0, white)" id="Vector_13" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_89.51%_39.39%_8.34%]" data-name="Vector_30">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07038 8.74632">
          <path d={svgPaths.p1c35ea00} fill="var(--fill-0, white)" id="Vector_14" />
        </svg>
      </div>
      <div className="absolute inset-[48.29%_84.59%_39.39%_13.26%]" data-name="Vector_31">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07037 8.74632">
          <path d={svgPaths.p25046730} fill="var(--fill-0, white)" id="Vector_15" />
        </svg>
      </div>
      <div className="absolute flex inset-[44.24%_87.24%_35.47%_10.79%] items-center justify-center">
        <div className="flex-none h-[2.357px] rotate-[-72.81deg] w-[14.35px]">
          <div className="relative size-full" data-name="Vector_32">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3502 2.35679">
              <path d={svgPaths.p14930b40} fill="var(--fill-0, white)" id="Vector_16" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 26_6">
      <p className="col-1 css-4hzbpn font-['Poppins:SemiBold',sans-serif] h-[26.697px] leading-[26.697px] ml-0 mt-0 not-italic relative row-1 text-[11px] text-white w-[169.185px]">Alltag, Gefühle</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-[#618cff] content-stretch flex flex-col items-center justify-center pb-[5px] pl-[7.281px] pr-[7px] pt-[4.854px] relative rounded-[124.989px] shrink-0 w-[88px]" data-name="Frame 26_14">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[16.989px] not-italic relative shrink-0 text-[10px] text-white">Informatik</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[88px]" data-name="Frame 28_5">
      <Frame34 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="col-1 content-stretch flex h-[27px] items-center ml-0 mt-[0.3px] relative row-1 w-[88px]" data-name="Frame 27_5">
      <Frame23 />
    </div>
  );
}

function Frame27() {
  return <div className="bg-[#009379] h-[26.992px] rounded-br-[124.989px] rounded-tr-[124.989px] w-[46.658px]" data-name="Frame 29_5" />;
}

function Frame35() {
  return (
    <div className="bg-[#919191] col-1 h-[27px] ml-[97.9px] mt-0 relative rounded-[124.989px] row-1 w-[88px]" data-name="Frame 26_15">
      <div className="absolute flex h-[27.221px] items-center justify-center left-[-0.05px] top-[-0.23px] w-[46.79px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-179.72deg]">
          <Frame27 />
        </div>
      </div>
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[16.989px] left-[36.28px] not-italic text-[10px] text-white top-[5.3px]">50%</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0" data-name="Group 87_5">
      <Frame19 />
      <Frame35 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center leading-[0] left-[97px] top-[4px] w-[186px]" data-name="Frame 26_13">
      <Group12 />
      <Group16 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="bg-[#2b2b30] h-[71px] relative rounded-[14px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#484848] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)]" />
      <Group5 />
      <Frame33 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] items-start left-[24px] top-[237px] w-[329px]">
      <Frame41 />
      <Frame48 />
      <Frame49 />
      <Frame50 />
      <Frame46 />
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

function Frame36() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <SolarHome2Outline />
      <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center">Home</p>
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

function Frame37() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentMeetNow16Regular />
      <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center">Meetings</p>
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

function Frame38() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentChat20Regular />
      <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center">Chats</p>
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

function Frame40() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col h-[62px] items-center justify-between p-[8px] relative rounded-[100px] shrink-0">
      <FluentChat20Regular1 />
      <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-center text-white">KI-Tools</p>
    </div>
  );
}

function Frame39() {
  return (
    <div className="bg-[#24262f] content-stretch flex flex-col gap-[8.5px] h-[62px] items-center px-[8px] py-[11px] relative rounded-[100px] shrink-0">
      <div className="relative shrink-0 size-[19.5px]" data-name="Union">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 19.5">
          <path d={svgPaths.p8fa8980} fill="var(--fill-0, white)" fillOpacity="0.5" id="Union" />
        </svg>
      </div>
      <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] text-center">Profil</p>
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="absolute bg-[#24262f] h-[78px] left-0 top-[736px] w-[375px]" data-name="Navigation Bar">
      <div className="content-stretch flex gap-[7px] items-center justify-center overflow-clip p-[16px] relative rounded-[inherit] size-full">
        <Frame36 />
        <Frame37 />
        <Frame38 />
        <Frame40 />
        <Frame39 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.1px] border-[rgba(0,0,0,0.5)] border-solid inset-[-0.1px] pointer-events-none" />
    </div>
  );
}

export default function Wiederholen() {
  return (
    <div className="bg-[#0a0a0a] overflow-clip relative rounded-[50px] size-full" data-name="Wiederholen">
      <Section />
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[26px] not-italic text-[16px] text-white top-[85px]">My Flashcards</p>
      <Group18 />
      <Group6 />
      <Group22 />
      <div className="absolute css-g0mm18 flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[189px] not-italic text-[#797979] text-[14px] text-center top-[662.5px] tracking-[-0.3px] translate-x-[-50%] translate-y-[-50%]">
        <p className="css-ew64yg leading-[normal]">show more</p>
      </div>
      <div className="absolute bg-[#009379] h-[5px] left-[36px] rounded-[33px] shadow-[0px_0px_5.2px_0px_rgba(0,147,121,0.4)] top-[155px] w-[89px]" />
      <Group19 />
      <Group20 />
      <Group21 />
      <IconFilter />
      <Frame42 />
      <Frame47 />
      <NavigationBar />
    </div>
  );
}