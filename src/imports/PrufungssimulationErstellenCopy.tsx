import svgPaths from "./svg-6w4ngzlyfx";

function Heading() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[22.5px] left-0 not-italic text-[15px] text-white top-[0.64px]">Prüfungssimulation</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[15.6px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[19.5px] left-0 not-italic text-[#979797] text-[13px] top-[1.32px]">Wähle ein Fach</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[36.8px] relative shrink-0 w-[120.195px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.2px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[8.4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.4 8.4">
        <g clipPath="url(#clip0_6_2239)" id="Icon">
          <path d="M0.6 0.6L7.8 7.8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
          <path d="M7.8 0.6L0.6 7.8" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
        </g>
        <defs>
          <clipPath id="clip0_6_2239">
            <rect fill="white" height="8.4" width="8.4" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative rounded-[30px] shrink-0 size-[33.6px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[0.8px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex h-[36.8px] items-center justify-between left-[19.2px] top-[25.6px] w-[305.6px]" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[6.4px] relative shrink-0 w-[13.6px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.6 6.4">
        <g clipPath="url(#clip0_6_2273)" id="Icon">
          <path d="M1.07368 0.505261H12.5263" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.01053" />
          <path d="M3.81235 5.89474H9.78765" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.01053" />
          <path d="M2.31853 3.2H11.2815" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.01053" />
        </g>
        <defs>
          <clipPath id="clip0_6_2273">
            <rect fill="white" height="6.4" width="13.6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16.8px] relative shrink-0 w-[38.565px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-white top-[0.32px]">Fächer</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#2b2b30] h-[28.8px] relative rounded-[8px] shrink-0 w-[144px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6.4px] items-center pl-[10.24px] pr-[0.8px] py-[0.8px] relative size-full">
        <Icon1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[12.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8 12.8">
        <g id="Icon">
          <path d={svgPaths.p23f68ff0} id="Vector" stroke="var(--stroke-0, #707070)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          <path d="M11.2 11.2L8.87998 8.88" id="Vector_2" stroke="var(--stroke-0, #707070)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[1_0_0] h-[16.8px] min-h-px min-w-px relative" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#707070] text-[14px]">Suchen...</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#2b2b30] flex-[1_0_0] h-[28.8px] min-h-px min-w-px relative rounded-[8px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6.4px] items-center px-[10.24px] py-[0.8px] relative size-full">
          <Icon2 />
          <TextInput />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex gap-[9.6px] h-[28.8px] items-start left-0 px-[19.2px] top-[84.8px] w-[344px]" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function SubjectIcon() {
  return (
    <div className="relative shrink-0 size-[19.2px]" data-name="SubjectIcon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <g id="SubjectIcon">
          <path d={svgPaths.p3881dd00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[9.44px] size-[19.2px] top-[12.64px]" data-name="Container">
      <SubjectIcon />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-[41.44px] top-[13.04px] w-[237.12px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[23px] min-h-px min-w-px not-italic relative text-[16px] text-white">Mathematik</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute h-[8.8px] left-[291.36px] top-[17.84px] w-[4.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 8.8">
        <g clipPath="url(#clip0_6_2278)" id="Icon">
          <path d="M0.8 0.8L4 4.4L0.8 8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
        </g>
        <defs>
          <clipPath id="clip0_6_2278">
            <rect fill="white" height="8.8" width="4.8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SubjectSelection() {
  return (
    <div className="bg-[#2b2b30] h-[44.48px] relative rounded-[8px] shrink-0 w-full" data-name="SubjectSelection">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container6 />
      <Paragraph2 />
      <Icon3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[19.2px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[66.66%_0_0_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 6.40065">
          <path d="M0 0H19.2V6.40065H0V0Z" fill="var(--fill-0, #FFCB00)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[33.33%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 6.40065">
          <path d="M0 0H19.2V6.40065H0V0Z" fill="var(--fill-0, #E32D3C)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_0_66.66%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 6.40065">
          <path d="M0 0H19.2V6.40065H0V0Z" fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function SubjectIcon1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[9.44px] overflow-clip size-[19.2px] top-[12.64px]" data-name="SubjectIcon">
      <Icon4 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-[41.44px] top-[13.04px] w-[237.12px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[23px] min-h-px min-w-px not-italic relative text-[16px] text-white">Deutsch</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute h-[8.8px] left-[291.36px] top-[17.84px] w-[4.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 8.8">
        <g clipPath="url(#clip0_6_2278)" id="Icon">
          <path d="M0.8 0.8L4 4.4L0.8 8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
        </g>
        <defs>
          <clipPath id="clip0_6_2278">
            <rect fill="white" height="8.8" width="4.8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SubjectSelection1() {
  return (
    <div className="bg-[#2b2b30] h-[44.48px] relative rounded-[8px] shrink-0 w-full" data-name="SubjectSelection">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SubjectIcon1 />
      <Paragraph3 />
      <Icon5 />
    </div>
  );
}

function SubjectIcon2() {
  return (
    <div className="relative shrink-0 size-[19.2px]" data-name="SubjectIcon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <g clipPath="url(#clip0_6_2252)" id="SubjectIcon">
          <path d={svgPaths.p2517c2e0} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_6_2252">
            <rect fill="white" height="19.2" width="19.2" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[9.44px] size-[19.2px] top-[12.64px]" data-name="Container">
      <SubjectIcon2 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-[41.44px] top-[13.04px] w-[237.12px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[23px] min-h-px min-w-px not-italic relative text-[16px] text-white">Biologie</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute h-[8.8px] left-[291.36px] top-[17.84px] w-[4.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 8.8">
        <g clipPath="url(#clip0_6_2278)" id="Icon">
          <path d="M0.8 0.8L4 4.4L0.8 8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
        </g>
        <defs>
          <clipPath id="clip0_6_2278">
            <rect fill="white" height="8.8" width="4.8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SubjectSelection2() {
  return (
    <div className="bg-[#2b2b30] h-[44.48px] relative rounded-[8px] shrink-0 w-full" data-name="SubjectSelection">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container7 />
      <Paragraph4 />
      <Icon6 />
    </div>
  );
}

function SubjectIcon3() {
  return (
    <div className="relative shrink-0 size-[19.2px]" data-name="SubjectIcon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <g id="SubjectIcon">
          <path d={svgPaths.pf40f100} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[9.44px] size-[19.2px] top-[12.64px]" data-name="Container">
      <SubjectIcon3 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-[41.44px] top-[13.04px] w-[237.12px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[23px] min-h-px min-w-px not-italic relative text-[16px] text-white">Geschichte</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute h-[8.8px] left-[291.36px] top-[17.84px] w-[4.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 8.8">
        <g clipPath="url(#clip0_6_2278)" id="Icon">
          <path d="M0.8 0.8L4 4.4L0.8 8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
        </g>
        <defs>
          <clipPath id="clip0_6_2278">
            <rect fill="white" height="8.8" width="4.8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SubjectSelection3() {
  return (
    <div className="bg-[#2b2b30] h-[44.48px] relative rounded-[8px] shrink-0 w-full" data-name="SubjectSelection">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container8 />
      <Paragraph5 />
      <Icon7 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[19.2px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <path d="M0 0H19.2V19.2H0V0Z" fill="var(--fill-0, #012169)" id="Vector" />
      </svg>
      <div className="absolute inset-[-5.77%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.417 21.417">
          <path d={svgPaths.p3c441de0} id="Vector" stroke="var(--stroke-0, white)" strokeWidth="3.13535" />
        </svg>
      </div>
      <div className="absolute inset-[-3.61%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.5856 20.5856">
          <path d={svgPaths.p30cee240} id="Vector" stroke="var(--stroke-0, #C8102E)" strokeWidth="1.95959" />
        </svg>
      </div>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <path d="M9.6 0V19.2M0 9.6H19.2" id="Vector" stroke="var(--stroke-0, white)" strokeWidth="5.22525" />
      </svg>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <path d="M9.6 0V19.2M0 9.6H19.2" id="Vector" stroke="var(--stroke-0, #C8102E)" strokeWidth="3.13535" />
      </svg>
    </div>
  );
}

function SubjectIcon4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[9.44px] overflow-clip size-[19.2px] top-[12.64px]" data-name="SubjectIcon">
      <Icon8 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-[41.44px] top-[13.04px] w-[237.12px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[23px] min-h-px min-w-px not-italic relative text-[16px] text-white">Englisch</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute h-[8.8px] left-[291.36px] top-[17.84px] w-[4.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 8.8">
        <g clipPath="url(#clip0_6_2278)" id="Icon">
          <path d="M0.8 0.8L4 4.4L0.8 8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
        </g>
        <defs>
          <clipPath id="clip0_6_2278">
            <rect fill="white" height="8.8" width="4.8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SubjectSelection4() {
  return (
    <div className="bg-[#2b2b30] h-[44.48px] relative rounded-[8px] shrink-0 w-full" data-name="SubjectSelection">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SubjectIcon4 />
      <Paragraph6 />
      <Icon9 />
    </div>
  );
}

function SubjectIcon5() {
  return (
    <div className="relative shrink-0 size-[19.2px]" data-name="SubjectIcon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <g id="SubjectIcon">
          <path d={svgPaths.p2b174200} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[9.44px] size-[19.2px] top-[12.64px]" data-name="Container">
      <SubjectIcon5 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-[41.44px] top-[13.04px] w-[237.12px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[23px] min-h-px min-w-px not-italic relative text-[16px] text-white">Chemie</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute h-[8.8px] left-[291.36px] top-[17.84px] w-[4.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 8.8">
        <g clipPath="url(#clip0_6_2278)" id="Icon">
          <path d="M0.8 0.8L4 4.4L0.8 8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
        </g>
        <defs>
          <clipPath id="clip0_6_2278">
            <rect fill="white" height="8.8" width="4.8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SubjectSelection5() {
  return (
    <div className="bg-[#2b2b30] h-[44.48px] relative rounded-[8px] shrink-0 w-full" data-name="SubjectSelection">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container9 />
      <Paragraph7 />
      <Icon10 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="h-[19.2px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[0_0_0_66.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 19.2">
          <path d="M0 0H6.4V19.2H0V0Z" fill="var(--fill-0, #E32D3C)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_33.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 19.2">
          <path d="M0 0H6.4V19.2H0V0Z" fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_66.67%_0_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 19.2">
          <path d="M0 0H6.4V19.2H0V0Z" fill="var(--fill-0, #2B4896)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function SubjectIcon6() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[9.44px] overflow-clip size-[19.2px] top-[12.64px]" data-name="SubjectIcon">
      <Icon11 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-[41.44px] top-[13.04px] w-[237.12px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[23px] min-h-px min-w-px not-italic relative text-[16px] text-white">Französisch</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute h-[8.8px] left-[291.36px] top-[17.84px] w-[4.8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 8.8">
        <g clipPath="url(#clip0_6_2278)" id="Icon">
          <path d="M0.8 0.8L4 4.4L0.8 8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.2" />
        </g>
        <defs>
          <clipPath id="clip0_6_2278">
            <rect fill="white" height="8.8" width="4.8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SubjectSelection6() {
  return (
    <div className="bg-[#2b2b30] h-[44.48px] relative rounded-[8px] shrink-0 w-full" data-name="SubjectSelection">
      <div aria-hidden="true" className="absolute border-[#484848] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SubjectIcon6 />
      <Paragraph8 />
      <Icon12 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[9.6px] h-[368.96px] items-start relative shrink-0 w-full" data-name="Container">
      <SubjectSelection />
      <SubjectSelection1 />
      <SubjectSelection2 />
      <SubjectSelection3 />
      <SubjectSelection4 />
      <SubjectSelection5 />
      <SubjectSelection6 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col h-[449.6px] items-start left-0 overflow-clip px-[19.2px] top-[132.8px] w-[344px]" data-name="Container">
      <Container10 />
    </div>
  );
}

function SubjectSelection7() {
  return (
    <div className="absolute bg-[#0a0a0a] h-[582.4px] left-[444px] overflow-clip top-[72.8px] w-[344px]" data-name="SubjectSelection">
      <Container2 />
      <Container5 />
      <Container11 />
    </div>
  );
}

export default function PrufungssimulationErstellenCopy() {
  return (
    <div className="bg-[#1a1c24] relative size-full" data-name="Prüfungssimulation erstellen (Copy)">
      <SubjectSelection7 />
    </div>
  );
}