import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black z-[9999]">
      {/* Main container */}
      <div className="relative">
        {/* Orbiting dots */}
        <div className="absolute inset-0 w-36 h-36 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#BCE334] rounded-full shadow-[0_0_20px_#BCE334]" />
        </div>
        <div className="absolute inset-0 w-36 h-36 animate-spin" style={{ animationDuration: '3s', animationDelay: '-1s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#BCE334]/70 rounded-full shadow-[0_0_15px_#BCE334]" />
        </div>
        <div className="absolute inset-0 w-36 h-36 animate-spin" style={{ animationDuration: '3s', animationDelay: '-2s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#BCE334]/50 rounded-full shadow-[0_0_10px_#BCE334]" />
        </div>

        {/* Pulsing ring */}
        <div className="absolute inset-0 w-36 h-36 rounded-full border-2 border-[#BCE334]/30 animate-ping" style={{ animationDuration: '2s' }} />
        
        {/* Static outer ring */}
        <div className="w-36 h-36 rounded-full border border-[#BCE334]/20 flex items-center justify-center">
          {/* Inner glowing circle */}
          <div className="w-24 h-24 rounded-full bg-[#BCE334]/5 flex items-center justify-center backdrop-blur-sm border border-[#BCE334]/30"
            style={{ boxShadow: 'inset 0 0 30px rgba(188, 227, 52, 0.1)' }}>
            {/* Logo */}
            <div className="relative w-16 h-16">
              <Image 
                src="/without_BG_logo.png" 
                alt="Loading..." 
                fill 
                className="object-contain" 
                priority
                sizes="64px"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Text with animated dots */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <p className="text-[#BCE334] font-black uppercase text-xl tracking-[0.4em]">
          Culinary Canvas
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#BCE334] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#BCE334] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#BCE334] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}