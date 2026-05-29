import imgRectangle24976 from "figma:asset/346fdc3e76f612a8600da1fd68322c302cd42e1c.png";

interface TutorCardProps {
  name: string;
  image?: string;
}

export default function TutorCard({ name, image }: TutorCardProps) {
  const tutorImage = image || imgRectangle24976;

  return (
    <div className="relative w-[160px] flex-shrink-0 cursor-pointer group">
      {/* Main Card - Pure Glassmorphism Elegance */}
      <div 
        className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[20px] overflow-hidden transition-all duration-300 group-hover:border-white/[0.18] group-hover:-translate-y-1 group-active:scale-[0.98]" 
        style={{ 
          isolation: 'isolate', 
          zIndex: 1,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        
        {/* Image Section */}
        <div className="relative w-full h-[180px] overflow-hidden">
          <img 
            alt={name} 
            className="w-full h-full object-cover" 
            src={tutorImage} 
          />
          
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Name Footer - Ultra-clean glassmorphism */}
        <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.08] border-t border-white/[0.15] px-3 py-3.5">
          <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-tight">
            {name}
          </h4>
        </div>

        {/* Subtle white glow on hover */}
        <div 
          className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      </div>
    </div>
  );
}
