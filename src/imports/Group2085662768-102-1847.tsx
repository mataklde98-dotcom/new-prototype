import svgPaths from "./svg-iip2b67xs4";
import imgEllipse2 from "figma:asset/11a2b9c104f9ad331556dffc2e3e770195913d21.png";
import imgInformation3 from "figma:asset/e51112c4419b0e3840e36fc1512cdd56c4bab645.png";

function Name() {
  return (
    <div className="absolute contents left-[77px] top-[2px]" data-name="Name">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[1.4] left-[77px] not-italic text-[16px] text-white top-[2px]">Hallo, Sam!</p>
    </div>
  );
}

function Profile() {
  return (
    <div className="absolute contents left-[77px] top-[2px]" data-name="Profile">
      <Name />
    </div>
  );
}

function IconFillNotifications() {
  return (
    <div className="absolute left-[315px] size-[24px] top-[12.5px]" data-name="Icon / Fill / notifications">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon / Fill / notifications">
          <path clipRule="evenodd" d={svgPaths.p1bb0ef00} fill="var(--fill-0, white)" fillRule="evenodd" id="notification / notification" />
          <circle cx="17" cy="5" fill="var(--fill-0, #009379)" id="Ellipse 3" r="3.75" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[339px]">
      <Profile />
      <IconFillNotifications />
      <p className="-translate-x-full absolute bottom-[20px] font-['Montserrat:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%+95.5px)] text-[12px] text-right text-white translate-y-full">25%</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#202237] h-[8px] left-[77px] rounded-[40px] top-[49px] w-[188px]" data-name="Progress Container">
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_5px_15px_0px_rgba(164,164,164,0.3)]" />
      </div>
      <div className="absolute inset-[85.96%_58.11%_0_22.71%]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 65 8">
          <path d={svgPaths.pd333100} fill="var(--fill-0, #40B621)" id="Rectangle" />
        </svg>
      </div>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-92.5px)] text-[#888ca4] text-[13px] top-[24px]">Knowledge level</p>
      <Frame />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group />
      <div className="absolute left-[20px] size-[45px] top-[9px]">
        <img alt="" className="block max-w-none size-full" height="45" src={imgEllipse2} width="45" />
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group2 />
    </div>
  );
}

export default function Group3() {
  return (
    <div className="relative size-full">
      <div className="absolute left-[190px] size-[15px] top-[25px]" data-name="information 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgInformation3} />
      </div>
      <Group1 />
    </div>
  );
}