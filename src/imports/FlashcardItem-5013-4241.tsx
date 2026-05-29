function Container1() {
  return (
    <div className="h-[14.989px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-full absolute font-['Poppins:Regular',sans-serif] leading-[15px] left-[48px] not-italic text-[10px] text-[rgba(255,255,255,0.25)] text-right top-0 w-[48px] whitespace-pre-wrap">57 Karten</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[13.499px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[13.5px] min-h-px min-w-px not-italic relative text-[9px] text-[rgba(255,255,255,0.3)] text-right whitespace-pre-wrap">05.12.</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.993px] h-[30.481px] items-start left-[170.57px] top-[12px] w-[47.114px]" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[29.998px] left-[33.99px] overflow-clip top-0 w-[163.696px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[15px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.95)] top-[-0.32px] w-[91px] whitespace-pre-wrap">Deutsch - Experimentelle Methoden 6</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[8.003px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="-translate-x-1/2 absolute bottom-0 left-1/2 top-0 w-[23.999px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9986 8.00297">
          <path d="M0 0H23.9986V8.00297H0V0Z" fill="var(--fill-0, #FFCB00)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[8.003px] items-start left-0 top-[16px] w-[23.999px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[8.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="-translate-x-1/2 absolute bottom-0 left-1/2 top-0 w-[23.999px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9986 8.01324">
          <path d="M0 0H23.9986V8.01324H0V0Z" fill="var(--fill-0, #E32D3C)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[8.013px] items-start left-0 top-[7.99px] w-[23.999px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[8.003px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="-translate-x-1/2 absolute bottom-0 left-1/2 top-0 w-[23.999px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9986 8.00297">
          <path d="M0 0H23.9986V8.00297H0V0Z" fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col h-[8.003px] items-start left-0 top-0 w-[23.999px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function SubjectIcon() {
  return (
    <div className="absolute left-0 overflow-clip rounded-[6px] size-[23.999px] top-0" data-name="SubjectIcon">
      <Container6 />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute left-0 size-[23.999px] top-[1.99px]" data-name="Container">
      <SubjectIcon />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[29.998px] relative shrink-0 w-[197.691px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading />
        <Container5 />
      </div>
    </div>
  );
}

function Container11() {
  return <div className="absolute h-[26.68px] left-0 opacity-30 top-0 w-[98.676px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 98.676 26.68\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -5.111 -5.111 0 49.338 13.34)\'><stop stop-color=\'rgba(255,107,157,0.314)\' offset=\'0\'/><stop stop-color=\'rgba(128,54,79,0.157)\' offset=\'0.35\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Text() {
  return (
    <div className="absolute content-stretch flex h-[16.499px] items-start left-[26.62px] overflow-clip top-[5.09px] w-[45.439px]" data-name="Text">
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[11px] text-white">Deutsch</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[rgba(255,107,157,0.14)] border-[0.657px] border-[rgba(255,107,157,0.25)] border-solid h-[27.995px] left-0 overflow-clip rounded-[22061900px] shadow-[0px_4px_16px_0px_rgba(255,107,157,0.13)] top-0 w-[99.991px]" data-name="Container">
      <Container11 />
      <Text />
    </div>
  );
}

function Container13() {
  return <div className="absolute h-[26.68px] left-0 opacity-40 shadow-[0px_0px_16px_0px_rgba(255,107,157,0.14)] top-0 w-[24.749px]" data-name="Container" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 107, 157, 0.25) 0%, rgba(255, 107, 157, 0.125) 100%), linear-gradient(90deg, rgba(255, 107, 157, 0.19) 0%, rgba(255, 107, 157, 0.19) 100%)" }} />;
}

function Text1() {
  return (
    <div className="absolute h-[17.999px] left-[31.91px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)] top-[4.34px] w-[24.564px]" data-name="Text">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[18px] left-0 not-italic text-[12px] text-white top-[0.66px] w-[25px] whitespace-pre-wrap">28%</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[26.68px] left-0 top-0 w-[88.392px]" data-name="Container">
      <Text1 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.03)] border-[0.657px] border-[rgba(255,255,255,0.08)] border-solid h-[27.995px] left-[107.98px] overflow-clip rounded-[22061900px] top-0 w-[89.707px]" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[197.691px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container10 />
        <Container12 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[66.685px] items-start justify-between left-[16px] top-[16px] w-[197.691px]" data-name="Container">
      <Container4 />
      <Container9 />
    </div>
  );
}

export default function FlashcardItem() {
  return (
    <div className="border-[0.657px] border-[rgba(255,255,255,0.08)] border-solid overflow-clip relative rounded-[16px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] size-full" data-name="FlashcardItem" style={{ backgroundImage: "linear-gradient(156.594deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)" }}>
      <Container />
      <Container3 />
    </div>
  );
}