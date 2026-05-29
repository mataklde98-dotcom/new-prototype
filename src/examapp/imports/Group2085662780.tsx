import svgPaths from "./svg-mdpu6stasl";

function Frame() {
  return <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid h-[314px] left-0 rounded-[8px] top-0 w-[361px]" />;
}

function Section() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Section 5">
      <Frame />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <Section />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[51.516px] leading-[normal] left-[21.68px] not-italic text-[#e74c3c] text-[14px] top-[17.7px] w-[95.399px]">Almost.</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[51.516px] leading-[normal] left-[349.07px] not-italic text-[#a1a1a1] text-[14px] text-right top-[17.7px] translate-x-[-100%] w-[194.051px]">Hide Solution</p>
      <div className="absolute font-['Poppins:SemiBold',sans-serif] h-[156px] leading-[20px] left-[23.85px] not-italic right-[13.01px] text-[#969696] text-[12px] top-[67px]">
        <p className="mb-0">Um die Lösung der quadratischen Gleichung 2x^2 - 4x - 6 = 0 zu finden, verwenden wir die quadratische Lösungsformel (auch bekannt als Mitternachtsformel):</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">{`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`}</p>
        <p>&nbsp;</p>
      </div>
      <div className="absolute bg-white bottom-[304px] h-[5px] left-[45.15%] right-[44.32%] rounded-[5px]" data-name="Home Indicator" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative size-[44px]">
      <div className="absolute inset-[-10.45%_-15%_-19.55%_-15%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.2 57.2">
          <g filter="url(#filter0_d_4_1732)" id="Frame 2087325020">
            <rect fill="var(--fill-0, #2B2B30)" height="44" rx="22" shapeRendering="crispEdges" width="44" x="6.6" y="4.6" />
            <rect height="43" rx="21.5" shapeRendering="crispEdges" stroke="var(--stroke-0, #484848)" width="43" x="7.1" y="5.1" />
            <path d={svgPaths.p9e77600} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57.2" id="filter0_d_4_1732" width="57.2" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="3.3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_1732" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_4_1732" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Btn() {
  return (
    <div className="absolute bg-[#009379] h-[46px] left-[71px] rounded-[12px] top-[239px] w-[221px]" data-name="Btn">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[144px] py-[13px] relative size-full">
          <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.3px]">
            <p className="leading-[normal]">next</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[71px] top-[239px]">
      <Btn />
    </div>
  );
}

export default function Group2() {
  return (
    <div className="relative size-full">
      <Group />
      <div className="absolute flex items-center justify-center left-[14px] size-[44px] top-[240px]">
        <div className="flex-none rotate-[180deg]">
          <Frame1 />
        </div>
      </div>
      <Group1 />
    </div>
  );
}