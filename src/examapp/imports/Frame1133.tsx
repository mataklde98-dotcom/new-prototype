function Frame2() {
  return (
    <div className="content-stretch flex flex-col h-[102px] items-center justify-between leading-[0] not-italic relative shrink-0 text-center">
      <div className="font-['Poppins:SemiBold',sans-serif] leading-[normal] relative shrink-0 text-[14px] text-white w-[216px]">
        <p className="mb-0">Möchtest du die Klassenarbeit</p>
        <p>als erledigt markieren?</p>
      </div>
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center relative shrink-0 text-[10px] text-[rgba(255,255,255,0.7)] w-[186px]">
        <p className="leading-[18px]">Die Klassenarbeit wird dadurch als erledigt markiert, und die KI schlägt keine weiteren To-Dos mehr vor.</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[112px] items-center left-[67px] top-[25px] w-[192px]">
      <Frame2 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#009379] content-stretch flex gap-[7.01px] h-[37.718px] items-center justify-center px-[14.021px] py-[9.815px] relative rounded-[5.608px] shrink-0 w-[126.623px]" data-name="Button">
      <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#f5f5f5] text-[13px] text-nowrap">
        <p className="leading-[normal]">Ja</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <button className="bg-[#515151] content-stretch cursor-pointer flex gap-[7.01px] h-[37.718px] items-center justify-center px-[14.021px] py-[9.815px] relative rounded-[5.608px] shrink-0 w-[126.623px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#4f4f4f] border-[0.701px] border-solid inset-0 pointer-events-none rounded-[5.608px]" />
      <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-left text-nowrap text-white">
        <p className="leading-[normal]">Abbrechen</p>
      </div>
    </button>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[16.825px] h-[37.718px] items-start left-[28px] top-[143px] w-[270.071px]">
      <Button />
      <Button1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#131313] h-[208px] left-0 rounded-[13.471px] top-0 w-[326px]">
      <div aria-hidden="true" className="absolute border-[#252525] border-[0.701px] border-solid inset-[-0.35px] pointer-events-none rounded-[13.821px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),0px_0px_1.402px_0px_rgba(0,0,0,0.12),0px_14.021px_14.021px_0px_rgba(0,147,121,0.08)]" />
      <Frame3 />
      <Frame />
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="relative size-full">
      <Frame1 />
    </div>
  );
}