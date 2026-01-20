export default function Loading() {
  // Define the font string exactly as it appears in your globals.css @font-face
  const nalinakFont = { fontFamily: "'Nalinak', sans-serif" };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white z-[9999]">
      {/* Animated loader from your globals.css */}
      <div className="loader mb-8"></div>
      
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