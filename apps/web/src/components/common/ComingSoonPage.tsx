import { ReportHeroShowcase } from "./ReportHeroShowcase";

export function ComingSoonPage() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-[#05110c] text-zinc-100">
      <header className="relative z-10 shrink-0 px-5 pt-6 sm:px-10 sm:pt-8">
        <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#C5A059]/70">
          Annual Report 25/26
        </p>
        <h1 className="mt-1 font-serif text-base font-bold tracking-wide text-white sm:text-xl">
          Horana Plantations PLC
        </h1>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center py-6 sm:py-10">
        <ReportHeroShowcase variant="coming-soon" className="w-full py-4" />
      </main>

      <footer className="relative z-10 shrink-0 border-t border-white/5 px-5 py-5 text-center text-[10px] text-zinc-600 sm:py-6">
        &copy; {new Date().getFullYear()} Horana Plantations PLC. All rights reserved.
      </footer>
    </div>
  );
}
