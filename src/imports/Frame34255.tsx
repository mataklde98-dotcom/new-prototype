import svgPaths from "./svg-dxnamdhtks";

function Group() {
  return (
    <div className="w-[40px] h-[32px] shrink-0" data-name="Group">
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
    <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white leading-tight">
      Alltag, Gefühle
    </p>
  );
}

function Frame() {
  return (
    <div className="bg-[#618cff] flex items-center justify-center px-2 py-1 rounded-full shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white">Informatik</p>
    </div>
  );
}

function Frame3() {
  return <div className="bg-[#009379] h-[27px] rounded-br-full rounded-tr-full w-[47px]" />;
}

function Frame4() {
  return (
    <div className="bg-[#919191] h-[27px] relative rounded-full w-[88px] shrink-0">
      <div className="absolute flex h-[27px] items-center justify-center left-0 top-0 w-[47px]">
        <div className="flex-none rotate-[-179.72deg]">
          <Frame3 />
        </div>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] text-[10px] text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">50%</p>
    </div>
  );
}

export default function Frame6() {
  return (
    <div className="bg-[#2b2b30] border border-[#484848] border-solid rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)] size-full flex items-center gap-4 px-5 py-3">
      <Group />
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <Group1 />
        <div className="flex items-center gap-3">
          <Frame />
          <Frame4 />
        </div>
      </div>
    </div>
  );
}
