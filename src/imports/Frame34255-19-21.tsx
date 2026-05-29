import svgPaths from "./svg-0jy35clf3y";

function Group() {
  return (
    <div className="absolute inset-[calc(25.35%-1px)_calc(81.59%-1px)_calc(29.58%-1px)_calc(5.78%-1px)]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.5843 32">
        <g id="Group">
          <path d={svgPaths.p1bf29600} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p1ee25900} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p1684cc80} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p305987f0} fill="var(--fill-0, white)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <p className="col-1 css-4hzbpn font-['Poppins:SemiBold',sans-serif] h-[26.697px] leading-[26.697px] ml-0 mt-0 not-italic relative row-1 text-[11px] text-white w-[169.185px]">Alltag, Gefühle</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#618cff] content-stretch flex flex-col items-center justify-center pb-[5px] pl-[7.281px] pr-[7px] pt-[4.854px] relative rounded-[124.989px] shrink-0 w-[88px]">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[16.989px] not-italic relative shrink-0 text-[10px] text-white">Informatik</p>
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
    <div className="col-1 content-stretch flex h-[27px] items-center ml-0 mt-[0.3px] relative row-1 w-[88px]">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return <div className="bg-[#009379] h-[26.992px] rounded-br-[124.989px] rounded-tr-[124.989px] w-[46.658px]" />;
}

function Frame4() {
  return (
    <div className="bg-[#919191] col-1 h-[27px] ml-[97.9px] mt-0 relative rounded-[124.989px] row-1 w-[88px]">
      <div className="absolute flex h-[27.221px] items-center justify-center left-[-0.05px] top-[-0.23px] w-[46.79px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-179.72deg]">
          <Frame3 />
        </div>
      </div>
      <p className="absolute css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[16.989px] left-[36.28px] not-italic text-[10px] text-white top-[5.3px]">50%</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <Frame1 />
      <Frame4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center leading-[0] left-[96px] top-[3px] w-[186px]">
      <Group1 />
      <Group2 />
    </div>
  );
}

export default function Frame6() {
  return (
    <div className="bg-[#2b2b30] border border-[#484848] border-solid relative rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)] size-full">
      <Group />
      <Frame5 />
    </div>
  );
}