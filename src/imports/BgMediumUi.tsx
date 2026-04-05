function Mask() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur() {
  return <div className="absolute backdrop-blur-[40px] bg-[rgba(0,0,0,0.1)] blur-[20px] inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow() {
  return (
    <div className="absolute inset-[-26px]" data-name="Shadow">
      <Mask />
      <Blur />
    </div>
  );
}

function Fill() {
  return (
    <div className="absolute inset-0 opacity-67 rounded-[34px]" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[#ccc] inset-0 mix-blend-color-burn rounded-[34px]" />
        <div className="absolute inset-0 rounded-[34px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.06) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 100%)" }} />
      </div>
    </div>
  );
}

function GlassEffect() {
  return <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[34px]" data-name="Glass Effect" />;
}

export default function BgMediumUi() {
  return (
    <div className="relative size-full" data-name="BG - Medium UI">
      <Shadow />
      <Fill />
      <GlassEffect />
    </div>
  );
}