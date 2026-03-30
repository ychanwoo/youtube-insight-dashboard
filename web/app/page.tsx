import AnalyzeSection from "@/components/AnalyzeSection";
import Footer from "@/components/Footer";
import HeaderBar from "@/components/HeadeBar";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-clip bg-[#f8f8f7] text-black">
      {/* 배경 글로우 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 -top-45 h-105 w-105 -translate-x-1/2 rounded-full bg-red-100/60 blur-3xl" />
        <div className="absolute -right-40 top-55 h-80 w-[320px] rounded-full bg-neutral-200/70 blur-3xl" />
      </div>

      {/* 격자 배경 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.35))",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.35))",
        }}
      />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-1 flex-col">
        <HeaderBar />
        <AnalyzeSection />
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
