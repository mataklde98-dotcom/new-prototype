export default function Frame() {
  return (
    <div className="bg-[#009379] overflow-clip relative rounded-[14px] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.05)] size-full text-white">
      <p className="absolute font-['Baloo_Bhai_2:Medium',sans-serif] font-medium h-[22px] leading-[normal] left-[12px] text-[18px] top-0 w-[5px] whitespace-pre-wrap">+</p>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Poppins:Medium',sans-serif] h-[21px] justify-center leading-[0] left-[51px] not-italic text-[10px] top-[13.5px] w-[49px]">
        <p className="leading-[normal] whitespace-pre-wrap">Add Task</p>
      </div>
    </div>
  );
}