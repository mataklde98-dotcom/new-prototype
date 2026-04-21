import { imgBlur } from "./svg-oh8t9";

export default function ButtonGroup({ className }: { className?: string }) {
  return (
    <div className={className || "content-stretch flex items-start relative"} data-name="Button Group 1">
      <div className="content-stretch flex gap-[12px] h-[44px] items-center px-[4px] relative rounded-[296px] shrink-0" data-name="Button Group 1">
        <div aria-hidden="true" className="absolute bg-white inset-0 mix-blend-multiply pointer-events-none rounded-[296px]" />
        <div className="-translate-y-1/2 absolute h-[44px] left-0 right-0 top-1/2" data-name="BG">
          <div className="absolute inset-[-26px] opacity-67" data-name="Blur">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute blur-[10px] left-1/2 mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-76px_-76px] mask-size-[200px_200px] rounded-[1000px] size-[48px] top-1/2" style={{ maskImage: `url('${imgBlur}')` }} data-name="Blur">
              <div aria-hidden="true" className="absolute backdrop-blur-[20px] bg-[rgba(0,0,0,0.04)] inset-0 mix-blend-hard-light pointer-events-none rounded-[1000px]" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-[296px]" data-name="Fill">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[296px]">
              <div className="absolute bg-[#333] inset-0 mix-blend-color-dodge rounded-[296px]" />
              <div className="absolute inset-0 rounded-[296px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(247, 247, 247) 0%, rgb(247, 247, 247) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)" }} />
            </div>
          </div>
          <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[296px]" data-name="Glass Effect" />
        </div>
        <div className="content-stretch flex flex-col items-start relative rounded-[100px] shrink-0 size-[36px]" data-name="Symbol 1">
          <div className="flex flex-[1_0_0] flex-col font-['SF_Pro:Medium',sans-serif] font-[510] justify-center leading-[0] min-h-px min-w-px relative text-[#1a1a1a] text-[17px] text-center w-full" style={{ fontVariationSettings: "'wdth' 100", fontFeatureSettings: "'ss16'" }}>
            <p className="leading-[normal]">{`\u{100360}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}