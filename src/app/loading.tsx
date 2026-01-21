import Image from 'next/image';

export default function Loading() {
  // Define the font string exactly as it appears in your globals.css @font-face
  const nalinakFont = { fontFamily: "'Nalinak', sans-serif" };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white z-[9999]">
      {/* Animated loader image */}
      <div className="relative w-24 h-24 mb-8 animate-pulse">
        <Image 
            src="/without_BG_logo.png" 
            alt="Loading..." 
            fill 
            className="object-contain" 
            priority
        />
      </div>
      
      <div className="flex flex-col items-center gap-1">
        {/* Using inline style to force the font priority */}
        <span 
          style={nalinakFont}
          className="text-black text-3xl font-normal uppercase tracking-tight"
        >
          CULINARY
        </span>
        <span 
          style={nalinakFont}
          className="text-[#BCE334] text-3xl font-normal uppercase tracking-tight"
        >
          CANVAS
        </span>
      </div>
    </div>
  );
}