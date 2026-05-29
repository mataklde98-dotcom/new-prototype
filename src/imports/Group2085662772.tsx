import svgPaths from "./svg-8h67pwha64";

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <p className="col-1 css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] ml-[26px] mt-0 not-italic relative row-1 text-[20px] text-white">Repeat</p>
      <div className="col-1 ml-0 mt-[6px] relative row-1 size-[18px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p27acbc00} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <p className="col-1 css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] ml-[20px] mt-0 not-italic relative row-1 text-[#009379] text-[20px]">Manual</p>
      <div className="col-1 h-[14px] ml-0 mt-[8px] relative row-1 w-[15px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
          <path d={svgPaths.p2960ca00} fill="var(--fill-0, #009379)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <p className="col-1 css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] ml-[26px] mt-0 not-italic relative row-1 text-[20px] text-white">Prognosis</p>
      <div className="col-1 ml-0 mt-[6px] relative row-1 size-[20px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p5c8dc00} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[294px] inset-[0_0_18.92%_0] items-center">
      <Frame />
      <Group1 />
      <Group2 />
    </div>
  );
}

export default function Group3() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-[#009379] inset-[86.49%_45.33%_0_42.48%] rounded-[33px] shadow-[0px_0px_5.2px_0px_rgba(0,147,121,0.4)]" />
      <Frame1 />
    </div>
  );
}