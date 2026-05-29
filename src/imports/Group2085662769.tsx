import svgPaths from "./svg-nek1xepdf4";

function Frame4() {
  return (
    <div className="absolute bg-[#236b2c] content-stretch flex h-[23px] items-center justify-center left-[238px] overflow-clip px-[12px] py-[6px] rounded-[24px] top-[24px] w-[74px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-white">Join</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex h-[23px] items-center justify-center left-[182px] overflow-clip px-[12px] py-[6px] rounded-[24px] top-[24px] w-[49px]">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#737373] text-[10px]">14:00 Uhr</p>
    </div>
  );
}

function Task() {
  return (
    <div className="absolute contents left-[53px] right-[115px] top-[9px]" data-name="Task">
      <div className="absolute font-['Baloo_Bhai_2:Medium',sans-serif] font-medium h-[19px] leading-[10.7px] left-[53px] not-italic right-[115px] text-[0px] text-[9px] text-white top-[9px] whitespace-pre-wrap">
        <p className="font-['Poppins:Bold',sans-serif] mb-0">Individual Lesson</p>
        <p className="font-['Poppins:Medium',sans-serif]">Tutoring</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[53px] right-[115px] top-[9px]">
      <Task />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#2b2c34] h-[70px] left-0 rounded-[10px] shadow-[0px_4px_15.6px_0px_rgba(0,0,0,0.03)] top-0 w-[327px]" />
      <Frame4 />
      <Frame3 />
      <div className="absolute bg-[#47218c] h-[70px] left-0 rounded-bl-[10px] rounded-tl-[10px] top-0 w-[10px]" />
      <Group1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[17.14%_86.05%_59.7%_6.73%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.6276 16.2114">
        <g id="Group">
          <path d={svgPaths.p19cdf700} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p360e5cc0} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p1c749300} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p6a87b00} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p1244e100} fill="var(--fill-0, white)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#47218c] content-stretch flex flex-col items-center justify-center pb-[5px] pl-[7.281px] pr-[7px] pt-[4.854px] relative rounded-[124.989px] shrink-0 w-[88px]">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[16.989px] not-italic relative shrink-0 text-[10px] text-white">Englisch</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[88px]">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex h-[27px] items-center left-[22px] top-[36px] w-[88px]">
      <Frame2 />
    </div>
  );
}

export default function Group3() {
  return (
    <div className="relative size-full">
      <Group2 />
      <Group />
      <Frame1 />
    </div>
  );
}