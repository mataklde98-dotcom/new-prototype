function Separator() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="_Separator">
      <div aria-hidden="true" className="absolute border-[#e6e6e6] border-solid border-t inset-[-1px_0_0_0] pointer-events-none" />
    </div>
  );
}

function Contents() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-center min-h-px min-w-px relative" data-name="Contents">
      <Separator />
      <div className="flex flex-[1_0_0] flex-col font-['SF_Pro:Medium',sans-serif] font-[510] justify-center leading-[0] min-h-px min-w-px relative text-[17px] text-[rgba(60,60,67,0.3)] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre-wrap">Value</p>
      </div>
    </div>
  );
}

function TextField() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Text Field">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] relative size-full">
          <Contents />
        </div>
      </div>
    </div>
  );
}

function Separator1() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="_Separator">
      <div aria-hidden="true" className="absolute border-[#e6e6e6] border-solid border-t inset-[-1px_0_0_0] pointer-events-none" />
    </div>
  );
}

function CursorAndValue() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Cursor and Value">
      <div className="flex flex-col font-['SF_Pro:Medium',sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[17px] text-black tracking-[-0.43px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px]">Value</p>
      </div>
      <div className="bg-[#08f] h-[22px] rounded-[10px] shrink-0 w-[2px]" data-name="Cursor" />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full" data-name="Text">
      <CursorAndValue />
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal h-full justify-center leading-[0] relative shrink-0 text-[17px] text-[rgba(60,60,67,0.3)] w-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">􀁡</p>
      </div>
    </div>
  );
}

function Contents1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-center min-h-px min-w-px relative" data-name="Contents">
      <Separator1 />
      <Text />
    </div>
  );
}

function TextField1() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Text Field">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] relative size-full">
          <Contents1 />
        </div>
      </div>
    </div>
  );
}

function Separator2() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="_Separator">
      <div aria-hidden="true" className="absolute border-[#e6e6e6] border-solid border-t inset-[-1px_0_0_0] pointer-events-none" />
    </div>
  );
}

function Contents2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-center min-h-px min-w-px relative" data-name="Contents">
      <Separator2 />
      <div className="flex flex-[1_0_0] flex-col font-['SF_Pro:Medium',sans-serif] font-[510] justify-center leading-[0] min-h-px min-w-px relative text-[17px] text-black tracking-[-0.43px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre-wrap">Value</p>
      </div>
    </div>
  );
}

function TextField2() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Text Field">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] relative size-full">
          <Contents2 />
        </div>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center overflow-clip relative rounded-[26px] size-full" data-name="Frame">
      <TextField />
      <TextField1 />
      <TextField2 />
    </div>
  );
}