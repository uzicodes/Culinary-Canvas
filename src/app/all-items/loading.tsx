import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 pt-28">
      <Header />

      <div className="bg-transparent">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative group">
            <div className="w-full h-[48px] bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm"></div>
          </div>
        </div>
      </div>

      <div className="bg-transparent sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`cat1-${i}`} className="h-[34px] w-[80px] bg-white/70 rounded-xl animate-pulse shadow-sm"></div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`cat2-${i}`} className="h-[34px] w-[80px] bg-white/70 rounded-xl animate-pulse shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-[#029FBE] rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg overflow-hidden flex flex-col h-[280px] md:h-[350px] border border-white/5 opacity-70">
              <div className="bg-white/5 h-28 md:h-48 flex items-center justify-center relative overflow-hidden p-1 md:p-2">
                <div className="w-full h-full bg-white/10 animate-pulse rounded-[1.2rem] md:rounded-[2rem]"></div>
              </div>
              <div className="p-3 md:p-6 flex flex-col flex-1 justify-between bg-gradient-to-b from-[#029FBE] to-[#028da8]">
                <div className="flex-1 flex flex-col gap-2 mb-4">
                  <div className="h-3 md:h-4 bg-white/20 animate-pulse rounded w-3/4"></div>
                  <div className="h-2 md:h-3 bg-white/20 animate-pulse rounded w-full mt-2"></div>
                  <div className="h-2 md:h-3 bg-white/20 animate-pulse rounded w-5/6"></div>
                </div>
                <div className="flex items-center justify-between pt-2 md:pt-5 mt-auto border-t border-white/10">
                  <div className="h-4 md:h-6 bg-[#F1F604]/30 animate-pulse rounded w-12 md:w-16"></div>
                  <div className="h-6 w-12 md:h-9 md:w-16 bg-[#F1F604]/20 animate-pulse rounded-lg md:rounded-[1.2rem]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
