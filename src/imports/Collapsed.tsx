import svgPaths from "./svg-oek003d4wu";
import imgAvatar from "figma:asset/2327c42282ec79530a1b3980a446bd44de9918c8.png";
import imgAvatar1 from "figma:asset/24c561561440c52b7db7866898da16ac1fea6ab0.png";

function Collapse() {
  return (
    <div className="absolute h-[93px] right-[-27px] top-[calc(50%-415.5px)] translate-y-[-50%] w-[52px]" data-name="Collapse 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 93">
        <g filter="url(#filter0_ii_42_1622)" id="Collapse 1">
          <rect fill="var(--fill-0, black)" fillOpacity="0.01" height="93" rx="26" width="52" />
          <g filter="url(#filter1_i_42_1622)" id="Vector">
            <path d={svgPaths.p1b3abe40} stroke="var(--stroke-0, #5A657D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="97" id="filter0_ii_42_1622" width="52" x="0" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="0.3" dy="-1" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.336806 0 0 0 0 0.36875 0 0 0 0 0.416667 0 0 0 0.6 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_42_1622" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="11.5" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0699653 0 0 0 0 0.0911086 0 0 0 0 0.129167 0 0 0 1 0" />
            <feBlend in2="effect1_innerShadow_42_1622" mode="normal" result="effect2_innerShadow_42_1622" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="14" id="filter1_i_42_1622" width="8" x="9.58301" y="51.8848">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dx="0.5" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_42_1622" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function SolarHome2Outline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="solar:home-2-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="solar:home-2-outline">
          <path d={svgPaths.p2833c480} fill="var(--fill-0, white)" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p7306a20} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col items-center justify-center relative rounded-[73.023px] shrink-0 size-[35.051px]">
      <SolarHome2Outline />
    </div>
  );
}

function MenuItem() {
  return (
    <div className="bg-[rgba(159,174,195,0.11)] content-stretch flex items-center justify-center relative rounded-[9px] shrink-0 size-[40px]" data-name="Menu item">
      <Frame />
    </div>
  );
}

function Group2() {
  return (
    <div className="relative shrink-0 size-[35.051px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0509 35.0509">
        <g id="Group 139">
          <g id="Frame 1"></g>
          <path d={svgPaths.p3fb9e680} fill="var(--fill-0, white)" fillOpacity="0.5" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]">
      <Group2 />
    </div>
  );
}

function Frame1() {
  return <div className="bg-[rgba(255,255,255,0)] col-1 ml-0 mt-0 rounded-[73.023px] row-1 size-[35.051px]" />;
}

function FluentChat20Regular() {
  return (
    <div className="col-1 ml-[5.05px] mt-[5.14px] relative row-1 size-[24px]" data-name="fluent:chat-20-regular">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="fluent:chat-20-regular" opacity="0.5">
          <path d={svgPaths.p14867580} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Frame1 />
      <FluentChat20Regular />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]">
      <Group3 />
    </div>
  );
}

function Frame2() {
  return <div className="bg-[rgba(255,255,255,0)] col-1 ml-0 mt-0 rounded-[73.023px] row-1 size-[35.051px]" />;
}

function Group() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Group">
      <div className="absolute inset-[-2.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <g id="Group">
            <path d={svgPaths.p2cbbee00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p1a9d2600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p21794800} fill="var(--fill-0, white)" id="Vector_3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function FluentChat20Regular1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center opacity-50 overflow-clip p-[2px] relative shrink-0 size-[24px]" data-name="fluent:chat-20-regular">
      <Group />
    </div>
  );
}

function FluentChat20Regular2() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-center ml-[5.05px] mt-[5.14px] overflow-clip p-[2px] relative row-1 size-[24px]" data-name="fluent:chat-20-regular">
      <FluentChat20Regular1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Frame2 />
      <FluentChat20Regular2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[rgba(159,174,195,0.05)] content-stretch flex items-center justify-center relative rounded-[9px] shrink-0 size-[40px]">
      <Group1 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-center justify-center left-[15px] right-[14px] top-[116.38px]">
      <MenuItem />
      <Frame6 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 size-[35.051px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0509 35.0509">
        <g id="Frame 1">
          <path d={svgPaths.p1512c00} id="Vector" opacity="0.42" stroke="var(--stroke-0, #9FAEC4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[calc(50%+0.5px)] size-[40px] top-[422.27px] translate-x-[-50%]">
      <Frame3 />
    </div>
  );
}

function Menu() {
  return (
    <div className="absolute contents left-[14px] top-[115.38px]" data-name="Menu">
      <Frame8 />
      <Frame7 />
    </div>
  );
}

function IconFillNotifications() {
  return (
    <div className="absolute left-[26px] size-[24px] top-[73px]" data-name="Icon / Fill / notifications">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon / Fill / notifications">
          <path clipRule="evenodd" d={svgPaths.p1bb0ef00} fill="var(--fill-0, white)" fillRule="evenodd" id="notification / notification" />
          <circle cx="17" cy="5" fill="var(--fill-0, #009379)" id="Ellipse 3" r="3.75" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Avatar() {
  return (
    <div className="absolute inset-0 rounded-[64px]" data-name="Avatar">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[64px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[64px] size-full" src={imgAvatar} />
        <img alt="" className="absolute max-w-none object-cover rounded-[64px] size-full" src={imgAvatar1} />
      </div>
    </div>
  );
}

function WBadge() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="wBadge">
      <Avatar />
    </div>
  );
}

function Avatar1() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[23px] size-[32px] top-[7px]" data-name="Avatar">
      <WBadge />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[23px] top-[7px]">
      <Avatar1 />
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[rgba(40,47,58,0.43)] bottom-[-1px] h-[65px] left-[-1px] right-[-1px]" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[rgba(98,119,151,0.3)] border-solid border-t-[0.5px] inset-[-0.5px_0_0_0] pointer-events-none" />
      <Group4 />
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[11.547px] left-[27.5px] not-italic text-[10px] text-white top-[42px] tracking-[-0.2px]">Sam</p>
    </div>
  );
}

export default function Collapsed() {
  return (
    <div className="bg-[#13171e] border border-[#2c323c] border-solid overflow-clip relative rounded-[10px] shadow-[0px_24px_24px_-10px_rgba(20,24,30,0.22)] size-full" data-name="collapsed">
      <Collapse />
      <Menu />
      <div className="absolute flex h-[104px] items-center justify-center left-1/2 top-[307.38px] translate-x-[-50%] w-0" style={{ "--transform-inner-width": "300", "--transform-inner-height": "150" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[104px]">
            <div className="absolute inset-[-0.5px_-0.48%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 105 1">
                <path d="M0.5 0.5L104.5 0.5" id="Line 41" opacity="0.3" stroke="var(--stroke-0, #9FAEC4)" strokeDasharray="2 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <IconFillNotifications />
      <Footer />
    </div>
  );
}