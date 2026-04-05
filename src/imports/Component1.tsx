import svgPaths from "./svg-6m53lltw4l";

export default function Component({ className }: { className?: string }) {
  return (
    <div className={className || "h-[566px] relative w-[329px]"} data-name="Component 1">
      <div className="absolute bg-[#2b2b30] border border-[#484848] border-solid inset-[0_0_9.01%_0] rounded-[14px] shadow-[0px_2px_6.6px_0px_rgba(0,0,0,0.09)]">
        <p className="absolute font-['Poppins:Medium',sans-serif] h-[105px] leading-[26.697px] left-[30px] not-italic right-[29px] text-[13px] text-center text-white top-[186px] whitespace-pre-wrap">“How does regular physical exercise affect mental health?”</p>
        <div className="absolute contents left-[79px] right-[78.82px] top-[6px]">
          <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[26.697px] leading-[26.697px] left-[80px] not-italic right-[79.82px] text-[#888] text-[11px] text-center top-[7px] whitespace-pre-wrap">Tap to flip</p>
        </div>
      </div>
      <div className="absolute inset-[81.27%_33.74%_0_34.04%]">
        <div className="absolute inset-[-4.34%_-6.23%_-8.11%_-6.23%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 119.2 119.2">
            <g filter="url(#filter0_d_5007_3062)" id="Frame 2087325020">
              <rect fill="var(--fill-0, #009379)" height="106" rx="53" shapeRendering="crispEdges" width="106" x="6.6" y="4.6" />
              <rect height="89" rx="44.5" shapeRendering="crispEdges" stroke="var(--stroke-0, #0a0a0a)" strokeWidth="17" width="89" x="15.1" y="13.1" />
              <path d={svgPaths.p31ce0500} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="119.2" id="filter0_d_5007_3062" width="119.2" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="3.3" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_5007_3062" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_5007_3062" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}