export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-800 bg-black text-white ">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left */}
          <div>
            <h2 className="text-lg font-bold text-white">TubeDashboard</h2>
            <p className="mt-2 text-sm text-neutral-400">
              AI-powered YouTube comment insight & analytics platform
            </p>
          </div>

          {/* Right */}
          <div className="text-sm text-neutral-400">
            <p>Soonchunhyang University</p>
            <p> Department of AI and Big Data</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-neutral-800" />

        {/* Bottom */}
        <div className="flex flex-col gap-3 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 TubeDashboard. All rights reserved.</p>

          <div className="flex flex-col md:flex-row md:gap-6">
            <p>20211457 우영찬</p>
            <p>20221293 강동균</p>
            <p>20231466 김태양</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
