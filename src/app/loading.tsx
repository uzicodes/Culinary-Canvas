export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white z-[9999]">
      <div className="loader"></div>
      <span className="mt-4 text-gray-700 text-lg font-bold tracking-widest" style={{ letterSpacing: '0.2em' }}>CULINARY CANVAS</span>
    </div>
  );
}