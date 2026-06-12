import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Gradient background animation */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#BCE334] rounded-full blur-[150px] animate-pulse"
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Main loader container */}
      <div className="relative flex flex-col items-center">
        {/* Logo container with glow */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Rotating border */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: 'conic-gradient(from 0deg, transparent, #BCE334, transparent)',
              animationDuration: '2s',
              animationTimingFunction: 'linear'
            }}
          />

          {/* Inner circle with logo - slightly smaller to create border effect */}
          <div className="absolute inset-[3px] rounded-full bg-[#0a0a0a] flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#BCE334]/10 to-transparent flex items-center justify-center border border-[#BCE334]/20">
              <div className="relative w-14 h-14 animate-pulse" style={{ animationDuration: '2s' }}>
                <Image
                  src="/without_BG_logo.png"
                  alt="Loading..."
                  fill
                  className="object-contain drop-shadow-[0_0_15px_rgba(188,227,52,0.5)]"
                  priority
                  sizes="56px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="mt-8 text-center">
          <h1
            className="text-[#BCE334] font-black text-2xl tracking-[0.3em] uppercase"
            style={{ textShadow: '0 0 30px rgba(188, 227, 52, 0.3)' }}
          >
            Culinary Canvas
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
            Preparing your experience
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#BCE334] to-[#9acd32] rounded-full"
            style={{
              width: '30%',
              animation: 'loadingSlide 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Global keyframes using style tag */}
      <style>
        {`
          @keyframes loadingSlide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(250%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
}