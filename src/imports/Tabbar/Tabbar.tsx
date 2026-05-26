import svgPaths from "./svg-zzlu2krfds";
import imgFrame2147229225 from "./11f2cba78544b625c5eb2fd44f01e7f071e6d476.png";

function Frame() {
  return (
    <div className="pointer-events-none relative rounded-[100px] shrink-0 size-[44px]">
      <div className="absolute inset-0 overflow-hidden rounded-[100px]">
        <img alt="" className="absolute h-[179%] left-[-10.02%] max-w-none top-[-9.12%] w-[119.33%]" src={imgFrame2147229225} />
      </div>
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function TabbarItem() {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] content-stretch flex items-center justify-center p-[10px] relative rounded-[100px] shrink-0 size-[48px]" data-name="tabbar item">
      <Frame />
    </div>
  );
}

export default function Tabbar() {
  return (
    <div className="bg-[rgba(161,173,152,0.1)] content-stretch flex gap-[4px] items-center p-[4px] relative rounded-[9999px] size-full" data-name="tabbar">
      <div className="bg-[rgba(255,255,255,0.04)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-name="tabbar item">
        <div className="relative shrink-0 size-[20px]" data-name="home-dash">
          <div className="absolute inset-[9.38%_9.37%_9.38%_9.38%]" data-name="home-dash">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.2512 16.2483">
              <path d={svgPaths.p2576dd00} fill="var(--fill-0, #71717A)" id="home-dash" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(161,173,152,0.5)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-name="tabbar item">
        <div className="relative shrink-0 size-[20px]" data-name="books">
          <div className="absolute inset-[12.49%_8.35%_12.49%_8.33%]" data-name="books">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6633 15.0027">
              <path d={svgPaths.p9cf1280} fill="var(--fill-0, #18181B)" id="books" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0.04)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-name="tabbar item">
        <div className="relative shrink-0 size-[20px]" data-name="graduation-cap">
          <div className="absolute inset-[13.53%_9.38%]" data-name="graduation-cap">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.25 14.5875">
              <path d={svgPaths.p1384ed80} fill="var(--fill-0, #71717A)" id="graduation-cap" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0.04)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-name="tabbar item">
        <div className="relative shrink-0 size-[20px]" data-name="chart-bar-alt">
          <div className="absolute inset-[9.38%]" data-name="chart-bar-alt">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.25 16.25">
              <path d={svgPaths.p32ad5680} fill="var(--fill-0, #71717A)" id="chart-bar-alt" />
            </svg>
          </div>
        </div>
      </div>
      <TabbarItem />
    </div>
  );
}