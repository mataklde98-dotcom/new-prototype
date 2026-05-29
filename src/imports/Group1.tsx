import svgPaths from "./svg-ahwy45oz5r";

function Graph() {
  return (
    <div className="absolute inset-[10.27%_7.14%_10.62%_12.86%]" data-name="Graph">
      <div className="absolute inset-[-0.22%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 224 232">
          <g id="Graph">
            <g id="Lines">
              <path clipRule="evenodd" d={svgPaths.p6045100} fillRule="evenodd" id="Polygon" opacity="0.25" stroke="var(--stroke-0, #E4EAF0)" />
              <path clipRule="evenodd" d={svgPaths.p21c24100} fillRule="evenodd" id="Polygon_2" opacity="0.25" stroke="var(--stroke-0, #E4EAF0)" strokeDasharray="6" />
              <path d="M112 231.5V0.5" id="Line" stroke="var(--stroke-0, #E4EAF0)" strokeLinecap="square" />
              <path d="M10.5 58L213.5 175" id="Line_2" stroke="var(--stroke-0, #E4EAF0)" strokeLinecap="square" />
              <path d="M10 175.5L214 57.5" id="Line_3" stroke="var(--stroke-0, #E4EAF0)" strokeLinecap="square" />
            </g>
            <path clipRule="evenodd" d={svgPaths.p38262c00} fill="var(--fill-0, #28B5E1)" fillOpacity="0.1" fillRule="evenodd" id="Path" stroke="var(--stroke-0, #28B5E1)" strokeLinejoin="round" strokeWidth="4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="-translate-y-1/2 absolute contents leading-[20px] left-0 right-0 text-[#9a9fa1] text-[10px] top-1/2 tracking-[0.4167px] uppercase" data-name="Legend">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium left-[84.64%] right-[1.43%] text-right top-[calc(50%+69px)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Chemie
      </p>
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium left-0 right-[74.29%] top-[calc(50%-88px)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        FRANzösisch
      </p>
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium left-[83.21%] right-0 text-right top-[calc(50%-88px)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Deutsch
      </p>
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium left-[8.21%] right-[77.5%] top-[calc(50%+69px)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        POLITIK
      </p>
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium left-[45.36%] right-[38.93%] text-center top-[calc(50%+126px)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        BIOLOGY
      </p>
      <p className="absolute font-['Poppins:Medium',sans-serif] left-[40.71%] not-italic right-[35%] text-center top-[calc(50%-146px)]">Mathematik</p>
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <Graph />
      <Legend />
    </div>
  );
}