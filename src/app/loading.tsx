export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white z-[9999]">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
        {/* Inner Ring (Static or Different Speed) */}
        <div className="rounded-full h-10 w-10 bg-emerald-100"></div>
      </div>
    </div>
  );
}